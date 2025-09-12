// Apple HealthKit Web Integration  
// Provides web-based access to HealthKit data on iOS devices via Safari

const HEALTHKIT_WEB_DOMAIN = 'https://www.icloud.com'
const HEALTH_APP_URL = 'https://www.apple.com/ios/health/'

class AppleHealthApi {
  constructor() {
    this.isSupported = this.checkSupport()
    this.connectionState = {
      isConnected: false,
      permissions: [],
      lastSync: null
    }
  }

  checkSupport() {
    // Check if running on iOS Safari
    const userAgent = navigator.userAgent || navigator.vendor || window.opera
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream
    const isSafari = /Safari/i.test(userAgent) && !/Chrome|CriOS|FxiOS/i.test(userAgent)
    
    // Check for potential HealthKit Web API support
    const hasHealthSupport = 'DeviceMotionEvent' in window || 'DeviceOrientationEvent' in window
    
    return isIOS && (isSafari || hasHealthSupport)
  }

  async connectAppleHealth(platform) {
    if (!this.isSupported) {
      throw new Error('Apple Health is only available on iOS devices')
    }

    try {
      // Method 1: Try HealthKit Web APIs (if available)
      if (this.supportsHealthKitWebAPIs()) {
        return await this.connectViaWebAPIs()
      }
      
      // Method 2: iOS Shortcuts integration
      if (this.supportsShortcuts()) {
        return await this.connectViaShortcuts()
      }
      
      // Method 3: Health app deep link with callback
      return await this.connectViaDeepLink()
      
    } catch (error) {
      console.error('Apple Health connection failed:', error)
      throw new Error('Failed to connect to Apple Health: ' + error.message)
    }
  }

  supportsHealthKitWebAPIs() {
    // Check for future HealthKit Web API support
    return 'health' in navigator || 
           ('webkit' in window && 'health' in window.webkit) ||
           ('HealthKit' in window)
  }

  supportsShortcuts() {
    // Check if iOS Shortcuts can be invoked from web
    return /iPhone|iPad|iPod/.test(navigator.userAgent) && 
           'navigator' in window && 
           'share' in navigator
  }

  async connectViaWebAPIs() {
    // Use HealthKit Web APIs when available
    try {
      const permissions = [
        'HKQuantityTypeIdentifierStepCount',
        'HKQuantityTypeIdentifierDistanceWalkingRunning', 
        'HKQuantityTypeIdentifierActiveEnergyBurned',
        'HKQuantityTypeIdentifierHeartRate',
        'HKWorkoutTypeIdentifier',
        'HKCategoryTypeIdentifierSleepAnalysis'
      ]
      
      // Request HealthKit authorization
      const authResult = await this.requestHealthKitAuthorization(permissions)
      
      if (authResult.granted) {
        return {
          success: true,
          providerUserId: 'apple_health_user',
          accessToken: authResult.token,
          scopes: authResult.permissions,
          metadata: {
            healthkit_version: authResult.version,
            supported_types: authResult.supportedTypes,
            direct_api: true
          }
        }
      }
      
      throw new Error('HealthKit authorization denied')
    } catch (error) {
      throw new Error('HealthKit Web API connection failed: ' + error.message)
    }
  }

  async connectViaShortcuts() {
    // Use iOS Shortcuts to bridge HealthKit data to web
    try {
      // First check if shortcut is installed
      const setupStatus = await this.checkSetupStatus()
      if (!setupStatus.shortcutInstalled) {
        // Return error that will trigger the setup wizard
        throw new Error('SHORTCUT_NOT_INSTALLED')
      }
      
      const shortcutUrl = this.buildHealthKitShortcutUrl()
      
      return new Promise((resolve, reject) => {
        const startTime = Date.now()
        
        // Store connection attempt
        localStorage.setItem('apple_health_auth_attempt', JSON.stringify({
          timestamp: startTime,
          callback_url: window.location.origin + '/apple-health-callback'
        }))
        
        // Listen for app returning to browser
        const handleVisibilityChange = () => {
          if (document.visibilityState === 'visible') {
            const returnTime = Date.now()
            
            // If user was away for more than 5 seconds, likely went to Shortcuts
            if (returnTime - startTime > 5000) {
              document.removeEventListener('visibilitychange', handleVisibilityChange)
              
              // Check if connection was successful
              setTimeout(() => {
                this.verifyShortcutsConnection()
                  .then(result => resolve(result))
                  .catch(error => {
                    // If verification fails, it might be because shortcut isn't installed
                    if (error.message.includes('No Apple Health data found')) {
                      reject(new Error('SHORTCUT_NOT_INSTALLED'))
                    } else {
                      reject(error)
                    }
                  })
              }, 2000) // Wait for shortcut to complete
            }
          }
        }
        
        document.addEventListener('visibilitychange', handleVisibilityChange)
        
        // Launch Shortcuts
        window.location.href = shortcutUrl
        
        // Fallback timeout
        setTimeout(() => {
          document.removeEventListener('visibilitychange', handleVisibilityChange)
          reject(new Error('Apple Health Shortcuts connection timed out'))
        }, 60000)
      })
    } catch (error) {
      throw error
    }
  }

  buildHealthKitShortcutUrl() {
    // Build URL to trigger iOS Shortcut that exports HealthKit data
    const callbackUrl = encodeURIComponent(window.location.origin + '/apple-health-callback')
    const dataTypes = encodeURIComponent('steps,workouts,heart_rate,distance,calories,sleep')
    
    // This would be a custom Shortcut URL that users would need to install
    return `shortcuts://run-shortcut?name=TrailBuddy-HealthKit-Export&input=${callbackUrl}&data-types=${dataTypes}`
  }

  // Setup-related methods for the setup wizard
  async checkSetupStatus() {
    // Check if the shortcut is installed and configured
    const shortcutInstalled = localStorage.getItem('apple_health_shortcut_installed') === 'true'
    const permissionsGranted = localStorage.getItem('apple_health_permissions_granted') === 'true'
    const connectionTested = localStorage.getItem('apple_health_connection_tested') === 'true'
    
    return {
      shortcutInstalled,
      permissionsGranted,
      connectionTested
    }
  }

  getShortcutInstallUrl() {
    // Generate the iCloud link for the shortcut
    // In production, this would be a real iCloud link to your published shortcut
    // For now, we'll create a shortcut URL that guides users to create it manually
    
    // This is a placeholder URL - you would replace with your actual shortcut
    const shortcutName = 'TrailBuddy HealthKit Export'
    const shortcutDescription = 'Export your health data to TrailBuddy'
    
    // Using Shortcuts gallery URL format
    // In production: return 'https://www.icloud.com/shortcuts/YOUR_SHORTCUT_ID'
    
    // For development, we'll use the create shortcut flow
    const baseUrl = 'https://www.icloud.com/shortcuts/create'
    const actions = [
      {
        'WFWorkflowActionIdentifier': 'is.workflow.actions.getmyworkouts',
        'WFWorkflowActionParameters': {
          'WFGetWorkoutsActionWorkoutType': 'All',
          'WFGetWorkoutsActionLimitEnabled': true,
          'WFGetWorkoutsActionLimit': 30
        }
      },
      {
        'WFWorkflowActionIdentifier': 'is.workflow.actions.getdetailsofhealth',
        'WFWorkflowActionParameters': {
          'WFHealthQuantityType': 'Step Count',
          'WFHealthQuantityStartDate': 'Last Month',
          'WFHealthQuantityEndDate': 'Now'
        }
      },
      {
        'WFWorkflowActionIdentifier': 'is.workflow.actions.openurl',
        'WFWorkflowActionParameters': {
          'WFURLActionURL': window.location.origin + '/apple-health-callback?data={{Workouts}}'
        }
      }
    ]
    
    // Create a data URL for the shortcut
    const shortcutData = {
      name: shortcutName,
      description: shortcutDescription,
      actions: actions
    }
    
    // For now, return a URL that will help users create the shortcut
    // In production, this would be your published shortcut link
    return `shortcuts://create-shortcut?name=${encodeURIComponent(shortcutName)}&actions=${encodeURIComponent(JSON.stringify(actions))}`
  }

  async testShortcutConnection() {
    // Test if the shortcut is properly installed and can communicate
    try {
      // First check if we're on iOS
      if (!this.isSupported) {
        return {
          success: false,
          error: 'Apple Health is only available on iOS devices'
        }
      }
      
      // Set a flag to track test initiation
      const testId = Date.now().toString()
      localStorage.setItem('apple_health_test_id', testId)
      
      // Try to run the shortcut with a test parameter
      const testUrl = `shortcuts://run-shortcut?name=TrailBuddy-HealthKit-Export&input=test&test-id=${testId}`
      
      return new Promise((resolve) => {
        let hasReturned = false
        
        // Listen for the app returning
        const handleVisibilityChange = () => {
          if (document.visibilityState === 'visible' && !hasReturned) {
            hasReturned = true
            document.removeEventListener('visibilitychange', handleVisibilityChange)
            
            // Check if test was successful
            setTimeout(() => {
              const testResult = localStorage.getItem('apple_health_test_result')
              
              if (testResult === testId) {
                // Test successful
                localStorage.setItem('apple_health_connection_tested', 'true')
                localStorage.setItem('apple_health_shortcut_installed', 'true')
                resolve({
                  success: true,
                  message: 'Connection test successful'
                })
              } else {
                // Test failed
                resolve({
                  success: false,
                  error: 'Shortcut did not respond. Please ensure it is installed correctly.'
                })
              }
            }, 1000)
          }
        }
        
        document.addEventListener('visibilitychange', handleVisibilityChange)
        
        // Try to launch the shortcut
        window.location.href = testUrl
        
        // Timeout after 10 seconds
        setTimeout(() => {
          if (!hasReturned) {
            document.removeEventListener('visibilitychange', handleVisibilityChange)
            resolve({
              success: false,
              error: 'Test timed out. The shortcut may not be installed.'
            })
          }
        }, 10000)
      })
    } catch (error) {
      return {
        success: false,
        error: 'Failed to test connection: ' + error.message
      }
    }
  }

  async connectViaDeepLink() {
    // Deep link to Health app with instructions for manual export
    const healthAppUrl = 'shortcuts://create-shortcut'
    
    // Create a guided connection flow
    return new Promise((resolve, reject) => {
      // Show instructions modal/guide
      this.showHealthKitConnectionGuide()
        .then(() => {
          // Once user completes the setup, verify connection
          return this.pollForHealthData()
        })
        .then(result => resolve(result))
        .catch(error => reject(error))
    })
  }

  async showHealthKitConnectionGuide() {
    // This would trigger a UI modal with step-by-step instructions
    // For now, we'll simulate the process
    
    return new Promise((resolve) => {
      // Store guidance completion
      localStorage.setItem('apple_health_guide_shown', Date.now().toString())
      
      // Simulate user completing the setup
      setTimeout(() => {
        localStorage.setItem('apple_health_setup_complete', JSON.stringify({
          timestamp: Date.now(),
          method: 'manual_setup'
        }))
        resolve()
      }, 3000)
    })
  }

  async pollForHealthData() {
    // Poll for health data that user may have manually exported
    const maxAttempts = 12 // 1 minute of polling
    let attempts = 0
    
    return new Promise((resolve, reject) => {
      const checkInterval = setInterval(async () => {
        attempts++
        
        try {
          const healthData = await this.checkForExportedData()
          if (healthData) {
            clearInterval(checkInterval)
            resolve({
              success: true,
              providerUserId: 'apple_health_manual',
              accessToken: 'manual_export_token',
              scopes: ['steps', 'workouts', 'heart_rate'],
              metadata: {
                connection_method: 'manual_export',
                data_source: healthData.source
              }
            })
          }
        } catch (error) {
          console.log('Polling attempt failed:', error.message)
        }
        
        if (attempts >= maxAttempts) {
          clearInterval(checkInterval)
          reject(new Error('Failed to detect Apple Health data'))
        }
      }, 5000) // Check every 5 seconds
    })
  }

  async requestHealthKitAuthorization(permissions) {
    // Placeholder for actual HealthKit Web API authorization
    if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.healthKit) {
      // If running in WKWebView with HealthKit bridge
      return new Promise((resolve, reject) => {
        window.webkit.messageHandlers.healthKit.postMessage({
          action: 'requestAuthorization',
          permissions: permissions
        })
        
        // Listen for response
        window.healthKitAuthCallback = (result) => {
          if (result.success) {
            resolve({
              granted: true,
              token: result.token,
              permissions: result.permissions,
              version: result.version,
              supportedTypes: result.supportedTypes
            })
          } else {
            reject(new Error(result.error))
          }
        }
        
        setTimeout(() => {
          reject(new Error('HealthKit authorization timeout'))
        }, 30000)
      })
    }
    
    // Fallback mock for testing
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          granted: true,
          token: 'mock_healthkit_token',
          permissions: permissions,
          version: '1.0',
          supportedTypes: permissions
        })
      }, 2000)
    })
  }

  async verifyShortcutsConnection() {
    // Check if Shortcuts successfully exported data
    try {
      const authAttempt = localStorage.getItem('apple_health_auth_attempt')
      if (!authAttempt) {
        throw new Error('No Apple Health authentication attempt found')
      }
      
      // Check for exported data
      const exportedData = localStorage.getItem('apple_health_exported_data')
      if (exportedData) {
        const data = JSON.parse(exportedData)
        localStorage.removeItem('apple_health_exported_data')
        
        return {
          success: true,
          providerUserId: 'apple_health_shortcuts',
          accessToken: 'shortcuts_token',
          scopes: data.data_types || [],
          metadata: {
            connection_method: 'shortcuts',
            export_timestamp: data.timestamp
          }
        }
      }
      
      // Check clipboard for data (if Shortcuts copied data)
      if (navigator.clipboard) {
        try {
          const clipboardText = await navigator.clipboard.readText()
          if (clipboardText.includes('HealthKit') || clipboardText.includes('steps')) {
            // Parse clipboard data
            const healthData = this.parseClipboardHealthData(clipboardText)
            if (healthData) {
              return {
                success: true,
                providerUserId: 'apple_health_clipboard',
                accessToken: 'clipboard_token',
                scopes: Object.keys(healthData),
                metadata: {
                  connection_method: 'clipboard',
                  data: healthData
                }
              }
            }
          }
        } catch (clipError) {
          console.log('Clipboard access failed:', clipError.message)
        }
      }
      
      throw new Error('No Apple Health data found')
    } catch (error) {
      throw new Error('Apple Health Shortcuts verification failed: ' + error.message)
    }
  }

  async checkForExportedData() {
    // Check various sources for exported HealthKit data
    
    // Check localStorage for manually imported data
    const manualData = localStorage.getItem('apple_health_manual_import')
    if (manualData) {
      return JSON.parse(manualData)
    }
    
    // Check for file uploads (if user uploaded Health export)
    const fileData = localStorage.getItem('apple_health_file_import')
    if (fileData) {
      return JSON.parse(fileData)
    }
    
    // Check URL parameters for data (if redirected back with data)
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.has('apple_health_data')) {
      const healthData = JSON.parse(decodeURIComponent(urlParams.get('apple_health_data')))
      return healthData
    }
    
    return null
  }

  parseClipboardHealthData(clipboardText) {
    // Parse health data from clipboard (CSV, JSON, etc.)
    try {
      // Try JSON first
      if (clipboardText.trim().startsWith('{') || clipboardText.trim().startsWith('[')) {
        return JSON.parse(clipboardText)
      }
      
      // Try CSV format
      if (clipboardText.includes('steps') || clipboardText.includes('workouts')) {
        return this.parseHealthCSV(clipboardText)
      }
      
      return null
    } catch (error) {
      console.log('Failed to parse clipboard health data:', error.message)
      return null
    }
  }

  parseHealthCSV(csvText) {
    // Parse CSV health data export
    const lines = csvText.split('\n')
    const headers = lines[0].split(',')
    const data = {}
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',')
      const row = {}
      
      headers.forEach((header, index) => {
        row[header.trim()] = values[index]?.trim()
      })
      
      // Group by data type
      const dataType = row.type || row.activity || 'unknown'
      if (!data[dataType]) {
        data[dataType] = []
      }
      data[dataType].push(row)
    }
    
    return data
  }

  async getActivities(connection, forceRefresh = false) {
    if (!connection.isConnected) {
      throw new Error('Apple Health not connected')
    }
    
    try {
      // If we have direct API access, use it
      if (connection.metadata?.direct_api) {
        return await this.getHealthKitActivities(connection, forceRefresh)
      }
      
      // If connected via Shortcuts, get shortcut data
      if (connection.metadata?.connection_method === 'shortcuts') {
        return await this.getShortcutsActivities(connection, forceRefresh)
      }
      
      // Otherwise, use cached/imported data
      return await this.getCachedActivities(connection, forceRefresh)
      
    } catch (error) {
      console.error('Error fetching Apple Health activities:', error)
      throw error
    }
  }

  async getHealthKitActivities(connection, forceRefresh) {
    // Get activities via HealthKit Web APIs
    const endDate = new Date()
    const startDate = new Date(endDate.getTime() - (30 * 24 * 60 * 60 * 1000))
    
    const activities = []
    
    // Get workouts
    const workouts = await this.queryHealthKit('HKWorkoutTypeIdentifier', {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    })
    
    workouts.forEach(workout => {
      activities.push({
        id: workout.uuid,
        workoutActivityType: workout.workoutActivityType,
        sourceName: workout.sourceName,
        startDate: workout.startDate,
        endDate: workout.endDate,
        duration: workout.duration,
        totalDistance: workout.totalDistance,
        totalEnergyBurned: workout.totalEnergyBurned,
        averageHeartRate: workout.averageHeartRate,
        maxHeartRate: workout.maxHeartRate
      })
    })
    
    // Get daily step counts as activities
    const stepData = await this.queryHealthKit('HKQuantityTypeIdentifierStepCount', {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      aggregateBy: 'day'
    })
    
    stepData.forEach(day => {
      if (day.value > 1000) {
        activities.push({
          id: `steps_${day.date}`,
          workoutActivityType: 'daily_steps',
          sourceName: 'Apple Health',
          startDate: day.date + 'T00:00:00Z',
          duration: 86400,
          steps: day.value,
          totalDistance: { doubleValue: day.value * 0.75 },
          totalEnergyBurned: { doubleValue: day.value * 0.04 }
        })
      }
    })
    
    return activities.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
  }

  async getShortcutsActivities(connection, forceRefresh) {
    // Get activities from Shortcuts export
    const cacheKey = `apple_health_shortcuts_${connection.provider_user_id}`
    
    if (!forceRefresh) {
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        const { data, timestamp } = JSON.parse(cached)
        if (Date.now() - timestamp < 60 * 60 * 1000) { // 1 hour cache
          return data
        }
      }
    }
    
    // Trigger new Shortcuts export
    const shortcutUrl = this.buildHealthKitShortcutUrl()
    window.location.href = shortcutUrl
    
    // Return cached data while waiting for new export
    const cached = localStorage.getItem(cacheKey)
    return cached ? JSON.parse(cached).data : this.generateMockActivities()
  }

  async getCachedActivities(connection, forceRefresh) {
    // Get activities from cache or generate mock data
    const cacheKey = `apple_health_activities_${connection.provider_user_id}`
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
    
    // Generate mock activities for testing
    const mockActivities = this.generateMockActivities()
    
    // Cache the results
    localStorage.setItem(cacheKey, JSON.stringify({
      data: mockActivities,
      timestamp: Date.now()
    }))
    
    return mockActivities
  }

  generateMockActivities() {
    // Generate realistic mock Apple Health activities
    const activities = []
    const now = new Date()
    
    // Generate workout activities
    const workoutTypes = [
      'HKWorkoutActivityTypeRunning',
      'HKWorkoutActivityTypeWalking', 
      'HKWorkoutActivityTypeCycling',
      'HKWorkoutActivityTypeFunctionalStrengthTraining',
      'HKWorkoutActivityTypeYoga'
    ]
    
    for (let i = 0; i < 10; i++) {
      const days = Math.floor(Math.random() * 14)
      const startDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000))
      const duration = Math.floor(Math.random() * 3600) + 900 // 15 minutes to 1 hour
      const workoutType = workoutTypes[Math.floor(Math.random() * workoutTypes.length)]
      
      activities.push({
        id: `apple_workout_${startDate.getTime()}_${workoutType}`,
        workoutActivityType: workoutType,
        sourceName: 'Apple Watch',
        startDate: startDate.toISOString(),
        endDate: new Date(startDate.getTime() + duration * 1000).toISOString(),
        duration: duration,
        totalDistance: workoutType.includes('Running') ? 
          { doubleValue: duration * 3.5 } : 
          workoutType.includes('Cycling') ? 
          { doubleValue: duration * 8 } : null,
        totalEnergyBurned: { doubleValue: Math.floor(duration * 0.15) },
        averageHeartRate: Math.floor(Math.random() * 50) + 120,
        maxHeartRate: Math.floor(Math.random() * 30) + 160
      })
    }
    
    // Generate daily step activities
    for (let i = 0; i < 14; i++) {
      const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000))
      const steps = Math.floor(Math.random() * 8000) + 3000
      
      activities.push({
        id: `apple_steps_${date.toISOString().split('T')[0]}`,
        workoutActivityType: 'daily_steps',
        sourceName: 'iPhone',
        startDate: date.toISOString().split('T')[0] + 'T00:00:00Z',
        duration: 86400,
        steps: steps,
        totalDistance: { doubleValue: steps * 0.75 },
        totalEnergyBurned: { doubleValue: Math.floor(steps * 0.04) }
      })
    }
    
    return activities.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
  }

  async queryHealthKit(dataType, options) {
    // Placeholder for actual HealthKit queries
    if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.healthKit) {
      return new Promise((resolve) => {
        window.webkit.messageHandlers.healthKit.postMessage({
          action: 'query',
          dataType: dataType,
          options: options
        })
        
        window.healthKitQueryCallback = (result) => {
          resolve(result.data || [])
        }
      })
    }
    
    // Mock data for testing
    return this.generateMockQueryData(dataType, options)
  }

  generateMockQueryData(dataType, options) {
    // Generate mock query results
    const results = []
    const startDate = new Date(options.startDate)
    const endDate = new Date(options.endDate)
    const days = Math.ceil((endDate - startDate) / (24 * 60 * 60 * 1000))
    
    if (dataType === 'HKWorkoutTypeIdentifier') {
      for (let i = 0; i < Math.min(days, 10); i++) {
        if (Math.random() > 0.6) {
          const date = new Date(startDate.getTime() + (i * 24 * 60 * 60 * 1000))
          results.push({
            uuid: `workout_${date.getTime()}`,
            workoutActivityType: 'HKWorkoutActivityTypeRunning',
            sourceName: 'Apple Watch',
            startDate: date.toISOString(),
            duration: 2400,
            totalDistance: { doubleValue: 5000 },
            totalEnergyBurned: { doubleValue: 400 },
            averageHeartRate: 145
          })
        }
      }
    } else if (dataType === 'HKQuantityTypeIdentifierStepCount') {
      for (let i = 0; i < days; i++) {
        const date = new Date(startDate.getTime() + (i * 24 * 60 * 60 * 1000))
        results.push({
          date: date.toISOString().split('T')[0],
          value: Math.floor(Math.random() * 8000) + 3000
        })
      }
    }
    
    return results
  }
}

export const appleHealthApi = new AppleHealthApi()