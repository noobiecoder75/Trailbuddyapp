import axios from 'axios'
import { supabase } from './supabase'

const STRAVA_CLIENT_ID = import.meta.env.VITE_STRAVA_CLIENT_ID
const STRAVA_CLIENT_SECRET = import.meta.env.VITE_STRAVA_CLIENT_SECRET
const STRAVA_REDIRECT_URI = import.meta.env.VITE_STRAVA_REDIRECT_URI

const stravaClient = axios.create({
  baseURL: 'https://www.strava.com/api/v3',
  timeout: 10000
})

// Rate limiting storage (legacy - will be replaced by database)
let rateLimitState = {
  requests: 0,
  windowStart: Date.now(),
  isRateLimited: false,
  retryAfter: null
}

// Rate limit: 100 requests per 15 minutes (900 seconds)
const RATE_LIMIT_REQUESTS = 90 // Leave some buffer
const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes in milliseconds

// User-specific API configuration cache
let userApiConfigCache = new Map()

// Get user's assigned Strava API configuration
const getUserApiConfig = async (userId) => {
  if (!userId) {
    // Fallback to environment variables for backwards compatibility
    return {
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      id: 'fallback'
    }
  }

  // Check cache first
  if (userApiConfigCache.has(userId)) {
    return userApiConfigCache.get(userId)
  }

  try {
    // Get user's assigned API config
    const { data: assignment, error: assignmentError } = await supabase
      .from('user_strava_config_assignments')
      .select(`
        strava_config_id,
        strava_api_configs(
          id,
          name,
          client_id,
          client_secret,
          is_active,
          daily_limit,
          fifteen_min_limit
        )
      `)
      .eq('user_id', userId)
      .single()

    if (assignmentError || !assignment?.strava_api_configs) {
      console.log('No API config assigned, using fallback')
      const fallbackConfig = {
        client_id: STRAVA_CLIENT_ID,
        client_secret: STRAVA_CLIENT_SECRET,
        id: 'fallback'
      }
      userApiConfigCache.set(userId, fallbackConfig)
      return fallbackConfig
    }

    const config = assignment.strava_api_configs
    userApiConfigCache.set(userId, config)
    return config
  } catch (error) {
    console.error('Error fetching user API config:', error)
    // Fallback to environment variables
    const fallbackConfig = {
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      id: 'fallback'
    }
    userApiConfigCache.set(userId, fallbackConfig)
    return fallbackConfig
  }
}

// Enhanced rate limiting with database persistence
const checkRateLimitDatabase = async (configId) => {
  try {
    // Clean up old rate limit data first
    await supabase.rpc('cleanup_old_rate_limit_data')

    // Get current rate limit state
    const { data: rateLimit, error } = await supabase
      .from('strava_rate_limits')
      .select('*')
      .eq('strava_config_id', configId)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Rate limit check error:', error)
      return true // Allow request if we can't check
    }

    const now = new Date()

    if (!rateLimit) {
      // Initialize rate limit tracking for this config
      const { error: insertError } = await supabase
        .from('strava_rate_limits')
        .insert({
          strava_config_id: configId,
          daily_requests: 1,
          fifteen_min_requests: 1,
          last_request_at: now.toISOString()
        })

      if (insertError) console.error('Rate limit init error:', insertError)
      return true
    }

    // Check if rate limited
    if (rateLimit.is_rate_limited && rateLimit.retry_after && new Date(rateLimit.retry_after) > now) {
      const waitTime = new Date(rateLimit.retry_after) - now
      throw new Error(`Rate limited. Try again in ${Math.ceil(waitTime / 1000)} seconds`)
    }

    // Check daily and 15-minute limits
    const config = await getApiConfig(configId)
    const dailyLimit = config?.daily_limit || 1000
    const fifteenMinLimit = config?.fifteen_min_limit || 90

    if (rateLimit.daily_requests >= dailyLimit) {
      throw new Error('Daily rate limit exceeded')
    }

    if (rateLimit.fifteen_min_requests >= fifteenMinLimit) {
      const retryAfter = new Date(Date.now() + 15 * 60 * 1000)

      await supabase
        .from('strava_rate_limits')
        .update({
          is_rate_limited: true,
          retry_after: retryAfter.toISOString(),
          updated_at: now.toISOString()
        })
        .eq('strava_config_id', configId)

      throw new Error(`15-minute rate limit exceeded. Try again in 15 minutes`)
    }

    // Increment counters
    await supabase
      .from('strava_rate_limits')
      .update({
        daily_requests: rateLimit.daily_requests + 1,
        fifteen_min_requests: rateLimit.fifteen_min_requests + 1,
        last_request_at: now.toISOString(),
        updated_at: now.toISOString()
      })
      .eq('strava_config_id', configId)

    return true
  } catch (error) {
    if (error.message.includes('Rate limited') || error.message.includes('rate limit')) {
      throw error
    }
    console.error('Rate limit database error:', error)
    return true // Allow request if database check fails
  }
}

// Get API config by ID
const getApiConfig = async (configId) => {
  try {
    const { data, error } = await supabase
      .from('strava_api_configs')
      .select('*')
      .eq('id', configId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching API config:', error)
    return null
  }
}

// Legacy rate limit check (for backwards compatibility)
const checkRateLimit = () => {
  const now = Date.now()

  // Reset window if 15 minutes have passed
  if (now - rateLimitState.windowStart > RATE_LIMIT_WINDOW) {
    rateLimitState.requests = 0
    rateLimitState.windowStart = now
    rateLimitState.isRateLimited = false
  }

  // Check if we've exceeded the limit
  if (rateLimitState.requests >= RATE_LIMIT_REQUESTS) {
    rateLimitState.isRateLimited = true
    rateLimitState.retryAfter = rateLimitState.windowStart + RATE_LIMIT_WINDOW
    return false
  }

  return true
}

// Exponential backoff retry function
const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      if (error.response?.status === 429) {
        const retryAfter = error.response.headers['retry-after']
        const delay = retryAfter ? parseInt(retryAfter) * 1000 : baseDelay * Math.pow(2, attempt)

        console.log(`Rate limited, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`)

        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay))
          continue
        }
      }
      throw error
    }
  }
}

// Wrapper for API calls with enhanced rate limiting
const makeApiCall = async (apiCall, userId = null) => {
  let configId = 'fallback'

  if (userId) {
    try {
      const config = await getUserApiConfig(userId)
      configId = config.id
      await checkRateLimitDatabase(configId)
    } catch (error) {
      if (error.message.includes('Rate limited') || error.message.includes('rate limit')) {
        throw error
      }
      console.warn('Enhanced rate limiting failed, falling back to legacy:', error)
    }
  }

  // Fallback to legacy rate limiting if database approach fails
  if (configId === 'fallback') {
    if (!checkRateLimit()) {
      const waitTime = rateLimitState.retryAfter - Date.now()
      throw new Error(`Rate limited. Try again in ${Math.ceil(waitTime / 1000)} seconds`)
    }
    rateLimitState.requests++
  }

  return await retryWithBackoff(apiCall)
}

// Generate Strava OAuth URL with user-specific API config
export const getStravaAuthUrl = async (userId = null) => {
  // Dynamically determine redirect URI based on current domain
  const getRedirectUri = () => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin
      if (origin.includes('trail-mate.ca')) {
        return 'https://trail-mate.ca/auth/strava/callback'
      }
    }
    // Fallback to environment variable for localhost
    return STRAVA_REDIRECT_URI
  }

  let clientId = STRAVA_CLIENT_ID

  if (userId) {
    try {
      const config = await getUserApiConfig(userId)
      clientId = config.client_id
    } catch (error) {
      console.warn('Failed to get user API config, using fallback:', error)
    }
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: getRedirectUri(),
    response_type: 'code',
    scope: 'activity:read,profile:read_all',
    approval_prompt: 'auto'
  })

  return `https://www.strava.com/oauth/authorize?${params.toString()}`
}

// Get redirect URI (same logic as in getStravaAuthUrl)
const getRedirectUri = () => {
  if (typeof window !== 'undefined') {
    const origin = window.location.origin
    if (origin.includes('trail-mate.ca')) {
      return 'https://trail-mate.ca/auth/strava/callback'
    }
  }
  // Fallback to environment variable for localhost
  return STRAVA_REDIRECT_URI
}

// Exchange authorization code for access token
export const exchangeCodeForTokens = async (code, userId = null) => {
  try {
    console.log('=== STRAVA TOKEN EXCHANGE DEBUG ===')
    console.log('Attempting to exchange code for tokens...')
    console.log('User ID:', userId)
    console.log('Code received:', code)
    console.log('Code type:', typeof code)
    console.log('Code length:', code ? code.length : 'No code provided')
    console.log('Code is truthy:', !!code)

    let clientId = STRAVA_CLIENT_ID
    let clientSecret = STRAVA_CLIENT_SECRET
    let configId = 'fallback'

    if (userId) {
      try {
        const config = await getUserApiConfig(userId)
        clientId = config.client_id
        clientSecret = config.client_secret
        configId = config.id
      } catch (error) {
        console.warn('Failed to get user API config for token exchange, using fallback:', error)
      }
    }

    const redirectUri = getRedirectUri()
    console.log('Using redirect URI:', redirectUri)
    console.log('Using config ID:', configId)

    const requestPayload = {
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri  // This must match the redirect_uri used in authorization
    }

    console.log('Request payload:', {
      client_id: requestPayload.client_id ? 'Present' : 'Missing',
      client_secret: requestPayload.client_secret ? 'Present' : 'Missing',
      code: requestPayload.code ? `${requestPayload.code.substring(0, 10)}...` : 'Missing',
      grant_type: requestPayload.grant_type,
      redirect_uri: requestPayload.redirect_uri
    })

    const response = await axios.post('https://www.strava.com/oauth/token', requestPayload)

    console.log('Token exchange successful')

    // Add config ID to response data for later use
    const tokenData = {
      ...response.data,
      strava_config_id: configId
    }

    return tokenData
  } catch (error) {
    console.error('Token exchange failed with detailed error:')
    console.error('Error message:', error.message)
    console.error('Error code:', error.code)
    console.error('Response status:', error.response?.status)
    console.error('Response data:', error.response?.data)
    console.error('Response headers:', error.response?.headers)
    console.error('Request URL:', error.config?.url)
    console.error('Request method:', error.config?.method)
    console.error('Request data:', error.config?.data)

    // Create a more detailed error message
    let errorMessage = 'Failed to exchange code for tokens: ' + error.message

    if (error.response) {
      errorMessage += `\nStatus: ${error.response.status}`
      if (error.response.data) {
        if (typeof error.response.data === 'string') {
          errorMessage += `\nResponse: ${error.response.data}`
        } else {
          errorMessage += `\nResponse: ${JSON.stringify(error.response.data, null, 2)}`
        }
      }

      // Add specific handling for invalid code error
      if (error.response.status === 400 &&
          error.response.data?.errors?.some(e => e.code === 'invalid' && e.field === 'code')) {
        errorMessage += `\n\nTips: This usually means:`
        errorMessage += `\n- The authorization code has expired (they expire in ~10 minutes)`
        errorMessage += `\n- The code has already been used`
        errorMessage += `\n- There's a redirect URI mismatch`
        errorMessage += `\nTry initiating the Strava connection process again.`
      }
    }

    console.error('Complete error message:', errorMessage)
    throw new Error(errorMessage)
  }
}

// Refresh access token
export const refreshAccessToken = async (refreshToken, userId = null) => {
  try {
    console.log('Attempting to refresh access token...')
    console.log('Refresh token length:', refreshToken ? refreshToken.length : 'No refresh token provided')
    console.log('User ID:', userId)

    let clientId = STRAVA_CLIENT_ID
    let clientSecret = STRAVA_CLIENT_SECRET
    let configId = 'fallback'

    if (userId) {
      try {
        const config = await getUserApiConfig(userId)
        clientId = config.client_id
        clientSecret = config.client_secret
        configId = config.id
      } catch (error) {
        console.warn('Failed to get user API config for token refresh, using fallback:', error)
      }
    }

    const response = await axios.post('https://www.strava.com/oauth/token', {
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token'
    })

    console.log('=== TOKEN REFRESH SUCCESSFUL ===')
    console.log('New access token length:', response.data.access_token?.length)
    console.log('New refresh token length:', response.data.refresh_token?.length)
    console.log('Access token expires at:', response.data.expires_at)
    console.log('Access token expires in:', response.data.expires_in, 'seconds')

    // Add config ID to response data
    const tokenData = {
      ...response.data,
      strava_config_id: configId
    }

    return tokenData
  } catch (error) {
    console.error('Token refresh failed with detailed error:')
    console.error('Error message:', error.message)
    console.error('Error code:', error.code)
    console.error('Response status:', error.response?.status)
    console.error('Response data:', error.response?.data)
    console.error('Response headers:', error.response?.headers)

    // Create a more detailed error message
    let errorMessage = 'Failed to refresh token: ' + error.message

    if (error.response) {
      errorMessage += `\nStatus: ${error.response.status}`
      if (error.response.data) {
        if (typeof error.response.data === 'string') {
          errorMessage += `\nResponse: ${error.response.data}`
        } else {
          errorMessage += `\nResponse: ${JSON.stringify(error.response.data, null, 2)}`
        }
      }
    }

    console.error('Complete error message:', errorMessage)
    throw new Error(errorMessage)
  }
}

// Get athlete profile
export const getAthleteProfile = async (accessToken, userId = null) => {
  try {
    const response = await makeApiCall(() => stravaClient.get('/athlete', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }), userId)
    return response.data
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Token expired')
    }
    throw new Error('Failed to fetch athlete profile: ' + error.message)
  }
}

// Get athlete activities
export const getAthleteActivities = async (accessToken, page = 1, perPage = 30, userId = null) => {
  try {
    const response = await makeApiCall(() => stravaClient.get('/athlete/activities', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      params: {
        page,
        per_page: perPage
      }
    }), userId)
    return response.data
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Token expired')
    }
    throw new Error('Failed to fetch activities: ' + error.message)
  }
}

// Get specific activity details
export const getActivityDetails = async (accessToken, activityId, userId = null) => {
  try {
    const response = await makeApiCall(() => stravaClient.get(`/activities/${activityId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }), userId)
    return response.data
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Token expired')
    }
    throw new Error('Failed to fetch activity details: ' + error.message)
  }
}

// Get enhanced rate limit state
export const getRateLimitState = async (userId = null) => {
  if (!userId) {
    // Return legacy rate limit state
    return {
      ...rateLimitState,
      remainingRequests: Math.max(0, RATE_LIMIT_REQUESTS - rateLimitState.requests),
      windowTimeLeft: Math.max(0, (rateLimitState.windowStart + RATE_LIMIT_WINDOW) - Date.now()),
      isEnhanced: false
    }
  }

  try {
    const config = await getUserApiConfig(userId)
    const { data: rateLimit } = await supabase
      .from('strava_rate_limits')
      .select('*')
      .eq('strava_config_id', config.id)
      .single()

    if (!rateLimit) {
      return {
        remainingRequests: config.fifteen_min_limit || 90,
        dailyRemainingRequests: config.daily_limit || 1000,
        windowTimeLeft: 15 * 60 * 1000,
        isRateLimited: false,
        isEnhanced: true
      }
    }

    const now = new Date()
    const windowStart = new Date(rateLimit.fifteen_min_window_start)
    const windowTimeLeft = Math.max(0, (windowStart.getTime() + 15 * 60 * 1000) - now.getTime())

    return {
      remainingRequests: Math.max(0, (config.fifteen_min_limit || 90) - rateLimit.fifteen_min_requests),
      dailyRemainingRequests: Math.max(0, (config.daily_limit || 1000) - rateLimit.daily_requests),
      windowTimeLeft,
      isRateLimited: rateLimit.is_rate_limited,
      retryAfter: rateLimit.retry_after,
      isEnhanced: true
    }
  } catch (error) {
    console.error('Failed to get enhanced rate limit state:', error)
    // Fallback to legacy
    return {
      ...rateLimitState,
      remainingRequests: Math.max(0, RATE_LIMIT_REQUESTS - rateLimitState.requests),
      windowTimeLeft: Math.max(0, (rateLimitState.windowStart + RATE_LIMIT_WINDOW) - Date.now()),
      isEnhanced: false
    }
  }
}

// Clear user API config cache (useful for admin changes)
export const clearUserApiConfigCache = (userId = null) => {
  if (userId) {
    userApiConfigCache.delete(userId)
  } else {
    userApiConfigCache.clear()
  }
}

// Check if user requires manual sync approval
export const requiresManualSyncApproval = async (userId) => {
  try {
    const { data: preferences } = await supabase
      .from('user_sync_preferences')
      .select('manual_sync_only')
      .eq('user_id', userId)
      .single()

    return preferences?.manual_sync_only || false
  } catch (error) {
    console.error('Error checking sync preferences:', error)
    return false // Default to automatic sync if can't check
  }
}

// Request manual sync approval
export const requestSyncApproval = async (userId, requestType = 'activities_sync') => {
  try {
    const { data, error } = await supabase
      .from('strava_sync_requests')
      .insert({
        user_id: userId,
        request_type: requestType,
        status: 'pending'
      })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error requesting sync approval:', error)
    throw new Error('Failed to request sync approval')
  }
}

// Get pending sync requests for user
export const getPendingSyncRequests = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('strava_sync_requests')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'pending')
      .order('requested_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error getting pending sync requests:', error)
    return []
  }
}

// Update sync request status
export const updateSyncRequestStatus = async (requestId, status, errorMessage = null) => {
  try {
    const updateData = {
      status,
      updated_at: new Date().toISOString()
    }

    if (status === 'completed') {
      updateData.completed_at = new Date().toISOString()
    }

    if (errorMessage) {
      updateData.error_message = errorMessage
    }

    const { data, error } = await supabase
      .from('strava_sync_requests')
      .update(updateData)
      .eq('id', requestId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating sync request status:', error)
    throw new Error('Failed to update sync request status')
  }
}

// Export stravaApi object for backwards compatibility
export const stravaApi = {
  getStravaAuthUrl,
  exchangeCodeForTokens,
  refreshAccessToken,
  getAthleteProfile,
  getAthleteActivities,
  getActivityDetails,
  getRateLimitState,
  clearUserApiConfigCache,
  getUserApiConfig,
  requiresManualSyncApproval,
  requestSyncApproval,
  getPendingSyncRequests,
  updateSyncRequestStatus,
  connectStrava: exchangeCodeForTokens
}