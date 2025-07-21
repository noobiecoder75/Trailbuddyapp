import axios from 'axios'

const STRAVA_CLIENT_ID = import.meta.env.VITE_STRAVA_CLIENT_ID
const STRAVA_CLIENT_SECRET = import.meta.env.VITE_STRAVA_CLIENT_SECRET
const STRAVA_REDIRECT_URI = import.meta.env.VITE_STRAVA_REDIRECT_URI

const stravaApi = axios.create({
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
  const params = new URLSearchParams({
    client_id: STRAVA_CLIENT_ID,
    redirect_uri: STRAVA_REDIRECT_URI,
    response_type: 'code',
    scope: 'activity:read,profile:read_all',
    approval_prompt: 'auto'
  })
  
  return `https://www.strava.com/oauth/authorize?${params.toString()}`
}

// Exchange authorization code for access token
export const exchangeCodeForTokens = async (code) => {
  try {
    const response = await axios.post('https://www.strava.com/oauth/token', {
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      code: code,
      grant_type: 'authorization_code'
    })
    
    return response.data
  } catch (error) {
    throw new Error('Failed to exchange code for tokens: ' + error.message)
  }
}

// Refresh access token
export const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await axios.post('https://www.strava.com/oauth/token', {
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: 'refresh_token'
    })
    
    return response.data
  } catch (error) {
    throw new Error('Failed to refresh token: ' + error.message)
  }
}

// Get athlete profile
export const getAthleteProfile = async (accessToken) => {
  try {
    const response = await makeApiCall(() => stravaApi.get('/athlete', {
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
    const response = await makeApiCall(() => stravaApi.get('/athlete/activities', {
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
    const response = await makeApiCall(() => stravaApi.get(`/activities/${activityId}`, {
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