import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useStrava } from '../contexts/StravaContext'

const StravaCallback = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { connectStrava, error } = useStrava()

  useEffect(() => {
    const handleCallback = async () => {
      console.log('=== STRAVA CALLBACK DEBUG START ===')
      console.log('Full callback URL:', window.location.href)
      console.log('Search string:', window.location.search)
      console.log('All searchParams entries:')
      for (const [key, value] of searchParams.entries()) {
        console.log(`  ${key}: ${value}`)
      }

      const code = searchParams.get('code')
      const errorParam = searchParams.get('error')
      const state = searchParams.get('state')
      const scope = searchParams.get('scope')

      console.log('=== EXTRACTED PARAMETERS ===')
      console.log('- Code (raw):', code)
      console.log('- Code type:', typeof code)
      console.log('- Code length:', code ? code.length : 'N/A')
      console.log('- Code preview:', code ? `${code.substring(0, 10)}...` : 'None')
      console.log('- Error:', errorParam)
      console.log('- State:', state)
      console.log('- Scope:', scope)

      if (errorParam) {
        // User denied access
        console.error('Strava OAuth error parameter received:', errorParam)
        navigate('/profile?error=access_denied')
        return
      }

      if (code) {
        try {
          console.log('=== CALLING CONNECT STRAVA ===')
          console.log('Passing code to connectStrava:', code)
          console.log('Code being passed (type):', typeof code)
          console.log('Code being passed (length):', code.length)
          console.log('Attempting to connect Strava with authorization code...')
          const success = await connectStrava(code)
          console.log('Connect Strava result:', success)
          
          if (success) {
            console.log('Strava connection successful, redirecting to dashboard...')
            navigate('/dashboard?strava=connected')
          } else {
            console.error('Strava connection returned false, redirecting with error...')
            navigate('/profile?error=connection_failed')
          }
        } catch (error) {
          console.error('Error in StravaCallback handleCallback:')
          console.error('Error type:', error.constructor.name)
          console.error('Error message:', error.message)
          console.error('Error stack:', error.stack)
          console.error('Full error object:', error)
          navigate('/profile?error=connection_failed')
        }
      } else {
        console.error('No authorization code received in callback')
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