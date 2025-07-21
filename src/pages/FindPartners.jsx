import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Toast from '../components/ui/Toast'

const FindPartners = () => {
  const [filters, setFilters] = useState({
    activity: 'all',
    location: 'all',
    level: 'all',
    availability: 'all'
  })
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [connectingPartnerId, setConnectingPartnerId] = useState(null)

  // Mock partner data
  const partners = [
    {
      id: 1,
      name: 'Sarah Chen',
      age: 28,
      location: 'Vancouver, BC',
      avatar: '👩‍💻',
      rating: 4.9,
      activities: ['Running', 'Hiking', 'Cycling'],
      level: 'Intermediate',
      pace: '5:30/km',
      bio: 'Love weekend trail runs and exploring new routes around Vancouver. Looking for consistent running partners!',
      compatibility: 94,
      lastActive: '2 hours ago',
      verified: true,
      totalActivities: 127,
      joinedDate: 'March 2024'
    },
    {
      id: 2,
      name: 'Mike Johnson',
      age: 32,
      location: 'North Vancouver, BC',
      avatar: '🧔',
      rating: 4.8,
      activities: ['Mountain Biking', 'Hiking', 'Skiing'],
      level: 'Advanced',
      pace: '4:45/km',
      bio: 'Avid mountain biker and hiker. Free most weekends for adventures around the North Shore.',
      compatibility: 87,
      lastActive: '1 day ago',
      verified: true,
      totalActivities: 89,
      joinedDate: 'January 2024'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      age: 25,
      location: 'Burnaby, BC',
      avatar: '🏃‍♀️',
      rating: 4.7,
      activities: ['Running', 'Yoga', 'Swimming'],
      level: 'Beginner',
      pace: '6:15/km',
      bio: 'New to the area and looking to get more active. Would love to find some running buddies for motivation!',
      compatibility: 91,
      lastActive: '3 hours ago',
      verified: true,
      totalActivities: 34,
      joinedDate: 'April 2024'
    },
    {
      id: 4,
      name: 'David Park',
      age: 29,
      location: 'Richmond, BC',
      avatar: '🚴‍♂️',
      rating: 4.9,
      activities: ['Cycling', 'Running', 'Rock Climbing'],
      level: 'Advanced',
      pace: '4:20/km',
      bio: 'Competitive cyclist and runner. Training for upcoming races and looking for serious training partners.',
      compatibility: 78,
      lastActive: '5 hours ago',
      verified: true,
      totalActivities: 203,
      joinedDate: 'February 2024'
    },
    {
      id: 5,
      name: 'Jessica Wong',
      age: 26,
      location: 'West Vancouver, BC',
      avatar: '🥾',
      rating: 4.8,
      activities: ['Hiking', 'Backpacking', 'Photography'],
      level: 'Intermediate',
      pace: '5:45/km',
      bio: 'Weekend warrior who loves exploring BC\'s beautiful trails. Looking for hiking partners for day trips and overnight adventures.',
      compatibility: 89,
      lastActive: '1 hour ago',
      verified: true,
      totalActivities: 156,
      joinedDate: 'December 2023'
    }
  ]

  const getCompatibilityColor = (compatibility) => {
    if (compatibility >= 90) return 'text-green-600 bg-green-100'
    if (compatibility >= 80) return 'text-blue-600 bg-blue-100'
    if (compatibility >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleConnect = async (partner) => {
    setConnectingPartnerId(partner.id)
    // Simulate connection request
    setTimeout(() => {
      setToastMessage(`Connection request sent to ${partner.name}! They'll be notified.`)
      setShowToast(true)
      setConnectingPartnerId(null)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-mountain-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-mountain-900 mb-2">
            Find Adventure Partners
          </h1>
          <p className="text-mountain-600 mb-6">
            Connect with compatible outdoor enthusiasts in British Columbia who match your pace and interests.
          </p>

          {/* Coming Soon Banner */}
          <Card className="bg-gradient-to-r from-secondary-500 to-secondary-600 text-white border-0 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">🚀 Feature Coming Soon!</h2>
                <p className="text-secondary-100">
                  Partner matching is currently in development. Connect your Strava account now to be first in line when we launch!
                </p>
              </div>
              <Link to="/dashboard">
                <Button variant="outline" className="bg-white bg-opacity-20 border-white text-white hover:bg-white hover:text-secondary-600">
                  Connect Strava
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <h3 className="text-lg font-semibold text-mountain-900 mb-6">Filter Partners</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-mountain-700 mb-2">Activity Type</label>
                  <select 
                    className="w-full p-3 border border-mountain-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={filters.activity}
                    onChange={(e) => setFilters({...filters, activity: e.target.value})}
                  >
                    <option value="all">All Activities</option>
                    <option value="running">Running</option>
                    <option value="hiking">Hiking</option>
                    <option value="cycling">Cycling</option>
                    <option value="climbing">Rock Climbing</option>
                    <option value="skiing">Skiing</option>
                    <option value="swimming">Swimming</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-mountain-700 mb-2">Location</label>
                  <select 
                    className="w-full p-3 border border-mountain-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={filters.location}
                    onChange={(e) => setFilters({...filters, location: e.target.value})}
                  >
                    <option value="all">All Locations</option>
                    <option value="vancouver">Vancouver</option>
                    <option value="north-vancouver">North Vancouver</option>
                    <option value="west-vancouver">West Vancouver</option>
                    <option value="burnaby">Burnaby</option>
                    <option value="richmond">Richmond</option>
                    <option value="surrey">Surrey</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-mountain-700 mb-2">Experience Level</label>
                  <select 
                    className="w-full p-3 border border-mountain-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={filters.level}
                    onChange={(e) => setFilters({...filters, level: e.target.value})}
                  >
                    <option value="all">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-mountain-700 mb-2">Availability</label>
                  <select 
                    className="w-full p-3 border border-mountain-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={filters.availability}
                    onChange={(e) => setFilters({...filters, availability: e.target.value})}
                  >
                    <option value="all">Anytime</option>
                    <option value="weekdays">Weekdays</option>
                    <option value="weekends">Weekends</option>
                    <option value="mornings">Mornings</option>
                    <option value="evenings">Evenings</option>
                  </select>
                </div>

                <Button className="w-full">
                  Apply Filters
                </Button>
              </div>
            </Card>
          </div>

          {/* Partners Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-mountain-600">
                  Found <span className="font-semibold text-mountain-900">{partners.length}</span> compatible partners
                </p>
              </div>
              <select className="p-2 border border-mountain-300 rounded-lg text-sm">
                <option>Sort by compatibility</option>
                <option>Sort by rating</option>
                <option>Sort by activity count</option>
                <option>Sort by distance</option>
              </select>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {partners.map((partner) => (
                <Card key={partner.id} hover className="group">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="text-4xl">{partner.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-mountain-900">{partner.name}</h3>
                        {partner.verified && (
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-mountain-600 mb-1">{partner.age} • {partner.location}</p>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex items-center">
                          <span className="text-yellow-500">★</span>
                          <span className="text-sm font-medium text-mountain-900 ml-1">{partner.rating}</span>
                        </div>
                        <span className="text-mountain-400">•</span>
                        <span className="text-sm text-mountain-600">{partner.totalActivities} activities</span>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getCompatibilityColor(partner.compatibility)}`}>
                      {partner.compatibility}% match
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {partner.activities.map((activity, index) => (
                        <span key={index} className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-lg">
                          {activity}
                        </span>
                      ))}
                      <span className={`px-2 py-1 text-xs font-medium rounded-lg ${getLevelColor(partner.level)}`}>
                        {partner.level}
                      </span>
                    </div>
                    <p className="text-sm text-mountain-600 line-clamp-2">{partner.bio}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-mountain-500">Avg Pace:</span>
                      <span className="font-medium text-mountain-900 ml-1">{partner.pace}</span>
                    </div>
                    <div>
                      <span className="text-mountain-500">Last Active:</span>
                      <span className="font-medium text-mountain-900 ml-1">{partner.lastActive}</span>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button 
                      size="sm" 
                      className="flex-1 group-hover:scale-105 transition-transform"
                      onClick={() => handleConnect(partner)}
                      disabled={connectingPartnerId === partner.id}
                    >
                      {connectingPartnerId === partner.id ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Connecting...
                        </>
                      ) : (
                        <>
                          Connect
                          <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Partners
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Button>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <section className="mt-20">
          <Card className="bg-gradient-to-br from-primary-50 to-blue-50 border-0">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold text-mountain-900 mb-4">
                How Partner Matching Works
              </h2>
              <p className="text-mountain-600 max-w-2xl mx-auto">
                Our smart algorithm analyzes multiple factors to find you the most compatible adventure partners.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-mountain-900 mb-2">Fitness Analysis</h3>
                <p className="text-mountain-600 text-sm">
                  We analyze your Strava data to understand your fitness level, pace, and activity preferences.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-mountain-900 mb-2">Location & Schedule</h3>
                <p className="text-mountain-600 text-sm">
                  Location proximity and availability matching ensure convenient meetups that work for everyone.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-mountain-900 mb-2">Personality Match</h3>
                <p className="text-mountain-600 text-sm">
                  Communication style and adventure preferences ensure you connect with like-minded partners.
                </p>
              </div>
            </div>
          </Card>
        </section>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  )
}

export default FindPartners