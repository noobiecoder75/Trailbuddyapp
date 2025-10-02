import axios from 'axios'
import { supabase } from './supabase'

const STRAVA_CLIENT_ID = import.meta.env.VITE_STRAVA_CLIENT_ID
const STRAVA_CLIENT_SECRET = import.meta.env.VITE_STRAVA_CLIENT_SECRET
const STRAVA_REDIRECT_URI = import.meta.env.VITE_STRAVA_REDIRECT_URI

const stravaClient = axios.create({
  baseURL: 'https://www.strava.com/api/v3',
  timeout: 10000
})

// Rate limiting storage
let rateLimitState = {
  requests: 0,
  windowStart: Date.now(),
  isRateLimited: false,
  retryAfter: null
}

// Rate limit: 100 requests per 15 minutes (900 seconds)
const RATE_LIMIT_REQUESTS = 90 // Leave some buffer
const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes in milliseconds

// Check if we're within rate limits
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

// Wrapper for API calls with rate limiting
const makeApiCall = async (apiCall) => {
  if (!checkRateLimit()) {
    const waitTime = rateLimitState.retryAfter - Date.now()
    throw new Error(`Rate limited. Try again in ${Math.ceil(waitTime / 1000)} seconds`)
  }
  
  rateLimitState.requests++
  return await retryWithBackoff(apiCall)
}

// Generate Strava OAuth URL
export const getStravaAuthUrl = () => {
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

  const params = new URLSearchParams({
    client_id: STRAVA_CLIENT_ID,
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
export const exchangeCodeForTokens = async (code) => {
  try {
    console.log('=== STRAVA TOKEN EXCHANGE DEBUG ===')
    console.log('Attempting to exchange code for tokens...')
    console.log('Client ID:', STRAVA_CLIENT_ID ? 'Present' : 'Missing')
    console.log('Client Secret:', STRAVA_CLIENT_SECRET ? 'Present' : 'Missing')
    console.log('Code received:', code)
    console.log('Code type:', typeof code)
    console.log('Code length:', code ? code.length : 'No code provided')
    console.log('Code is truthy:', !!code)
    
    const redirectUri = getRedirectUri()
    console.log('Using redirect URI:', redirectUri)
    
    const requestPayload = {
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
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
    return response.data
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
export const refreshAccessToken = async (refreshToken) => {
  try {
    console.log('Attempting to refresh access token...')
    console.log('Refresh token length:', refreshToken ? refreshToken.length : 'No refresh token provided')
    
    const response = await axios.post('https://www.strava.com/oauth/token', {
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: 'refresh_token'
    })
    
    console.log('=== TOKEN REFRESH SUCCESSFUL ===')
    console.log('New access token length:', response.data.access_token?.length)
    console.log('New refresh token length:', response.data.refresh_token?.length)
    console.log('Access token expires at:', response.data.expires_at)
    console.log('Access token expires in:', response.data.expires_in, 'seconds')
    
    return response.data
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
export const getAthleteProfile = async (accessToken) => {
  try {
    const response = await makeApiCall(() => stravaClient.get('/athlete', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }))
    return response.data
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Token expired')
    }
    throw new Error('Failed to fetch athlete profile: ' + error.message)
  }
}

// Get athlete activities
export const getAthleteActivities = async (accessToken, page = 1, perPage = 30) => {
  try {
    const response = await makeApiCall(() => stravaClient.get('/athlete/activities', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      params: {
        page,
        per_page: perPage
      }
    }))
    return response.data
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Token expired')
    }
    throw new Error('Failed to fetch activities: ' + error.message)
  }
}

// Get specific activity details
export const getActivityDetails = async (accessToken, activityId) => {
  try {
    const response = await makeApiCall(() => stravaClient.get(`/activities/${activityId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }))
    return response.data
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Token expired')
    }
    throw new Error('Failed to fetch activity details: ' + error.message)
  }
}

// Export rate limit state for debugging
export const getRateLimitState = () => ({
  ...rateLimitState,
  remainingRequests: Math.max(0, RATE_LIMIT_REQUESTS - rateLimitState.requests),
  windowTimeLeft: Math.max(0, (rateLimitState.windowStart + RATE_LIMIT_WINDOW) - Date.now())
})

// Export stravaApi object for backwards compatibility
export const stravaApi = {
  getStravaAuthUrl,
  exchangeCodeForTokens,
  refreshAccessToken,
  getAthleteProfile,
  getAthleteActivities,
  getActivityDetails,
  getRateLimitState,
  connectStrava: exchangeCodeForTokens
}