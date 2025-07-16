import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useStrava } from '../contexts/StravaContext'

const StravaCallback = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { connectStrava, error } = useStrava()

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code')
      const errorParam = searchParams.get('error')

      if (errorParam) {
        // User denied access
        console.error('Strava OAuth error:', errorParam)
        navigate('/profile?error=access_denied')
        return
      }

      if (code) {
        try {
          const success = await connectStrava(code)
          if (success) {
            navigate('/dashboard?strava=connected')
          } else {
            navigate('/profile?error=connection_failed')
          }
        } catch (error) {
          console.error('Error connecting to Strava:', error)
          navigate('/profile?error=connection_failed')
        }
      } else {
        navigate('/profile?error=no_code')
      }
    }

    handleCallback()
  }, [searchParams, connectStrava, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Connecting to Strava...
        </h2>
        <p className="text-gray-600">
          Please wait while we connect your Strava account.
        </p>
        {error && (
          <div className="mt-4 text-red-600 text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}

export default StravaCallback