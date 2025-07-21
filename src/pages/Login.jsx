import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useDemo } from '../contexts/DemoContext'
import { useNavigate, Link } from 'react-router-dom'
import LoginForm from '../components/auth/LoginForm'
import SignupForm from '../components/auth/SignupForm'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { testDatabaseConnection } from '../utils/dbTest'

const Login = () => {
  const [isSignup, setIsSignup] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const { isDemoMode, setIsDemoMode, demoUser } = useDemo()
  const navigate = useNavigate()

  useEffect(() => {
    if (user || (isDemoMode && demoUser)) {
      navigate('/dashboard')
    }
  }, [user, isDemoMode, demoUser, navigate])

  const handleTestDatabase = async () => {
    console.log('Starting database test...')
    const result = await testDatabaseConnection()
    console.log('Database test result:', result)
    alert(`Database test results:\n${JSON.stringify(result, null, 2)}`)
  }

  const handleDemoLogin = async () => {
    setIsLoading(true)
    // Simulate authentication delay for realistic demo
    setTimeout(() => {
      setIsDemoMode(true)
      setIsLoading(false)
      navigate('/dashboard')
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-hero-gradient flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
        <div className="max-w-md text-center text-white">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h1 className="text-4xl font-display font-bold">TrailBuddy</h1>
          </div>
          <h2 className="text-2xl font-display font-semibold mb-4">
            Find Your Perfect Adventure Partner
          </h2>
          <p className="text-lg text-white opacity-90 leading-relaxed">
            Connect with outdoor enthusiasts in British Columbia who match your fitness level and activity style. No more flake-outs. No more solo adventures.
          </p>
          
          <div className="mt-8 space-y-4">
            <div className="flex items-center text-left">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Smart Partner Matching</p>
                <p className="text-sm opacity-80">Based on fitness level & preferences</p>
              </div>
            </div>
            <div className="flex items-center text-left">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Easy Coordination</p>
                <p className="text-sm opacity-80">Schedule rides & activities that happen</p>
              </div>
            </div>
            <div className="flex items-center text-left">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Fair Pricing</p>
                <p className="text-sm opacity-80">Pay only when activities happen</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden text-center">
            <Link to="/" className="flex items-center justify-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-mountain-gradient rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="font-display font-bold text-2xl text-mountain-900">TrailBuddy</span>
            </Link>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-display font-bold text-mountain-900 mb-2">
              {isSignup ? 'Join TrailBuddy' : 'Welcome Back'}
            </h2>
            <p className="text-mountain-600">
              {isSignup 
                ? 'Start connecting with adventure partners today' 
                : 'Sign in to find your next adventure partner'
              }
            </p>
          </div>

          <Card padding="lg">
            {isSignup ? <SignupForm /> : <LoginForm />}
            
            {/* Demo Mode Section */}
            <div className="mt-6 pt-6 border-t border-mountain-200">
              <div className="text-center">
                <p className="text-sm text-mountain-600 mb-3">Want to see a demo?</p>
                <Button
                  onClick={handleDemoLogin}
                  variant="outline"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 hover:from-purple-700 hover:to-pink-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Starting Demo...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Start Demo Mode
                    </>
                  )}
                </Button>
                <p className="text-xs text-mountain-500 mt-2">
                  Experience TrailBuddy with pre-loaded data
                </p>
              </div>
            </div>
          </Card>
          
          <div className="text-center space-y-4">
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              {isSignup 
                ? 'Already have an account? Sign in' 
                : 'Need an account? Sign up'
              }
            </button>
            
            <div className="flex flex-col space-y-3">
              <Link to="/" className="text-mountain-600 hover:text-primary-600 transition-colors">
                ← Back to Home
              </Link>
              
              <button
                onClick={handleTestDatabase}
                className="text-mountain-400 hover:text-mountain-600 text-sm transition-colors"
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