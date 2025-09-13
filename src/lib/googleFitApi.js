// Google Fit REST API Integration
// Web-compatible fitness data access via Google Fit API

import { supabase } from './supabase'

const GOOGLE_FIT_BASE_URL = 'https://www.googleapis.com/fitness/v1/users/me'

class GoogleFitApi {
  constructor() {
    this.accessToken = null
    this.tokenExpiry = null
    this.connectionData = null
    this.refreshToken = null
  }

  // Check if user has Google Fit permissions
  async checkFitPermissions() {
    console.log('Checking Google Fit permissions...')
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.provider_token) {
      console.log('No provider token found in session')
      return false
    }

    console.log('Provider token exists, validating scopes...')

    // Check if token includes fitness scopes
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v1/tokeninfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `access_token=${session.provider_token}`
      })

      console.log('Token validation response status:', response.status)
      if (!response.ok) {
        console.log('Token validation failed')
        return false
      }

      const tokenInfo = await response.json()
      console.log('Token info received:', tokenInfo)
      
      const scopes = tokenInfo.scope?.split(' ') || []
      console.log('Available scopes:', scopes)
      
      const hasFitnessScopes = scopes.some(scope => scope.includes('fitness'))
      console.log('Has fitness scopes:', hasFitnessScopes)
      
      return hasFitnessScopes
    } catch (error) {
      console.error('Error checking Fit permissions:')
      console.error('Error message:', error.message)
      console.error('Full error:', error)
      return false
    }
  }

  // Connect to Google Fit (request permissions)
  async connectGoogleFit() {
    try {
      console.log('Starting Google Fit connection process...')
      
      // Check current session first
      const { data: { session } } = await supabase.auth.getSession()
      console.log('Current session:', session ? 'Present' : 'None')
      console.log('Current user:', session?.user?.email || 'None')
      
      if (session?.provider_token) {
        console.log('Existing provider token found, checking scopes...')
        const hasScopes = await this.checkFitPermissions()
        console.log('Has fitness scopes:', hasScopes)
        
        if (hasScopes) {
          console.log('User already has Google Fit permissions')
          return {
            success: true,
            accessToken: session.provider_token,
            providerUserId: session.user.user_metadata?.sub,
            athlete: {
              id: session.user.user_metadata?.sub,
              name: session.user.user_metadata?.full_name,
              email: session.user.email
            },
            message: 'Google Fit already connected'
          }
        }
      }
      
      console.log('Initiating Google OAuth with Fit scopes...')
      const redirectUrl = `${window.location.origin}/auth/health/callback?provider=google_health`
      console.log('Redirect URL:', redirectUrl)
      
      // Sign in with Google including Fit scopes (without signing out existing session)
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          scopes: [
            'openid',
            'email', 
            'profile',
            'https://www.googleapis.com/auth/fitness.activity.read',
            'https://www.googleapis.com/auth/fitness.body.read',
            'https://www.googleapis.com/auth/fitness.location.read',
            'https://www.googleapis.com/auth/fitness.heart_rate.read',
            'https://www.googleapis.com/auth/fitness.sleep.read'
          ].join(' '),
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      })

      console.log('OAuth initiation result:', { data, error })
      if (error) {
        console.error('OAuth initiation error:', error)
        throw error
      }

      return {
        success: true,
        message: 'Redirecting to Google for Fit permissions...'
      }
    } catch (error) {
      console.error('Error connecting to Google Fit:')
      console.error('Error message:', error.message)
      console.error('Error code:', error.code)
      console.error('Full error object:', error)
      throw new Error('Failed to connect to Google Fit: ' + error.message)
    }
  }

  // Refresh access token using refresh token
  async refreshAccessToken(refreshToken) {
    console.log('Attempting to refresh Google access token...')
    
    try {
      // Use Google OAuth2 token endpoint to refresh
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          refresh_token: refreshToken,
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
          client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET || '',
          grant_type: 'refresh_token'
        })
      })
      
      if (!response.ok) {
        const error = await response.json()
        console.error('Token refresh failed:', error)
        throw new Error('Failed to refresh token')
      }
      
      const data = await response.json()
      console.log('Token refreshed successfully')
      
      // Update stored token in database
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase
          .from('user_health_connections')
          .update({
            access_token: data.access_token,
            expires_at: new Date(Date.now() + (data.expires_in * 1000)).toISOString()
          })
          .eq('user_id', user.id)
          .eq('provider_type', 'google_health')
      }
      
      return data.access_token
    } catch (error) {
      console.error('Error refreshing token:', error)
      throw error
    }
  }

  // Get access token from Supabase session or database
  async getAccessToken() {
    console.log('Getting Google Fit access token...')
    
    // First try to get from session
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session?.provider_token) {
      console.log('Access token found in session')
      this.accessToken = session.provider_token
      return this.accessToken
    }
    
    console.log('No session token, checking database...')
    
    // Fallback: Get from database if we have connection data
    if (this.connectionData && this.connectionData.access_token) {
      console.log('Using access token from connection data')
      this.accessToken = this.connectionData.access_token
      
      // Check if token might be expired
      if (this.connectionData.expires_at) {
        const expiresAt = new Date(this.connectionData.expires_at)
        const now = new Date()
        if (expiresAt <= now) {
          console.log('Access token expired, needs refresh')
          if (this.connectionData.refresh_token) {
            console.log('Refresh token available, refreshing...')
            try {
              const newToken = await this.refreshAccessToken(this.connectionData.refresh_token)
              this.accessToken = newToken
              return this.accessToken
            } catch (error) {
              console.error('Failed to refresh token:', error)
              // Continue with potentially expired token
            }
          }
        }
      }
      
      return this.accessToken
    }
    
    // Last resort: Try to get from database directly
    console.log('Attempting to fetch token from database...')
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const { data: connection, error } = await supabase
        .from('user_health_connections')
        .select('access_token, refresh_token, expires_at')
        .eq('user_id', user.id)
        .eq('provider_type', 'google_health')
        .eq('is_active', true)
        .single()
      
      if (!error && connection?.access_token) {
        console.log('Found token in database')
        this.accessToken = connection.access_token
        this.connectionData = connection
        return this.accessToken
      }
    }
    
    throw new Error('No Google access token available. Please reconnect Google Fit.')
  }

  // Fetch data from Google Fit API
  async fetchFitData(endpoint, options = {}) {
    const token = await this.getAccessToken()
    
    const response = await fetch(`${GOOGLE_FIT_BASE_URL}${endpoint}`, {
      method: options.method || 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: options.body ? JSON.stringify(options.body) : undefined
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Google Fit API error: ${error.error?.message || response.statusText}`)
    }

    return response.json()
  }

  // Get daily activity summary (steps, calories, distance)
  async getDailyActivity(date = new Date()) {
    const startTime = new Date(date)
    startTime.setHours(0, 0, 0, 0)
    
    const endTime = new Date(date)
    endTime.setHours(23, 59, 59, 999)

    const requestBody = {
      aggregateBy: [
        { dataTypeName: 'com.google.step_count.delta' },
        { dataTypeName: 'com.google.calories.expended' },
        { dataTypeName: 'com.google.distance.delta' }
      ],
      bucketByTime: { durationMillis: 86400000 }, // 1 day
      startTimeMillis: startTime.getTime(),
      endTimeMillis: endTime.getTime()
    }

    try {
      const data = await this.fetchFitData('/dataset:aggregate', {
        method: 'POST',
        body: requestBody
      })

      return this.parseDailyActivity(data)
    } catch (error) {
      console.error('Error fetching daily activity:', error)
      throw error
    }
  }

  // Get workout sessions
  async getWorkoutSessions(days = 30) {
    const endTime = new Date()
    const startTime = new Date(endTime.getTime() - (days * 24 * 60 * 60 * 1000))

    try {
      const data = await this.fetchFitData(
        `/sessions?startTime=${startTime.toISOString()}&endTime=${endTime.toISOString()}`
      )

      return this.parseWorkoutSessions(data.session || [])
    } catch (error) {
      console.error('Error fetching workout sessions:', error)
      throw error
    }
  }

  // Get activities for health context
  async getActivities(forceRefresh = false, connectionData = null) {
    try {
      console.log('GoogleFitApi.getActivities called')
      console.log('Connection data provided:', !!connectionData)
      console.log('Force refresh:', forceRefresh)
      
      // Store connection data for token retrieval
      if (connectionData) {
        this.connectionData = connectionData
        console.log('Stored connection data for token retrieval')
      }
      
      const endDate = new Date()
      const startDate = new Date(endDate.getTime() - (30 * 24 * 60 * 60 * 1000))

      console.log('Fetching Google Fit data from', startDate.toISOString(), 'to', endDate.toISOString())

      // Fetch both daily summaries and workout sessions
      const [dailyData, sessions] = await Promise.all([
        this.getAggregatedData(startDate, endDate),
        this.getWorkoutSessions(30)
      ])

      console.log('Retrieved', dailyData.length, 'days of daily data')
      console.log('Retrieved', sessions.length, 'workout sessions')

      const activities = []

      // Add workout sessions
      sessions.forEach(session => {
        activities.push({
          id: session.id,
          activityType: this.mapActivityType(session.activityType),
          name: session.name || session.description || 'Workout',
          startTime: new Date(parseInt(session.startTimeMillis)).toISOString(),
          duration: Math.floor((session.endTimeMillis - session.startTimeMillis) / 1000),
          calories: session.calories,
          distance: session.distance,
          steps: session.steps,
          activityLevel: this.calculateActivityLevel(session),
          source: 'google_fit'
        })
      })

      // Add daily summaries (for days without specific workouts)
      dailyData.forEach(day => {
        if (day.steps > 1000 && !this.hasWorkoutOnDay(sessions, day.date)) {
          activities.push({
            id: `google_fit_daily_${day.date}`,
            activityType: 'daily_activity',
            name: `Daily Activity - ${day.steps.toLocaleString()} steps`,
            startTime: day.date + 'T00:00:00Z',
            duration: 86400,
            steps: day.steps,
            distance: day.distance,
            calories: day.calories,
            activityLevel: day.steps > 10000 ? 'active' : day.steps > 5000 ? 'moderate' : 'light',
            source: 'google_fit'
          })
        }
      })

      console.log('Total activities prepared:', activities.length)
      return activities.sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
    } catch (error) {
      console.error('Error fetching Google Fit activities:')
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
      throw error
    }
  }

  // Get aggregated daily data
  async getAggregatedData(startDate, endDate) {
    const requestBody = {
      aggregateBy: [
        { dataTypeName: 'com.google.step_count.delta' },
        { dataTypeName: 'com.google.calories.expended' },
        { dataTypeName: 'com.google.distance.delta' }
      ],
      bucketByTime: { durationMillis: 86400000 }, // 1 day buckets
      startTimeMillis: startDate.getTime(),
      endTimeMillis: endDate.getTime()
    }

    try {
      const data = await this.fetchFitData('/dataset:aggregate', {
        method: 'POST',
        body: requestBody
      })

      return this.parseAggregatedData(data)
    } catch (error) {
      console.error('Error fetching aggregated data:', error)
      return []
    }
  }

  // Parse daily activity data
  parseDailyActivity(data) {
    const result = {
      date: new Date().toISOString().split('T')[0],
      steps: 0,
      calories: 0,
      distance: 0
    }

    if (!data.bucket || data.bucket.length === 0) {
      return result
    }

    const bucket = data.bucket[0]
    bucket.dataset?.forEach(dataset => {
      dataset.point?.forEach(point => {
        point.value?.forEach(value => {
          if (dataset.dataSourceId.includes('step_count')) {
            result.steps = value.intVal || 0
          } else if (dataset.dataSourceId.includes('calories')) {
            result.calories = Math.round(value.fpVal || 0)
          } else if (dataset.dataSourceId.includes('distance')) {
            result.distance = Math.round(value.fpVal || 0)
          }
        })
      })
    })

    return result
  }

  // Parse aggregated data
  parseAggregatedData(data) {
    const results = []

    data.bucket?.forEach(bucket => {
      const date = new Date(parseInt(bucket.startTimeMillis))
      const dayData = {
        date: date.toISOString().split('T')[0],
        steps: 0,
        calories: 0,
        distance: 0
      }

      bucket.dataset?.forEach(dataset => {
        dataset.point?.forEach(point => {
          point.value?.forEach(value => {
            if (dataset.dataSourceId.includes('step_count')) {
              dayData.steps = value.intVal || 0
            } else if (dataset.dataSourceId.includes('calories')) {
              dayData.calories = Math.round(value.fpVal || 0)
            } else if (dataset.dataSourceId.includes('distance')) {
              dayData.distance = Math.round(value.fpVal || 0)
            }
          })
        })
      })

      if (dayData.steps > 0 || dayData.calories > 0) {
        results.push(dayData)
      }
    })

    return results
  }

  // Parse workout sessions
  parseWorkoutSessions(sessions) {
    return sessions.map(session => ({
      id: session.id,
      name: session.name || this.getActivityName(session.activityType),
      activityType: session.activityType,
      startTimeMillis: parseInt(session.startTimeMillis),
      endTimeMillis: parseInt(session.endTimeMillis),
      duration: (parseInt(session.endTimeMillis) - parseInt(session.startTimeMillis)) / 1000,
      description: session.description,
      application: session.application?.name || 'Google Fit'
    }))
  }

  // Map Google Fit activity types to our format
  mapActivityType(googleFitType) {
    const typeMap = {
      7: 'walking',
      8: 'running',
      1: 'cycling',
      72: 'gym',
      109: 'swimming',
      112: 'hiking'
    }
    
    return typeMap[googleFitType] || 'workout'
  }

  // Get human-readable activity name
  getActivityName(activityType) {
    const nameMap = {
      7: 'Walking',
      8: 'Running',
      1: 'Cycling',
      72: 'Gym Workout',
      109: 'Swimming',
      112: 'Hiking'
    }
    
    return nameMap[activityType] || 'Workout'
  }

  // Calculate activity level based on duration and type
  calculateActivityLevel(session) {
    const duration = (session.endTimeMillis - session.startTimeMillis) / 1000
    
    if (duration > 3600) return 'very_active'
    if (duration > 1800) return 'active'
    if (duration > 900) return 'moderate'
    return 'light'
  }

  // Check if there's a workout on a specific day
  hasWorkoutOnDay(sessions, dateStr) {
    return sessions.some(session => {
      const sessionDate = new Date(parseInt(session.startTimeMillis))
      return sessionDate.toISOString().split('T')[0] === dateStr
    })
  }

  // Get heart rate data
  async getHeartRateData(startDate, endDate) {
    const requestBody = {
      aggregateBy: [
        { dataTypeName: 'com.google.heart_rate.bpm' }
      ],
      bucketByTime: { durationMillis: 3600000 }, // 1 hour buckets
      startTimeMillis: startDate.getTime(),
      endTimeMillis: endDate.getTime()
    }

    try {
      const data = await this.fetchFitData('/dataset:aggregate', {
        method: 'POST',
        body: requestBody
      })

      return this.parseHeartRateData(data)
    } catch (error) {
      console.error('Error fetching heart rate data:', error)
      return []
    }
  }

  // Parse heart rate data
  parseHeartRateData(data) {
    const results = []

    data.bucket?.forEach(bucket => {
      bucket.dataset?.forEach(dataset => {
        dataset.point?.forEach(point => {
          point.value?.forEach(value => {
            if (value.fpVal) {
              results.push({
                timestamp: new Date(parseInt(point.startTimeNanos) / 1000000),
                heartRate: Math.round(value.fpVal)
              })
            }
          })
        })
      })
    })

    return results
  }

  // Get sleep data
  async getSleepData(days = 7) {
    const endTime = new Date()
    const startTime = new Date(endTime.getTime() - (days * 24 * 60 * 60 * 1000))

    try {
      const data = await this.fetchFitData(
        `/sessions?activityType=72&startTime=${startTime.toISOString()}&endTime=${endTime.toISOString()}`
      )

      return this.parseSleepSessions(data.session || [])
    } catch (error) {
      console.error('Error fetching sleep data:', error)
      return []
    }
  }

  // Parse sleep sessions
  parseSleepSessions(sessions) {
    return sessions.map(session => ({
      id: session.id,
      startTime: new Date(parseInt(session.startTimeMillis)),
      endTime: new Date(parseInt(session.endTimeMillis)),
      duration: (parseInt(session.endTimeMillis) - parseInt(session.startTimeMillis)) / 1000 / 3600, // hours
      quality: session.description || 'Unknown'
    }))
  }
}

export const googleFitApi = new GoogleFitApi()