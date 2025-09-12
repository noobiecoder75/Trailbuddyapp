// Google Fit REST API Integration
// Web-compatible fitness data access via Google Fit API

import { supabase } from './supabase'

const GOOGLE_FIT_BASE_URL = 'https://www.googleapis.com/fitness/v1/users/me'

class GoogleFitApi {
  constructor() {
    this.accessToken = null
    this.tokenExpiry = null
  }

  // Check if user has Google Fit permissions
  async checkFitPermissions() {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.provider_token) {
      return false
    }

    // Check if token includes fitness scopes
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v1/tokeninfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `access_token=${session.provider_token}`
      })

      if (!response.ok) return false

      const tokenInfo = await response.json()
      const scopes = tokenInfo.scope?.split(' ') || []
      
      return scopes.some(scope => scope.includes('fitness'))
    } catch (error) {
      console.error('Error checking Fit permissions:', error)
      return false
    }
  }

  // Connect to Google Fit (request permissions)
  async connectGoogleFit() {
    try {
      // Sign out first to force re-authentication with new scopes
      await supabase.auth.signOut()
      
      // Sign in with Google including Fit scopes
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          scopes: [
            'https://www.googleapis.com/auth/fitness.activity.read',
            'https://www.googleapis.com/auth/fitness.body.read',
            'https://www.googleapis.com/auth/fitness.location.read',
            'https://www.googleapis.com/auth/fitness.heart_rate.read',
            'https://www.googleapis.com/auth/fitness.sleep.read'
          ].join(' ')
        }
      })

      if (error) throw error

      return {
        success: true,
        message: 'Redirecting to Google for Fit permissions...'
      }
    } catch (error) {
      console.error('Error connecting to Google Fit:', error)
      throw new Error('Failed to connect to Google Fit: ' + error.message)
    }
  }

  // Get access token from Supabase session
  async getAccessToken() {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.provider_token) {
      throw new Error('No Google access token available. Please sign in with Google.')
    }

    this.accessToken = session.provider_token
    return this.accessToken
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
  async getActivities(forceRefresh = false) {
    try {
      const endDate = new Date()
      const startDate = new Date(endDate.getTime() - (30 * 24 * 60 * 60 * 1000))

      // Fetch both daily summaries and workout sessions
      const [dailyData, sessions] = await Promise.all([
        this.getAggregatedData(startDate, endDate),
        this.getWorkoutSessions(30)
      ])

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

      return activities.sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
    } catch (error) {
      console.error('Error fetching Google Fit activities:', error)
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