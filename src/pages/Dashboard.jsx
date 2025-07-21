import { useState } from 'react'
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
  const { isDemoMode, demoUser, upcomingActivities } = useDemo()
  
  // Tab state management
  const [activeTab, setActiveTab] = useState('overview')

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
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-mountain-900 mb-2">
                Your Adventure Dashboard
              </h1>
              <p className="text-sm sm:text-base text-mountain-600">
                Welcome back, {athlete?.firstname || (isDemoMode ? demoUser?.name?.split(' ')[0] : user?.email?.split('@')[0])}! Ready for your next adventure?
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-3 md:gap-3">
              <Link to="/find-partners" className="w-full sm:w-auto">
                <Button size="sm" className="w-full sm:w-auto">
                  Find Partners
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </Button>
              </Link>
              <Link to="/plan-activity" className="w-full sm:w-auto">
                <Button variant="secondary" size="sm" className="w-full sm:w-auto">
                  Plan Activity
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-4 sm:px-6 py-3 sm:py-2 font-medium text-sm sm:text-base min-h-[44px] sm:min-h-auto ${activeTab === 'overview' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Overview
          </button>
          {isDemoMode && isConnected && (
            <button 
              onClick={() => setActiveTab('rides')}
              className={`px-4 sm:px-6 py-3 sm:py-2 font-medium text-sm sm:text-base min-h-[44px] sm:min-h-auto ${activeTab === 'rides' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Find Rides
            </button>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div>
        {/* Stats Cards */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${isDemoMode ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-4 sm:gap-6 mb-8`}>
          <Card className="bg-gradient-to-br from-primary-500 to-primary-600 text-white border-0">
            <div className="flex items-center p-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-primary-100 text-xs sm:text-sm font-medium">Total Activities</p>
                <p className="text-xl sm:text-2xl font-bold">{totalActivities}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-secondary-500 to-secondary-600 text-white border-0">
            <div className="flex items-center p-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-secondary-100 text-xs sm:text-sm font-medium">This Week</p>
                <p className="text-xl sm:text-2xl font-bold">{thisWeekActivities}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <div className="flex items-center p-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-green-100 text-xs sm:text-sm font-medium">Total Distance</p>
                <p className="text-xl sm:text-2xl font-bold">{totalDistanceKm} km</p>
              </div>
            </div>
          </Card>

          {/* Ride Sharing Stats - Demo Feature */}
          {isDemoMode && (
            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
              <div className="flex items-center p-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3 sm:ml-4">
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <p className="text-orange-100 text-xs sm:text-sm font-medium sm:mr-2">Rides Shared</p>
                    <span className="bg-white bg-opacity-30 text-xs px-2 py-1 rounded-full mt-1 sm:mt-0 self-start">Demo</span>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold">7</p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <Card hover className="cursor-pointer">
            <Link to="/find-partners" className="block">
              <div className="text-center p-4 sm:p-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-mountain-900 mb-2">Find Adventure Partners</h3>
                <p className="text-sm sm:text-base text-mountain-600">Connect with compatible outdoor enthusiasts in your area</p>
              </div>
            </Link>
          </Card>

          <Card hover className="cursor-pointer">
            <Link to="/plan-activity" className="block">
              <div className="text-center p-4 sm:p-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-secondary-100 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-mountain-900 mb-2">Plan New Activity</h3>
                <p className="text-sm sm:text-base text-mountain-600">Organize your next outdoor adventure with partners</p>
              </div>
            </Link>
          </Card>

          <Card hover className="cursor-pointer">
            <Link to="/profile" className="block">
              <div className="text-center p-4 sm:p-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-mountain-900 mb-2">Update Profile</h3>
                <p className="text-sm sm:text-base text-mountain-600">Manage your preferences and Strava connection</p>
              </div>
            </Link>
          </Card>
        </div>

        {/* Upcoming Activities Section - Demo Feature */}
        {isDemoMode && upcomingActivities && (
          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-display font-bold text-mountain-900">
                    Upcoming Activities
                  </h2>
                  <p className="text-mountain-600 text-sm">Join organized adventures in your area</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="bg-secondary-100 text-secondary-800 text-xs font-medium px-2 py-1 rounded-full">
                    Demo Feature
                  </span>
                  <Link to="/plan-activity">
                    <Button variant="outline" size="sm">
                      View All Activities
                    </Button>
                  </Link>
                </div>
              </div>
            </Card.Header>
            
            <Card.Body className="p-0">
              <div className="divide-y divide-mountain-200">
                {upcomingActivities.slice(0, 3).map((activity) => (
                  <UpcomingActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            </Card.Body>
          </Card>
        )}

        {/* Activities Section */}
        <Card className={isDemoMode && upcomingActivities ? "mt-8" : ""}>
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
        )}

        {/* Find Rides Tab */}
        {activeTab === 'rides' && isDemoMode && (
          <RideMatchingContent />
        )}
      </div>
    </div>
  )
}

// Upcoming Activity Item Component
const UpcomingActivityItem = ({ activity }) => {
  const { demoRideData } = useDemo()
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [isJoining, setIsJoining] = useState(false)

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'open': return 'bg-blue-100 text-blue-800'
      case 'almost_full': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getActivityIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'running':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )
      case 'hiking':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )
      case 'cycling':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
          </svg>
        )
      default:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )
    }
  }

  const handleJoinActivity = async () => {
    setIsJoining(true)
    setTimeout(() => {
      setToastMessage(`Successfully joined "${activity.title}"! You'll receive location details soon.`)
      setShowToast(true)
      setIsJoining(false)
      setTimeout(() => setShowToast(false), 3000)
    }, 1000)
  }

  const handleJoinRide = (rideOffer) => {
    const driver = demoRideData.users.find(u => u.id === rideOffer.driverId)
    setToastMessage(`Ride request sent to ${driver.name}! You'll receive pickup details soon.`)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const activityRides = demoRideData.rideOffers.filter(offer => offer.activityId === activity.id)
  const activityRequests = demoRideData.rideRequests.filter(req => req.activityId === activity.id)

  return (
    <>
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {toastMessage}
        </div>
      )}
      
      <div className="p-4 sm:p-6 hover:bg-mountain-50 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-start space-x-3 sm:space-x-4 flex-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 flex-shrink-0">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 mb-1">
                <h3 className="text-base sm:text-lg font-semibold text-mountain-900 truncate">{activity.title}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full self-start ${getStatusColor(activity.status)}`}>
                  {activity.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-mountain-600 mb-2">
                Organized by {activity.organizer}
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 text-xs sm:text-sm text-mountain-600 mb-3">
                <div className="flex items-center">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="truncate">{new Date(activity.date).toLocaleDateString()} at {activity.time}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="truncate">{activity.location}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {activity.participants}/{activity.maxParticipants} joined
                </div>
              </div>

              {/* Transportation Info */}
              {(activityRides.length > 0 || activityRequests.length > 0) && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-green-800 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    Transportation Available
                  </h4>
                  <div className="space-y-2">
                    {activityRides.map(ride => {
                      const driver = demoRideData.users.find(u => u.id === ride.driverId)
                      return (
                        <div key={ride.id} className="flex items-center justify-between bg-white p-2 rounded border">
                          <div className="flex items-center space-x-2">
                            <img src={driver.avatar} alt={driver.name} className="w-6 h-6 rounded-full" />
                            <div className="text-sm">
                              <span className="font-medium">{driver.name}</span> offers {ride.availableSeats} seats
                              <span className="text-mountain-600 ml-1">(${ride.costPerPerson}/person)</span>
                            </div>
                          </div>
                          <Button size="xs" onClick={() => handleJoinRide(ride)}>
                            Join Ride
                          </Button>
                        </div>
                      )
                    })}
                    {activityRequests.length > 0 && (
                      <div className="text-xs text-green-700">
                        {activityRequests.length} ride request{activityRequests.length > 1 ? 's' : ''} pending
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 sm:ml-4 w-full sm:w-auto">
            <Button size="xs" variant="outline" className="w-full sm:w-auto">
              View Details
            </Button>
            {activity.participants < activity.maxParticipants && (
              <Button 
                size="xs"
                onClick={handleJoinActivity}
                disabled={isJoining}
                className="w-full sm:w-auto"
              >
                {isJoining ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Joining...
                  </>
                ) : (
                  'Join Activity'
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

// Ride Matching Content Component
const RideMatchingContent = () => {
  const { demoRideData, demoUser } = useDemo()
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const handleJoinRide = (rideId) => {
    setToastMessage("Demo: Ride request sent successfully!")
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleOfferRide = (requestId) => {
    setToastMessage("Demo: Ride offer sent successfully!")
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  if (!demoRideData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Demo ride data not available</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {toastMessage}
        </div>
      )}

      {/* Available Ride Offers */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Available Ride Offers</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {demoRideData.rideOffers?.map(offer => {
            const driver = demoRideData.users.find(u => u.id === offer.driverId)
            return (
              <Card key={offer.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <img 
                        src={driver?.avatar} 
                        alt={driver?.name}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900">{driver?.name}</h4>
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="mr-2">⭐ {driver?.rating}</span>
                          <span>{driver?.ridesOffered} rides</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Departure:</strong> {offer.departureTime}</p>
                      <p><strong>Available Seats:</strong> {offer.availableSeats}</p>
                      <p><strong>Pickup Locations:</strong> {offer.pickupLocations.join(', ')}</p>
                      <p><strong>Cost per Person:</strong> ${offer.costPerPerson}</p>
                      {offer.notes && <p><strong>Notes:</strong> {offer.notes}</p>}
                    </div>
                  </div>
                  <Button 
                    onClick={() => handleJoinRide(offer.id)}
                    size="sm"
                    className="ml-4"
                  >
                    Join Ride
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Ride Requests */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Ride Requests</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {demoRideData.rideRequests?.map(request => (
            <Card key={request.id} className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 bg-gray-300 rounded-full mr-3 flex items-center justify-center">
                      <span className="text-gray-600 font-medium">
                        {demoUser?.name?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{demoUser?.name}</h4>
                      <span className="text-sm text-gray-500">Looking for a ride</span>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><strong>Preferred Pickup:</strong> {request.preferredPickup}</p>
                    <p><strong>Willing to Share:</strong> ${request.willingToShare}</p>
                    {request.notes && <p><strong>Notes:</strong> {request.notes}</p>}
                  </div>
                </div>
                <Button 
                  onClick={() => handleOfferRide(request.id)}
                  variant="secondary"
                  size="sm"
                  className="ml-4"
                >
                  Offer Ride
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard