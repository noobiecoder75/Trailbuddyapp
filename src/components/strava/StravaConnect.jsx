import { useState } from 'react'
import { useHealth } from '../../contexts/HealthContext'
import { useDemo } from '../../contexts/DemoContext'
import { getStravaAuthUrl } from '../../lib/stravaApi'

const StravaConnect = () => {
  const { isConnected, athlete, loading, error, disconnectStrava, connectStrava } = useHealth()
  const { isDemoMode } = useDemo()
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    if (isDemoMode) {
      setIsConnecting(true)
      await connectStrava()
      setIsConnecting(false)
    } else {
      window.location.href = getStravaAuthUrl()
    }
  }

  const handleDisconnect = async () => {
    if (window.confirm('Are you sure you want to disconnect your Strava account?')) {
      await disconnectStrava()
    }
  }

  if (loading || isConnecting) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        <span className="ml-2 text-gray-600">Connecting to Strava...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (isConnected) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066l-2.084 4.116zm-7.008-5.599l2.836 5.599h3.065L9.129 6.772L4.228 17.944h3.065l.998-1.969H8.379z"/>
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Connected to Strava
              </p>
              <p className="text-sm text-green-600">
                {athlete?.firstname} {athlete?.lastname}
              </p>
            </div>
          </div>
          <button
            onClick={handleDisconnect}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
          >
            Disconnect
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="text-center">
        <svg className="mx-auto h-16 w-16 text-orange-500 mb-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066l-2.084 4.116zm-7.008-5.599l2.836 5.599h3.065L9.129 6.772L4.228 17.944h3.065l.998-1.969H8.379z"/>
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Connect Your Strava Account
        </h3>
        <p className="text-gray-600 mb-4">
          Link your Strava account to view and analyze your activities.
        </p>
        <button
          onClick={handleConnect}
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium inline-flex items-center"
        >
          <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066l-2.084 4.116zm-7.008-5.599l2.836 5.599h3.065L9.129 6.772L4.228 17.944h3.065l.998-1.969H8.379z"/>
          </svg>
          Connect with Strava
        </button>
      </div>
    </div>
  )
}

export default StravaConnect