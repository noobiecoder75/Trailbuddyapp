import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import LoginForm from '../components/auth/LoginForm'
import SignupForm from '../components/auth/SignupForm'
import { testDatabaseConnection } from '../utils/dbTest'

const Login = () => {
  const [isSignup, setIsSignup] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  const handleTestDatabase = async () => {
    console.log('Starting database test...')
    const result = await testDatabaseConnection()
    console.log('Database test result:', result)
    alert(`Database test results:\n${JSON.stringify(result, null, 2)}`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isSignup ? 'Create your account' : 'Sign in to your account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            TrailBuddy - Your Strava Activity Companion
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {isSignup ? <SignupForm /> : <LoginForm />}
          
          <div className="text-center space-y-2">
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="text-blue-600 hover:text-blue-500"
            >
              {isSignup 
                ? 'Already have an account? Sign in' 
                : 'Need an account? Sign up'
              }
            </button>
            
            <div>
              <button
                onClick={handleTestDatabase}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Test Database Connection
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login