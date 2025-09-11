import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useHealth } from '../contexts/HealthContext'
import { useAuth } from '../contexts/AuthContext'

const HealthCallback = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { connectProvider } = useHealth()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    const handleCallback = async () => {
      try {
        // Determine provider from URL parameters or path
        const provider = searchParams.get('provider') || 
                        (window.location.pathname.includes('strava') ? 'strava' : 
                         window.location.pathname.includes('google') ? 'google_health' :
                         window.location.pathname.includes('apple') ? 'apple_health' : null)

        if (!provider) {
          throw new Error('Unknown health provider')
        }

        // Handle different provider callbacks
        let authData = null
        
        if (provider === 'strava') {
          // Strava OAuth callback
          const code = searchParams.get('code')
          const error = searchParams.get('error')
          
          if (error) {
            throw new Error(`Strava authorization failed: ${error}`)
          }
          
          if (!code) {
            throw new Error('No authorization code received from Strava')
          }
          
          authData = code
          
        } else if (provider === 'google_health') {
          // Google Health Connect callback
          const authSuccess = searchParams.get('auth_success')
          const authData = searchParams.get('auth_data')
          
          if (authSuccess !== 'true') {
            throw new Error('Google Health authorization was not successful')
          }
          
          if (authData) {
            authData = JSON.parse(decodeURIComponent(authData))
          }
          
        } else if (provider === 'apple_health') {
          // Apple HealthKit callback
          const authSuccess = searchParams.get('auth_success')
          const healthData = searchParams.get('health_data')
          
          if (authSuccess !== 'true') {
            throw new Error('Apple Health authorization was not successful')
          }
          
          if (healthData) {
            authData = JSON.parse(decodeURIComponent(healthData))
          }
        }

        // Connect the provider
        const connected = await connectProvider(provider, authData)
        
        if (connected) {
          setSuccess(true)
          // Store success message and redirect
          localStorage.setItem('health_connection_success', JSON.stringify({
            provider,
            timestamp: Date.now()
          }))
          
          setTimeout(() => {
            navigate('/dashboard')
          }, 2000)
        } else {
          throw new Error(`Failed to connect ${provider}`)
        }
        
      } catch (error) {
        console.error('Health callback error:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    handleCallback()
  }, [searchParams, navigate, connectProvider, user])

  // Handle postMessage for popup-based auth flows
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) return
      
      if (event.data.type === 'HEALTH_CONNECT_SUCCESS') {
        localStorage.setItem('health_connect_auth_success', JSON.stringify(event.data.result))
        window.parent.postMessage(event.data, window.location.origin)
        window.close()
      } else if (event.data.type === 'HEALTH_CONNECT_ERROR') {
        setError(event.data.error)
        window.parent.postMessage(event.data, window.location.origin)
      }
    }
    
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Connecting Your Health App...
          </h2>
          <p className="text-gray-600">
            Please wait while we establish the connection.
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full mx-4">
          <div className="text-center">
            <svg className="mx-auto h-16 w-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Connection Failed
            </h2>
            <p className="text-gray-600 mb-6">
              {error}
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => window.history.back()}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    const provider = searchParams.get('provider') || 'health app'
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full mx-4">
          <div className="text-center">
            <svg className="mx-auto h-16 w-16 text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Successfully Connected!
            </h2>
            <p className="text-gray-600 mb-6">
              Your {provider} account has been connected. We're now syncing your health data to improve partner matching.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-700">
                Redirecting you to the dashboard...
              </p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              Go to Dashboard Now
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default HealthCallback