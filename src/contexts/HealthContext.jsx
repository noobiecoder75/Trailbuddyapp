import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { useDemo } from './DemoContext'
import { supabase } from '../lib/supabase'
import { stravaApi } from '../lib/stravaApi'
import { googleHealthApi } from '../lib/googleHealthApi'
import { appleHealthApi } from '../lib/appleHealthApi'

const HealthContext = createContext({})

export const useHealth = () => {
  const context = useContext(HealthContext)
  if (!context) {
    throw new Error('useHealth must be used within a HealthProvider')
  }
  return context
}

// Platform detection utility
const detectPlatform = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera
  
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return 'ios'
  }
  if (/android/i.test(userAgent)) {
    return 'android'
  }
  return 'web'
}

export const HealthProvider = ({ children }) => {
  const { user } = useAuth()
  const { isDemoMode, demoAthlete, demoActivities } = useDemo()
  
  // Health connections state
  const [healthConnections, setHealthConnections] = useState({})
  const [unifiedActivities, setUnifiedActivities] = useState([])
  const [activityMetrics, setActivityMetrics] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastSyncTime, setLastSyncTime] = useState(null)
  
  // Platform detection
  const [platform] = useState(detectPlatform())
  
  // Load health connections when user changes
  useEffect(() => {
    if (isDemoMode) {
      // Demo mode setup
      setHealthConnections({
        strava: { isConnected: true, athlete: demoAthlete }
      })
      setUnifiedActivities(demoActivities || [])
    } else if (user) {
      loadHealthConnections()
      loadUnifiedActivities()
      loadActivityMetrics()
    } else {
      setHealthConnections({})
      setUnifiedActivities([])
      setActivityMetrics(null)
    }
  }, [user, isDemoMode, demoAthlete, demoActivities])

  const loadHealthConnections = async () => {
    try {
      const { data, error } = await supabase
        .from('user_health_connections')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)

      if (error) throw error

      // Transform array to object keyed by provider_type
      const connections = {}
      data.forEach(conn => {
        connections[conn.provider_type] = {
          ...conn,
          isConnected: true
        }
      })
      
      setHealthConnections(connections)
      
      // Load athlete data for connected providers
      for (const conn of data) {
        if (conn.provider_type === 'strava' && conn.access_token) {
          try {
            const athlete = await stravaApi.getAthleteProfile(conn.access_token)
            setHealthConnections(prev => ({
              ...prev,
              strava: { ...prev.strava, athlete }
            }))
          } catch (err) {
            console.log('Strava token may be expired:', err.message)
          }
        }
      }
    } catch (error) {
      console.error('Error loading health connections:', error)
    }
  }

  const loadUnifiedActivities = async (limit = 50) => {
    try {
      const { data, error } = await supabase
        .from('unified_health_activities')
        .select('*')
        .eq('user_id', user.id)
        .order('start_time', { ascending: false })
        .limit(limit)

      if (error) throw error
      setUnifiedActivities(data || [])
      setLastSyncTime(new Date())
    } catch (error) {
      console.error('Error loading unified activities:', error)
    }
  }

  const loadActivityMetrics = async () => {
    try {
      const { data, error } = await supabase
        .from('user_activity_metrics')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      setActivityMetrics(data)
    } catch (error) {
      console.error('Error loading activity metrics:', error)
    }
  }

  const connectProvider = async (providerType, authData = null) => {
    setLoading(true)
    setError(null)

    try {
      if (isDemoMode) {
        // Demo mode simulation
        await new Promise(resolve => setTimeout(resolve, 1500))
        setHealthConnections(prev => ({
          ...prev,
          [providerType]: { isConnected: true, athlete: demoAthlete }
        }))
        setLoading(false)
        return true
      }

      let connectionResult
      
      switch (providerType) {
        case 'strava':
          connectionResult = await stravaApi.connectStrava(authData)
          break
        case 'google_health':
          connectionResult = await googleHealthApi.connectGoogleHealth(platform)
          break
        case 'apple_health':
          connectionResult = await appleHealthApi.connectAppleHealth(platform)
          break
        default:
          throw new Error(`Unsupported provider: ${providerType}`)
      }

      if (connectionResult.success) {
        // Save connection to database
        const { data, error } = await supabase
          .from('user_health_connections')
          .upsert({
            user_id: user.id,
            provider_type: providerType,
            provider_user_id: connectionResult.providerUserId,
            access_token: connectionResult.accessToken,
            refresh_token: connectionResult.refreshToken,
            expires_at: connectionResult.expiresAt,
            scopes: connectionResult.scopes || [],
            connection_data: connectionResult.metadata || {},
            last_sync_at: new Date().toISOString()
          }, { onConflict: 'user_id,provider_type' })
          .select()
          .single()

        if (error) throw error

        // Update local state
        setHealthConnections(prev => ({
          ...prev,
          [providerType]: {
            ...data,
            isConnected: true,
            athlete: connectionResult.athlete
          }
        }))

        // Trigger initial sync
        await syncProviderActivities(providerType)
        
        return true
      }
      
      return false
    } catch (error) {
      console.error(`Error connecting ${providerType}:`, error)
      setError(error.message)
      return false
    } finally {
      setLoading(false)
    }
  }

  const disconnectProvider = async (providerType) => {
    try {
      if (isDemoMode) {
        setHealthConnections(prev => {
          const updated = { ...prev }
          delete updated[providerType]
          return updated
        })
        return
      }

      const { error } = await supabase
        .from('user_health_connections')
        .update({ is_active: false })
        .eq('user_id', user.id)
        .eq('provider_type', providerType)

      if (error) throw error

      // Update local state
      setHealthConnections(prev => {
        const updated = { ...prev }
        delete updated[providerType]
        return updated
      })

      // Reload activities without this provider's data
      await loadUnifiedActivities()
    } catch (error) {
      console.error(`Error disconnecting ${providerType}:`, error)
      setError(`Failed to disconnect ${providerType}`)
    }
  }

  const syncProviderActivities = async (providerType, forceRefresh = false) => {
    if (isDemoMode) return demoActivities

    const connection = healthConnections[providerType]
    if (!connection || !connection.isConnected) return []

    setLoading(true)
    try {
      let activities = []
      
      switch (providerType) {
        case 'strava':
          activities = await stravaApi.getAthleteActivities(
            connection.access_token, 
            1, 
            30
          )
          break
        case 'google_health':
          activities = await googleHealthApi.getActivities(connection, forceRefresh)
          break
        case 'apple_health':
          activities = await appleHealthApi.getActivities(connection, forceRefresh)
          break
      }

      // Normalize and save activities
      if (activities.length > 0) {
        await saveUnifiedActivities(activities, providerType)
      }

      return activities
    } catch (error) {
      console.error(`Error syncing ${providerType} activities:`, error)
      setError(`Failed to sync ${providerType} activities`)
      return []
    } finally {
      setLoading(false)
    }
  }

  const saveUnifiedActivities = async (activities, providerType) => {
    const normalizedActivities = activities.map(activity => 
      normalizeActivity(activity, providerType)
    )

    try {
      const { error } = await supabase
        .from('unified_health_activities')
        .upsert(normalizedActivities, { 
          onConflict: 'user_id,provider_type,provider_activity_id',
          ignoreDuplicates: false 
        })

      if (error) throw error

      // Reload unified activities
      await loadUnifiedActivities()
      
      // Update activity metrics
      await updateActivityMetrics()
    } catch (error) {
      console.error('Error saving unified activities:', error)
    }
  }

  const normalizeActivity = (activity, providerType) => {
    const baseActivity = {
      user_id: user.id,
      provider_type: providerType,
      raw_data: activity
    }

    switch (providerType) {
      case 'strava':
        return {
          ...baseActivity,
          provider_activity_id: activity.id.toString(),
          activity_type: activity.type.toLowerCase(),
          name: activity.name,
          start_time: activity.start_date,
          duration_seconds: activity.moving_time,
          distance_meters: activity.distance,
          calories_burned: Math.round(activity.calories || 0),
          heart_rate_avg: Math.round(activity.average_heartrate || 0),
          heart_rate_max: Math.round(activity.max_heartrate || 0),
          activity_level: calculateActivityLevel(activity)
        }
      
      case 'google_health':
        return {
          ...baseActivity,
          provider_activity_id: activity.id || `${activity.startTime}_${activity.type}`,
          activity_type: activity.activityType || 'workout',
          name: activity.name || activity.activityType,
          start_time: activity.startTime,
          duration_seconds: activity.duration,
          distance_meters: activity.distance,
          calories_burned: activity.calories,
          steps: activity.steps,
          heart_rate_avg: activity.averageHeartRate,
          heart_rate_max: activity.maxHeartRate,
          activity_level: activity.activityLevel || 'moderate'
        }
      
      case 'apple_health':
        return {
          ...baseActivity,
          provider_activity_id: activity.id || activity.uuid,
          activity_type: activity.workoutActivityType || 'workout',
          name: activity.sourceName || activity.workoutActivityType,
          start_time: activity.startDate,
          duration_seconds: activity.duration,
          distance_meters: activity.totalDistance?.doubleValue,
          calories_burned: activity.totalEnergyBurned?.doubleValue,
          steps: activity.steps,
          heart_rate_avg: activity.averageHeartRate,
          heart_rate_max: activity.maxHeartRate,
          activity_level: calculateActivityLevel(activity)
        }
      
      default:
        return baseActivity
    }
  }

  const calculateActivityLevel = (activity) => {
    // Simple activity level calculation based on intensity/duration
    const duration = activity.duration || activity.moving_time || 0
    const avgSpeed = activity.average_speed || 0
    const heartRate = activity.average_heartrate || activity.averageHeartRate || 0
    
    if (duration < 600) return 'light' // Less than 10 minutes
    if (duration > 3600 || avgSpeed > 4 || heartRate > 150) return 'very_active'
    if (duration > 1800 || avgSpeed > 2 || heartRate > 120) return 'active'
    if (duration > 900 || heartRate > 100) return 'moderate'
    return 'light'
  }

  const updateActivityMetrics = async () => {
    try {
      const { error } = await supabase.rpc('update_user_activity_metrics', {
        user_uuid: user.id
      })
      
      if (error) throw error
      
      // Reload metrics
      await loadActivityMetrics()
    } catch (error) {
      console.error('Error updating activity metrics:', error)
    }
  }

  const syncAllProviders = async (forceRefresh = false) => {
    const connectedProviders = Object.keys(healthConnections)
    const syncPromises = connectedProviders.map(provider => 
      syncProviderActivities(provider, forceRefresh)
    )
    
    try {
      await Promise.allSettled(syncPromises)
      setLastSyncTime(new Date())
    } catch (error) {
      console.error('Error syncing all providers:', error)
    }
  }

  // Check what providers are available for current platform
  const getAvailableProviders = () => {
    return {
      strava: true, // Available on all platforms
      google_health: platform === 'android',
      apple_health: platform === 'ios'
    }
  }

  const value = {
    // Connection state
    healthConnections,
    unifiedActivities,
    activityMetrics,
    loading,
    error,
    lastSyncTime,
    platform,
    
    // Connection management
    connectProvider,
    disconnectProvider,
    syncProviderActivities,
    syncAllProviders,
    
    // Utility functions
    getAvailableProviders,
    
    // Backwards compatibility with existing Strava components
    isConnected: !!healthConnections.strava?.isConnected,
    athlete: healthConnections.strava?.athlete,
    activities: unifiedActivities.filter(a => a.provider_type === 'strava'),
    connectStrava: (code) => connectProvider('strava', code),
    disconnectStrava: () => disconnectProvider('strava'),
    fetchActivities: (page, perPage, forceRefresh) => 
      syncProviderActivities('strava', forceRefresh)
  }

  return (
    <HealthContext.Provider value={value}>
      {children}
    </HealthContext.Provider>
  )
}