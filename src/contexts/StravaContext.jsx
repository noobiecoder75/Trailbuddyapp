import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { useDemo } from './DemoContext'
import { supabase } from '../lib/supabase'
import { exchangeCodeForTokens, refreshAccessToken, getAthleteProfile, getAthleteActivities } from '../lib/stravaApi'

const StravaContext = createContext({})

export const useStrava = () => {
  const context = useContext(StravaContext)
  if (!context) {
    throw new Error('useStrava must be used within a StravaProvider')
  }
  return context
}

export const StravaProvider = ({ children }) => {
  const { user } = useAuth()
  const { isDemoMode, demoAthlete, demoActivities } = useDemo()
  const [stravaTokens, setStravaTokens] = useState(null)
  const [athlete, setAthlete] = useState(null)
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastFetchTime, setLastFetchTime] = useState(null)
  const [isDemoConnected, setIsDemoConnected] = useState(false)

  // Cache duration: 5 minutes for activities, 1 hour for athlete profile
  const ACTIVITIES_CACHE_DURATION = 5 * 60 * 1000
  const ATHLETE_CACHE_DURATION = 60 * 60 * 1000

  // Load stored Strava tokens when user changes
  useEffect(() => {
    if (isDemoMode) {
      // In demo mode, use mock data
      if (isDemoConnected) {
        setAthlete(demoAthlete)
        setActivities(demoActivities)
      }
    } else if (user) {
      loadStravaTokens()
    } else {
      setStravaTokens(null)
      setAthlete(null)
      setActivities([])
    }
  }, [user, isDemoMode, isDemoConnected, demoAthlete, demoActivities])

  const loadStravaTokens = async () => {
    try {
      console.log('=== LOADING STRAVA TOKENS ===')
      console.log('User ID:', user?.id)
      
      const { data, error } = await supabase
        .from('user_strava_tokens')
        .select('*')
        .eq('user_id', user.id)
        .single()

      console.log('Supabase query result:')
      console.log('- Data:', data)
      console.log('- Error:', error)

      if (error && error.code !== 'PGRST116') {
        console.error('Supabase error (not "no rows"):', error)
        throw error
      }

      if (data) {
        console.log('=== TOKENS FOUND IN DATABASE ===')
        console.log('- Access token length:', data.access_token?.length)
        console.log('- Refresh token length:', data.refresh_token?.length)
        console.log('- Expires at:', data.expires_at)
        console.log('- Athlete ID:', data.athlete_id)
        
        setStravaTokens(data)
        console.log('Tokens loaded into state')
        
        // Load athlete profile if tokens exist
        try {
          console.log('Attempting to get athlete profile...')
          const profile = await getAthleteProfile(data.access_token)
          console.log('Athlete profile loaded:', profile?.firstname)
          setAthlete(profile)
        } catch (error) {
          console.log('Athlete profile failed:', error.message)
          if (error.message === 'Token expired') {
            console.log('Token expired, refreshing with refresh token...')
            await handleTokenRefresh(data.refresh_token)
          }
        }
      } else {
        console.log('=== NO TOKENS FOUND IN DATABASE ===')
        console.log('User will need to connect Strava')
      }
    } catch (error) {
      console.error('=== ERROR LOADING STRAVA TOKENS ===')
      console.error('Error loading Strava tokens:', error)
    }
  }

  const handleTokenRefresh = async (refreshToken) => {
    try {
      console.log('=== TOKEN REFRESH START ===')
      console.log('Refresh token provided:', refreshToken ? 'Yes' : 'No')
      console.log('Refresh token length:', refreshToken ? refreshToken.length : 'N/A')
      
      const tokens = await refreshAccessToken(refreshToken)
      console.log('New tokens received:', tokens ? 'Yes' : 'No')
      
      const savedTokens = await saveStravaTokens(tokens)
      console.log('Tokens saved to database:', savedTokens ? 'Yes' : 'No')
      
      const profile = await getAthleteProfile(tokens.access_token)
      console.log('Athlete profile refreshed:', profile?.firstname || 'Unknown')
      setAthlete(profile)
      
      console.log('=== TOKEN REFRESH COMPLETE ===')
      return savedTokens
    } catch (error) {
      console.error('=== TOKEN REFRESH FAILED ===')
      console.error('Refresh error:', error.message)
      console.error('Full refresh error:', error)
      setError('Failed to refresh Strava token')
      throw error
    }
  }

  const saveStravaTokens = async (tokens) => {
    try {
      const tokenData = {
        user_id: user.id,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: new Date(tokens.expires_at * 1000).toISOString(),
        athlete_id: tokens.athlete?.id,
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('user_strava_tokens')
        .upsert(tokenData, { onConflict: 'user_id' })
        .select()
        .single()

      if (error) throw error

      setStravaTokens(data)
      return data
    } catch (error) {
      console.error('Error saving Strava tokens:', error)
      throw error
    }
  }

  const connectStrava = async (code) => {
    console.log('=== CONNECT STRAVA FUNCTION START ===')
    console.log('Received code parameter:', code)
    console.log('Code type:', typeof code)
    console.log('Code is truthy:', !!code)
    console.log('Code length:', code ? code.length : 'N/A')
    console.log('Demo mode state:', isDemoMode)

    setLoading(true)
    setError(null)

    try {
      // Check for demo mode FIRST - both from state and URL parameter
      const urlParams = new URLSearchParams(window.location.search)
      const isDemoFromUrl = urlParams.get('demo') === 'true'
      
      console.log('Demo from URL:', isDemoFromUrl)
      console.log('Final demo mode check:', isDemoMode || isDemoFromUrl)
      
      // Demo mode - simulate connection (check both state and URL)
      if (isDemoMode || isDemoFromUrl) {
        console.log('Demo mode detected, simulating connection...')
        await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API delay
        setIsDemoConnected(true)
        setAthlete(demoAthlete)
        setActivities(demoActivities)
        setLoading(false)
        return true
      }

      // Real OAuth flow - validate code parameter only for non-demo mode
      console.log('=== REAL OAUTH FLOW ===')
      console.log('Validating code parameter...')
      if (!code) {
        console.error('No authorization code provided!')
        throw new Error('No authorization code provided')
      }

      console.log('Code validation passed. Starting OAuth token exchange...')
      console.log('Code being sent to exchangeCodeForTokens:', code)
      
      const tokens = await exchangeCodeForTokens(code)
      console.log('Token exchange completed, saving tokens to database...')
      
      await saveStravaTokens(tokens)
      console.log('Tokens saved successfully, fetching athlete profile...')
      
      // Get athlete profile
      const profile = await getAthleteProfile(tokens.access_token)
      console.log('Athlete profile fetched successfully:', profile?.firstname, profile?.lastname)
      setAthlete(profile)
      
      return true
    } catch (error) {
      console.error('Strava connection failed in connectStrava function:')
      console.error('Error type:', error.constructor.name)
      console.error('Error message:', error.message)
      console.error('Full error object:', error)
      
      setError(error.message)
      return false
    } finally {
      setLoading(false)
    }
  }

  const disconnectStrava = async () => {
    try {
      // Demo mode - just reset connection state
      if (isDemoMode) {
        setIsDemoConnected(false)
        setAthlete(null)
        setActivities([])
        return
      }

      const { error } = await supabase
        .from('user_strava_tokens')
        .delete()
        .eq('user_id', user.id)

      if (error) throw error

      setStravaTokens(null)
      setAthlete(null)
      setActivities([])
    } catch (error) {
      console.error('Error disconnecting Strava:', error)
      setError('Failed to disconnect Strava')
    }
  }

  const fetchActivities = async (page = 1, perPage = 30, forceRefresh = false) => {
    // Demo mode - return demo activities
    if (isDemoMode && isDemoConnected) {
      return demoActivities
    }

    if (!stravaTokens) return []

    // Check cache first
    const now = Date.now()
    if (!forceRefresh && lastFetchTime && activities.length > 0 && 
        (now - lastFetchTime) < ACTIVITIES_CACHE_DURATION) {
      return activities
    }

    setLoading(true)
    setError(null)

    try {
      const activitiesData = await getAthleteActivities(stravaTokens.access_token, page, perPage)
      setActivities(activitiesData)
      setLastFetchTime(now)
      return activitiesData
    } catch (error) {
      if (error.message === 'Token expired') {
        try {
          const refreshedTokens = await handleTokenRefresh(stravaTokens.refresh_token)
          const activitiesData = await getAthleteActivities(refreshedTokens.access_token, page, perPage)
          setActivities(activitiesData)
          setLastFetchTime(now)
          return activitiesData
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError)
          setError('Failed to refresh Strava token')
          return []
        }
      } else {
        console.error('Error fetching activities:', error)
        setError(error.message)
        return []
      }
    } finally {
      setLoading(false)
    }
  }

  // Fallback demo mode detection if isDemoMode is undefined
  const urlParams = new URLSearchParams(window.location.search)
  const isDemoFromUrl = urlParams.get('demo') === 'true'
  const actualDemoMode = isDemoMode ?? isDemoFromUrl
  
  const isConnected = actualDemoMode ? isDemoConnected : (!!stravaTokens && !!athlete)

  const value = {
    stravaTokens,
    athlete,
    activities,
    loading,
    error,
    connectStrava,
    disconnectStrava,
    fetchActivities,
    isConnected
  }

  return (
    <StravaContext.Provider value={value}>
      {children}
    </StravaContext.Provider>
  )
}