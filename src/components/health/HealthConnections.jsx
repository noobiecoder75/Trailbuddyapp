import { useState } from 'react'
import { useHealth } from '../../contexts/HealthContext'
import AppleHealthSetup from './AppleHealthSetup'

const HealthConnections = () => {
  const { 
    healthConnections, 
    loading, 
    error, 
    connectProvider, 
    disconnectProvider,
    getAvailableProviders,
    platform,
    lastSyncTime,
    syncAllProviders
  } = useHealth()
  
  const [connectingProvider, setConnectingProvider] = useState(null)
  const [syncing, setSyncing] = useState(false)
  const [showAppleHealthSetup, setShowAppleHealthSetup] = useState(false)
  
  const availableProviders = getAvailableProviders()

  const providerConfig = {
    strava: {
      name: 'Strava',
      description: 'Connect your outdoor activities and social workouts',
      icon: (
        <svg className="h-8 w-8 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066l-2.084 4.116zm-7.008-5.599l2.836 5.599h3.065L9.129 6.772L4.228 17.944h3.065l.998-1.969H8.379z"/>
        </svg>
      ),
      color: 'orange',
      available: true,
      platform: 'All platforms'
    },
    google_health: {
      name: 'Google Fit',
      description: 'Sync your fitness data from Google Fit across all devices',
      icon: (
        <svg className="h-8 w-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      ),
      color: 'blue',
      available: availableProviders.google_health,
      platform: 'All platforms',
      requiresApp: false
    },
    apple_health: {
      name: 'Apple Health',
      description: 'Comprehensive health and wellness tracking from HealthKit',
      icon: (
        <svg className="h-8 w-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
      ),
      color: 'red',
      available: availableProviders.apple_health,
      platform: 'iOS only',
      requiresApp: true
    }
  }

  const handleConnect = async (providerType) => {
    // Show setup wizard for Apple Health on iOS
    if (providerType === 'apple_health' && platform.isIOS) {
      setShowAppleHealthSetup(true)
      return
    }
    
    setConnectingProvider(providerType)
    try {
      await connectProvider(providerType)
    } catch (error) {
      console.error(`Failed to connect ${providerType}:`, error)
    } finally {
      setConnectingProvider(null)
    }
  }

  const handleAppleHealthSetupComplete = async (result) => {
    setShowAppleHealthSetup(false)
    
    if (result && !result.skipSetup) {
      // Setup completed successfully, now connect
      setConnectingProvider('apple_health')
      try {
        await connectProvider('apple_health')
      } catch (error) {
        console.error('Failed to connect Apple Health after setup:', error)
      } finally {
        setConnectingProvider(null)
      }
    } else if (result && result.skipSetup) {
      // User skipped setup, try connecting anyway
      handleConnect('apple_health')
    }
  }

  const handleDisconnect = async (providerType) => {
    const providerName = providerConfig[providerType].name
    if (window.confirm(`Are you sure you want to disconnect ${providerName}?`)) {
      try {
        await disconnectProvider(providerType)
      } catch (error) {
        console.error(`Failed to disconnect ${providerType}:`, error)
      }
    }
  }

  const handleSyncAll = async () => {
    setSyncing(true)
    try {
      await syncAllProviders(true)
    } catch (error) {
      console.error('Failed to sync all providers:', error)
    } finally {
      setSyncing(false)
    }
  }

  const getConnectionStatus = (providerType) => {
    const connection = healthConnections[providerType]
    if (!connection) return 'disconnected'
    return connection.isConnected ? 'connected' : 'disconnected'
  }

  const getConnectionInfo = (providerType) => {
    const connection = healthConnections[providerType]
    if (!connection) return null
    
    switch (providerType) {
      case 'strava':
        return connection.athlete ? 
          `${connection.athlete.firstname} ${connection.athlete.lastname}` : 
          'Connected'
      case 'google_health':
      case 'apple_health':
        return connection.provider_user_id ? 
          `User ID: ${connection.provider_user_id.substring(0, 8)}...` :
          'Connected'
      default:
        return 'Connected'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Health Connections</h2>
          <p className="text-gray-600 mt-1">
            Connect your fitness apps to find compatible workout partners
          </p>
        </div>
        
        {Object.keys(healthConnections).length > 0 && (
          <button
            onClick={handleSyncAll}
            disabled={syncing}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium inline-flex items-center"
          >
            {syncing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Syncing...
              </>
            ) : (
              <>
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Sync All
              </>
            )}
          </button>
        )}
      </div>

      {/* Platform Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <svg className="h-5 w-5 text-blue-400 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-blue-800">
              Platform: {platform === 'ios' ? 'iOS' : platform === 'android' ? 'Android' : 'Web'}
            </h3>
            <p className="text-sm text-blue-700 mt-1">
              {platform === 'ios' && 'You can connect Strava and Apple Health on this device.'}
              {platform === 'android' && 'You can connect Strava and Google Health on this device.'}
              {platform === 'web' && 'You can connect Strava from any device. Use mobile for health app integrations.'}
            </p>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Provider Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(providerConfig).map(([providerType, config]) => {
          const status = getConnectionStatus(providerType)
          const connectionInfo = getConnectionInfo(providerType)
          const isConnecting = connectingProvider === providerType
          const isAvailable = config.available
          
          return (
            <div
              key={providerType}
              className={`bg-white border-2 rounded-xl p-6 transition-all duration-200 ${
                status === 'connected' 
                  ? `border-${config.color}-200 bg-${config.color}-50` 
                  : isAvailable 
                    ? 'border-gray-200 hover:border-gray-300' 
                    : 'border-gray-100 bg-gray-50'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  {config.icon}
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-900">{config.name}</h3>
                    <p className="text-xs text-gray-500">{config.platform}</p>
                  </div>
                </div>
                
                {/* Status Badge */}
                {status === 'connected' && (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}>
                    <svg className="w-2 h-2 mr-1" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx={4} cy={4} r={3} />
                    </svg>
                    Connected
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4">{config.description}</p>

              {/* Connection Info */}
              {status === 'connected' && connectionInfo && (
                <div className="bg-white bg-opacity-60 rounded-lg p-3 mb-4">
                  <p className="text-sm font-medium text-gray-700">{connectionInfo}</p>
                  {healthConnections[providerType]?.last_sync_at && (
                    <p className="text-xs text-gray-500 mt-1">
                      Last sync: {new Date(healthConnections[providerType].last_sync_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}

              {/* Platform Requirements */}
              {!isAvailable && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-yellow-800">
                    {config.requiresApp ? 
                      `Available on ${config.platform.replace(' only', '')} devices only` :
                      'Not available on this platform'
                    }
                  </p>
                </div>
              )}

              {/* Action Button */}
              <div className="flex space-x-2">
                {status === 'connected' ? (
                  <button
                    onClick={() => handleDisconnect(providerType)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    Disconnect
                  </button>
                ) : isAvailable ? (
                  <button
                    onClick={() => handleConnect(providerType)}
                    disabled={isConnecting || loading}
                    className={`flex-1 bg-${config.color}-600 hover:bg-${config.color}-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium inline-flex items-center justify-center`}
                  >
                    {isConnecting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Connecting...
                      </>
                    ) : (
                      <>
                        {config.icon}
                        <span className="ml-2">Connect {config.name}</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    disabled
                    className="flex-1 bg-gray-100 text-gray-400 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed"
                  >
                    Not Available
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Sync Status */}
      {lastSyncTime && (
        <div className="text-center text-sm text-gray-500">
          Last synchronized: {lastSyncTime.toLocaleString()}
        </div>
      )}

      {/* Tips */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-2">Tips for Better Matching</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Connect multiple health apps for more accurate activity level assessment</li>
          <li>• Strava shows your outdoor activities and social workouts</li>
          <li>• Health apps provide daily step counts and comprehensive fitness data</li>
          <li>• More connected data sources = better workout partner recommendations</li>
        </ul>
      </div>

      {/* Apple Health Setup Modal */}
      <AppleHealthSetup 
        isOpen={showAppleHealthSetup}
        onClose={() => setShowAppleHealthSetup(false)}
        onComplete={handleAppleHealthSetupComplete}
      />
    </div>
  )
}

export default HealthConnections