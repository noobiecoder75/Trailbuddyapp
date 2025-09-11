// Google Health Connect Web Integration
// Provides web-based access to Health Connect data on Android devices

const HEALTH_CONNECT_PACKAGE = 'com.google.android.apps.healthdata'
const HEALTH_CONNECT_WEB_URL = 'https://health.google.com/health-connect-android/'

class GoogleHealthApi {
  constructor() {
    this.isSupported = this.checkSupport()
    this.connectionState = {
      isConnected: false,
      permissions: [],
      lastSync: null
    }
  }

  checkSupport() {
    // Check if running on Android and if Health Connect APIs are available
    const userAgent = navigator.userAgent || navigator.vendor || window.opera
    const isAndroid = /android/i.test(userAgent)
    
    // Check for Health Connect support in Chrome
    const hasHealthConnectSupport = 'wakeLock' in navigator && isAndroid
    
    return isAndroid && hasHealthConnectSupport
  }

  async connectGoogleHealth(platform) {
    if (!this.isSupported) {
      throw new Error('Health Connect is only available on Android devices')
    }

    try {
      // Method 1: Try Health Connect Web Intent (Android Chrome)
      if (this.supportsWebIntents()) {
        return await this.connectViaWebIntent()
      }
      
      // Method 2: Deep link to Health Connect app
      return await this.connectViaDeepLink()
      
    } catch (error) {
      console.error('Google Health connection failed:', error)
      throw new Error('Failed to connect to Google Health: ' + error.message)
    }
  }

  supportsWebIntents() {
    return 'navigator' in window && 
           'share' in navigator && 
           /Chrome/i.test(navigator.userAgent)
  }

  async connectViaWebIntent() {
    // Use Android Web Intent to launch Health Connect permission flow
    const intentUrl = this.buildHealthConnectIntent()
    
    // Create a promise that resolves when user returns from Health Connect
    return new Promise((resolve, reject) => {
      const startTime = Date.now()
      
      // Listen for page focus/visibility changes to detect return from Health Connect
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          const returnTime = Date.now()
          
          // If user was away for more than 3 seconds, likely went to Health Connect
          if (returnTime - startTime > 3000) {
            document.removeEventListener('visibilitychange', handleVisibilityChange)
            
            // Check if connection was successful
            this.verifyConnection()
              .then(result => resolve(result))
              .catch(error => reject(error))
          }
        }
      }
      
      document.addEventListener('visibilitychange', handleVisibilityChange)
      
      // Launch Health Connect
      window.location.href = intentUrl
      
      // Fallback timeout
      setTimeout(() => {
        document.removeEventListener('visibilitychange', handleVisibilityChange)
        reject(new Error('Health Connect connection timed out'))
      }, 30000)
    })
  }

  buildHealthConnectIntent() {
    const permissions = [
      'android.permission.health.READ_STEPS',
      'android.permission.health.READ_DISTANCE',
      'android.permission.health.READ_CALORIES_BURNED',
      'android.permission.health.READ_EXERCISE',
      'android.permission.health.READ_HEART_RATE',
      'android.permission.health.READ_SLEEP'
    ]
    
    // Android intent URL to launch Health Connect permissions
    const intentData = {
      action: 'android.intent.action.VIEW_PERMISSION_USAGE',
      package: HEALTH_CONNECT_PACKAGE,
      extra_permissions: permissions,
      return_url: window.location.origin + '/health-connect-callback'
    }
    
    const params = new URLSearchParams()
    params.append('intent', JSON.stringify(intentData))
    
    return `intent://health-connect/permissions?${params.toString()}#Intent;scheme=health-connect;package=${HEALTH_CONNECT_PACKAGE};end`
  }

  async connectViaDeepLink() {
    // Fallback: Deep link to Health Connect with callback URL
    const callbackUrl = encodeURIComponent(window.location.origin + '/health-connect-callback')
    const permissions = 'steps,distance,calories,exercise,heart_rate,sleep'
    
    const deepLinkUrl = `${HEALTH_CONNECT_WEB_URL}auth?` +
      `callback_url=${callbackUrl}&` +
      `permissions=${permissions}&` +
      `client_id=${encodeURIComponent(window.location.origin)}`
    
    // Store connection attempt in localStorage
    localStorage.setItem('health_connect_auth_attempt', JSON.stringify({
      timestamp: Date.now(),
      permissions: permissions.split(','),
      callback_url: window.location.origin + '/health-connect-callback'
    }))
    
    // Open Health Connect in new window/tab
    const healthWindow = window.open(deepLinkUrl, 'health_connect_auth', 
      'width=400,height=600,scrollbars=yes,resizable=yes')
    
    return new Promise((resolve, reject) => {
      // Listen for messages from the popup
      const messageHandler = (event) => {
        if (event.origin !== window.location.origin) return
        
        if (event.data.type === 'HEALTH_CONNECT_SUCCESS') {
          window.removeEventListener('message', messageHandler)
          if (healthWindow) healthWindow.close()
          resolve(event.data.result)
        } else if (event.data.type === 'HEALTH_CONNECT_ERROR') {
          window.removeEventListener('message', messageHandler)
          if (healthWindow) healthWindow.close()
          reject(new Error(event.data.error))
        }
      }
      
      window.addEventListener('message', messageHandler)
      
      // Check if window is closed manually
      const checkClosed = setInterval(() => {
        if (healthWindow && healthWindow.closed) {
          clearInterval(checkClosed)
          window.removeEventListener('message', messageHandler)
          
          // Check localStorage for success/failure
          this.checkConnectionStatus()
            .then(result => resolve(result))
            .catch(error => reject(error))
        }
      }, 1000)
      
      // Timeout after 5 minutes
      setTimeout(() => {
        clearInterval(checkClosed)
        window.removeEventListener('message', messageHandler)
        if (healthWindow) healthWindow.close()
        reject(new Error('Health Connect authentication timed out'))
      }, 300000)
    })
  }

  async verifyConnection() {
    // Verify Health Connect connection was successful
    try {
      // Check localStorage for connection tokens/status
      const authData = localStorage.getItem('health_connect_auth_success')
      if (authData) {
        const parsedData = JSON.parse(authData)
        localStorage.removeItem('health_connect_auth_success')
        
        return {
          success: true,
          providerUserId: parsedData.user_id,
          accessToken: parsedData.access_token,
          refreshToken: parsedData.refresh_token,
          expiresAt: parsedData.expires_at,
          scopes: parsedData.permissions || [],
          metadata: {
            health_connect_version: parsedData.version,
            supported_data_types: parsedData.data_types
          }
        }
      }
      
      // Alternative: Try to access Health Connect data directly
      if (this.supportsHealthConnectAPI()) {
        return await this.testHealthConnectAccess()
      }
      
      throw new Error('Unable to verify Health Connect connection')
    } catch (error) {
      throw new Error('Health Connect verification failed: ' + error.message)
    }
  }

  async checkConnectionStatus() {
    const authAttempt = localStorage.getItem('health_connect_auth_attempt')
    if (!authAttempt) {
      throw new Error('No Health Connect authentication attempt found')
    }
    
    const { timestamp } = JSON.parse(authAttempt)
    const elapsed = Date.now() - timestamp
    
    if (elapsed < 10000) {
      throw new Error('Please wait for Health Connect authentication to complete')
    }
    
    // Clean up
    localStorage.removeItem('health_connect_auth_attempt')
    
    // Check for success indicators
    return await this.verifyConnection()
  }

  supportsHealthConnectAPI() {
    // Check if browser supports Health Connect Web APIs (future feature)
    return 'health' in navigator || 
           ('permissions' in navigator && 'health' in navigator.permissions)
  }

  async testHealthConnectAccess() {
    // Test direct access to Health Connect data (if supported)
    try {
      // This is a placeholder for future Health Connect Web API
      const healthData = await this.requestHealthData(['steps'], { days: 1 })
      
      return {
        success: true,
        providerUserId: 'health_connect_user',
        accessToken: 'health_connect_token',
        scopes: ['steps', 'distance', 'calories', 'exercise'],
        metadata: {
          direct_api: true,
          test_data: healthData
        }
      }
    } catch (error) {
      throw new Error('Health Connect API test failed: ' + error.message)
    }
  }

  async getActivities(connection, forceRefresh = false) {
    if (!connection.isConnected) {
      throw new Error('Google Health not connected')
    }
    
    try {
      // If we have direct API access, use it
      if (connection.metadata?.direct_api) {
        return await this.getHealthConnectActivities(connection, forceRefresh)
      }
      
      // Otherwise, use stored/cached data
      return await this.getCachedActivities(connection, forceRefresh)
      
    } catch (error) {
      console.error('Error fetching Google Health activities:', error)
      throw error
    }
  }

  async getHealthConnectActivities(connection, forceRefresh) {
    // Request data from Health Connect APIs (when available)
    const endDate = new Date()
    const startDate = new Date(endDate.getTime() - (30 * 24 * 60 * 60 * 1000)) // 30 days ago
    
    const activities = []
    
    // Get exercise sessions
    const exercises = await this.requestHealthData(['exercise'], {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    })
    
    // Get daily steps/activity data
    const dailyData = await this.requestHealthData(['steps', 'distance', 'calories'], {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      aggregateBy: 'day'
    })
    
    // Combine exercise sessions and daily data
    exercises.forEach(exercise => {
      activities.push({
        id: exercise.id || `exercise_${exercise.startTime}`,
        activityType: exercise.exerciseType || 'workout',
        name: exercise.title || exercise.exerciseType,
        startTime: exercise.startTime,
        duration: exercise.endTime - exercise.startTime,
        calories: exercise.activeCalories,
        distance: exercise.distance,
        steps: exercise.steps,
        averageHeartRate: exercise.averageHeartRate,
        maxHeartRate: exercise.maxHeartRate,
        activityLevel: this.calculateActivityLevel(exercise)
      })
    })
    
    // Add daily activity summaries as activities
    dailyData.forEach(day => {
      if (day.steps > 1000) { // Only include days with significant activity
        activities.push({
          id: `daily_${day.date}`,
          activityType: 'daily_activity',
          name: `Daily Activity - ${day.steps.toLocaleString()} steps`,
          startTime: day.date + 'T00:00:00Z',
          duration: 86400, // Full day in seconds
          steps: day.steps,
          distance: day.distance,
          calories: day.calories,
          activityLevel: day.steps > 10000 ? 'active' : day.steps > 5000 ? 'moderate' : 'light'
        })
      }
    })
    
    return activities.sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
  }

  async getCachedActivities(connection, forceRefresh) {
    // Get activities from localStorage cache or make API request
    const cacheKey = `google_health_activities_${connection.provider_user_id}`
    const cacheExpiry = 60 * 60 * 1000 // 1 hour
    
    if (!forceRefresh) {
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        const { data, timestamp } = JSON.parse(cached)
        if (Date.now() - timestamp < cacheExpiry) {
          return data
        }
      }
    }
    
    // Mock data for testing - replace with actual API calls
    const mockActivities = this.generateMockActivities()
    
    // Cache the results
    localStorage.setItem(cacheKey, JSON.stringify({
      data: mockActivities,
      timestamp: Date.now()
    }))
    
    return mockActivities
  }

  generateMockActivities() {
    // Generate realistic mock activities for testing
    const activities = []
    const now = new Date()
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000))
      const steps = Math.floor(Math.random() * 8000) + 3000
      
      // Daily activity
      activities.push({
        id: `google_daily_${date.toISOString().split('T')[0]}`,
        activityType: 'daily_activity',
        name: `Daily Activity - ${steps.toLocaleString()} steps`,
        startTime: date.toISOString().split('T')[0] + 'T00:00:00Z',
        duration: 86400,
        steps: steps,
        distance: steps * 0.75, // ~0.75m per step
        calories: Math.floor(steps * 0.04),
        activityLevel: steps > 10000 ? 'active' : steps > 5000 ? 'moderate' : 'light'
      })
      
      // Random workouts
      if (Math.random() > 0.6) {
        const workoutTypes = ['running', 'walking', 'cycling', 'gym']
        const workoutType = workoutTypes[Math.floor(Math.random() * workoutTypes.length)]
        const duration = Math.floor(Math.random() * 3600) + 900 // 15 minutes to 1 hour
        
        activities.push({
          id: `google_workout_${date.getTime()}_${workoutType}`,
          activityType: workoutType,
          name: `${workoutType.charAt(0).toUpperCase() + workoutType.slice(1)} Workout`,
          startTime: new Date(date.getTime() + Math.random() * 12 * 60 * 60 * 1000).toISOString(),
          duration: duration,
          distance: workoutType === 'running' ? duration * 3.5 : workoutType === 'cycling' ? duration * 8 : null,
          calories: Math.floor(duration * 0.15),
          averageHeartRate: Math.floor(Math.random() * 50) + 120,
          maxHeartRate: Math.floor(Math.random() * 30) + 160,
          activityLevel: duration > 2400 ? 'very_active' : duration > 1800 ? 'active' : 'moderate'
        })
      }
    }
    
    return activities.sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
  }

  calculateActivityLevel(exercise) {
    const duration = exercise.duration || 0
    const heartRate = exercise.averageHeartRate || 0
    
    if (duration > 3600 || heartRate > 150) return 'very_active'
    if (duration > 1800 || heartRate > 130) return 'active'
    if (duration > 900 || heartRate > 110) return 'moderate'
    return 'light'
  }

  async requestHealthData(dataTypes, options) {
    // Placeholder for actual Health Connect Web API requests
    // This would be replaced with real API calls when Health Connect Web APIs are available
    
    console.log(`Requesting Health Connect data: ${dataTypes.join(', ')}`, options)
    
    // For now, return mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.generateMockHealthData(dataTypes, options))
      }, 500)
    })
  }

  generateMockHealthData(dataTypes, options) {
    const data = {}
    
    dataTypes.forEach(type => {
      switch (type) {
        case 'steps':
          data.steps = Math.floor(Math.random() * 8000) + 3000
          break
        case 'distance':
          data.distance = (data.steps || 5000) * 0.75
          break
        case 'calories':
          data.calories = Math.floor((data.steps || 5000) * 0.04)
          break
        case 'exercise':
          data.exercises = [
            {
              id: 'mock_exercise_1',
              exerciseType: 'running',
              startTime: new Date().toISOString(),
              endTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
              activeCalories: 250,
              distance: 5000,
              averageHeartRate: 145
            }
          ]
          break
      }
    })
    
    return Array.isArray(data) ? data : [data]
  }
}

export const googleHealthApi = new GoogleHealthApi()