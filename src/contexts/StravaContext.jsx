import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
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
  const [stravaTokens, setStravaTokens] = useState(null)
  const [athlete, setAthlete] = useState(null)
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Load stored Strava tokens when user changes
  useEffect(() => {
    if (user) {
      loadStravaTokens()
    } else {
      setStravaTokens(null)
      setAthlete(null)
      setActivities([])
    }
  }, [user])

  const loadStravaTokens = async () => {
    try {
      const { data, error } = await supabase
        .from('user_strava_tokens')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data) {
        setStravaTokens(data)
        // Load athlete profile if tokens exist
        try {
          const profile = await getAthleteProfile(data.access_token)
          setAthlete(profile)
        } catch (error) {
          if (error.message === 'Token expired') {
            await handleTokenRefresh(data.refresh_token)
          }
        }
      }
    } catch (error) {
      console.error('Error loading Strava tokens:', error)
    }
  }

  const handleTokenRefresh = async (refreshToken) => {
    try {
      const tokens = await refreshAccessToken(refreshToken)
      await saveStravaTokens(tokens)
      const profile = await getAthleteProfile(tokens.access_token)
      setAthlete(profile)
    } catch (error) {
      console.error('Error refreshing token:', error)
      setError('Failed to refresh Strava token')
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
    setLoading(true)
    setError(null)

    try {
      const tokens = await exchangeCodeForTokens(code)
      await saveStravaTokens(tokens)
      
      // Get athlete profile
      const profile = await getAthleteProfile(tokens.access_token)
      setAthlete(profile)
      
      return true
    } catch (error) {
      setError(error.message)
      return false
    } finally {
      setLoading(false)
    }
  }

  const disconnectStrava = async () => {
    try {
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

  const fetchActivities = async (page = 1, perPage = 30) => {
    if (!stravaTokens) return []

    setLoading(true)
    setError(null)

    try {
      const activitiesData = await getAthleteActivities(stravaTokens.access_token, page, perPage)
      setActivities(activitiesData)
      return activitiesData
    } catch (error) {
      if (error.message === 'Token expired') {
        await handleTokenRefresh(stravaTokens.refresh_token)
        // Retry after refresh
        const activitiesData = await getAthleteActivities(stravaTokens.access_token, page, perPage)
        setActivities(activitiesData)
        return activitiesData
      } else {
        setError(error.message)
        return []
      }
    } finally {
      setLoading(false)
    }
  }

  const value = {
    stravaTokens,
    athlete,
    activities,
    loading,
    error,
    connectStrava,
    disconnectStrava,
    fetchActivities,
    isConnected: !!stravaTokens && !!athlete
  }

  return (
    <StravaContext.Provider value={value}>
      {children}
    </StravaContext.Provider>
  )
}