import { useAuth } from '../contexts/AuthContext'
import { useStrava } from '../contexts/StravaContext'
import { useDemo } from '../contexts/DemoContext'
import { Link } from 'react-router-dom'
import StravaConnect from '../components/strava/StravaConnect'
import ActivityList from '../components/strava/ActivityList'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

const Dashboard = () => {
  const { user } = useAuth()
  const { isConnected, athlete, activities } = useStrava()
  const { isDemoMode, demoUser } = useDemo()

  // Calculate some basic stats
  const totalActivities = activities?.length || 0
  const thisWeekActivities = activities?.filter(activity => {
    const activityDate = new Date(activity.start_date)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return activityDate >= weekAgo
  }).length || 0

  const totalDistance = activities?.reduce((sum, activity) => sum + (activity.distance || 0), 0) || 0
  const totalDistanceKm = (totalDistance / 1000).toFixed(1)

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-mountain-50 pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Welcome Hero Section */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-mountain-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 animate-bounce-gentle">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-mountain-900 mb-4">
              Welcome to TrailBuddy!
            </h1>
            <p className="text-xl text-mountain-600 max-w-2xl mx-auto mb-8">
              Hey {isDemoMode ? demoUser?.name?.split(' ')[0] : user?.email?.split('@')[0]}! Ready to find your perfect adventure partner? 
              Connect your Strava account to get started.
            </p>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center">
              <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-mountain-900 mb-2">Find Partners</h3>
              <p className="text-mountain-600 text-sm">Match with compatible adventure partners based on your fitness level</p>
            </Card>
            
            <Card className="text-center">
              <div className="w-12 h-12 bg-secondary-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-mountain-900 mb-2">Plan Activities</h3>
              <p className="text-mountain-600 text-sm">Coordinate rides, meetups, and outdoor adventures that actually happen</p>
            </Card>
            
            <Card className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-mountain-900 mb-2">Track Progress</h3>
              <p className="text-mountain-600 text-sm">See your activities and achievements integrated with Strava</p>
            </Card>
          </div>

          {/* Connect Strava Section */}
          <Card className="text-center bg-gradient-to-br from-primary-50 to-secondary-50 border-0">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-display font-bold text-mountain-900 mb-4">
                Connect Your Strava Account
              </h2>
              <p className="text-mountain-600 mb-6">
                We'll analyze your activities to help match you with compatible adventure partners in BC.
              </p>
              <StravaConnect />
              <p className="text-sm text-mountain-500 mt-4">
                Your data is secure and only used for partner matching
              </p>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-mountain-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold text-mountain-900 mb-2">
                Your Adventure Dashboard
              </h1>
              <p className="text-mountain-600">
                Welcome back, {athlete?.firstname || (isDemoMode ? demoUser?.name?.split(' ')[0] : user?.email?.split('@')[0])}! Ready for your next adventure?
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Link to="/find-partners">
                <Button size="lg">
                  Find Partners
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </Button>
              </Link>
              <Link to="/plan-activity">
                <Button variant="secondary" size="lg">
                  Plan Activity
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-primary-500 to-primary-600 text-white border-0">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-primary-100 text-sm font-medium">Total Activities</p>
                <p className="text-2xl font-bold">{totalActivities}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-secondary-500 to-secondary-600 text-white border-0">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-secondary-100 text-sm font-medium">This Week</p>
                <p className="text-2xl font-bold">{thisWeekActivities}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-green-100 text-sm font-medium">Total Distance</p>
                <p className="text-2xl font-bold">{totalDistanceKm} km</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card hover className="cursor-pointer">
            <Link to="/find-partners" className="block">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-mountain-900 mb-2">Find Adventure Partners</h3>
                <p className="text-mountain-600">Connect with compatible outdoor enthusiasts in your area</p>
              </div>
            </Link>
          </Card>

          <Card hover className="cursor-pointer">
            <Link to="/plan-activity" className="block">
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-mountain-900 mb-2">Plan New Activity</h3>
                <p className="text-mountain-600">Organize your next outdoor adventure with partners</p>
              </div>
            </Link>
          </Card>

          <Card hover className="cursor-pointer">
            <Link to="/profile" className="block">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-mountain-900 mb-2">Update Profile</h3>
                <p className="text-mountain-600">Manage your preferences and Strava connection</p>
              </div>
            </Link>
          </Card>
        </div>

        {/* Activities Section */}
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-display font-bold text-mountain-900">
                Recent Activities
              </h2>
              <Link to="/profile">
                <Button variant="ghost" size="sm">
                  Manage Strava Connection
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </Button>
              </Link>
            </div>
          </Card.Header>
          
          <Card.Body className="p-0">
            <ActivityList />
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard