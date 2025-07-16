import { useAuth } from '../contexts/AuthContext'
import { useStrava } from '../contexts/StravaContext'
import { useNavigate } from 'react-router-dom'
import StravaConnect from '../components/strava/StravaConnect'
import ActivityList from '../components/strava/ActivityList'

const Dashboard = () => {
  const { user, signOut } = useAuth()
  const { isConnected } = useStrava()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">TrailBuddy</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {user?.email}</span>
              <button
                onClick={() => navigate('/profile')}
                className="text-blue-600 hover:text-blue-500"
              >
                Profile
              </button>
              <button
                onClick={handleSignOut}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {!isConnected ? (
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome to TrailBuddy!
              </h2>
              <p className="text-gray-600 mb-6">
                Connect your Strava account to start tracking your activities.
              </p>
              
              <div className="max-w-md mx-auto">
                <StravaConnect />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Your Activities
                </h2>
                <button
                  onClick={() => navigate('/profile')}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Manage Strava Connection
                </button>
              </div>
              
              <ActivityList />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Dashboard