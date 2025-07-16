import axios from 'axios'

const STRAVA_CLIENT_ID = import.meta.env.VITE_STRAVA_CLIENT_ID
const STRAVA_CLIENT_SECRET = import.meta.env.VITE_STRAVA_CLIENT_SECRET
const STRAVA_REDIRECT_URI = import.meta.env.VITE_STRAVA_REDIRECT_URI

const stravaApi = axios.create({
  baseURL: 'https://www.strava.com/api/v3',
  timeout: 10000
})

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
    const response = await stravaApi.get('/athlete', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch athlete profile: ' + error.message)
  }
}

// Get athlete activities
export const getAthleteActivities = async (accessToken, page = 1, perPage = 30) => {
  try {
    const response = await stravaApi.get('/athlete/activities', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      params: {
        page,
        per_page: perPage
      }
    })
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
    const response = await stravaApi.get(`/activities/${activityId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch activity details: ' + error.message)
  }
}