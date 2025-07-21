import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Toast from '../components/ui/Toast'
import { useDemo } from '../contexts/DemoContext'

const PlanActivity = () => {
  const { isDemoMode, demoRideData } = useDemo()
  const [formData, setFormData] = useState({
    activityType: 'running',
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    duration: '60',
    difficulty: 'intermediate',
    maxParticipants: '4',
    equipment: '',
    notes: ''
  })
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [joiningActivityId, setJoiningActivityId] = useState(null)
  const [showRideForm, setShowRideForm] = useState({ offer: false, request: false })

  // Mock upcoming activities
  const upcomingActivities = [
    {
      id: 1,
      title: 'Lynn Canyon Trail Run',
      type: 'Running',
      date: '2024-07-20',
      time: '08:00',
      participants: 3,
      maxParticipants: 4,
      location: 'Lynn Canyon Park',
      organizer: 'Sarah Chen',
      status: 'confirmed'
    },
    {
      id: 2,
      title: 'Grouse Mountain Hike',
      type: 'Hiking',
      date: '2024-07-22',
      time: '09:30',
      participants: 2,
      maxParticipants: 6,
      location: 'Grouse Mountain',
      organizer: 'Mike Johnson',
      status: 'open'
    },
    {
      id: 3,
      title: 'Seawall Cycling',
      type: 'Cycling',
      date: '2024-07-25',
      time: '18:00',
      participants: 4,
      maxParticipants: 5,
      location: 'Stanley Park Seawall',
      organizer: 'David Park',
      status: 'almost_full'
    }
  ]

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

  const handleCreateActivity = async () => {
    setIsCreating(true)
    // Simulate activity creation
    setTimeout(() => {
      setToastMessage('Activity created successfully! Partners will be notified.')
      setShowToast(true)
      setIsCreating(false)
      // Reset form
      setFormData({
        activityType: 'running',
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        duration: '60',
        difficulty: 'intermediate',
        maxParticipants: '4',
        equipment: '',
        notes: ''
      })
    }, 1500)
  }

  const handleJoinActivity = async (activity) => {
    setJoiningActivityId(activity.id)
    // Simulate joining activity
    setTimeout(() => {
      setToastMessage(`Successfully joined "${activity.title}"! You'll receive location details soon.`)
      setShowToast(true)
      setJoiningActivityId(null)
    }, 1000)
  }

  const handleOfferRide = () => {
    setShowRideForm({ offer: false, request: false })
    setToastMessage('Ride offer posted! Participants will be able to see your transportation offer.')
    setShowToast(true)
  }

  const handleRequestRide = () => {
    setShowRideForm({ offer: false, request: false })
    setToastMessage('Ride request posted! Drivers will be notified of your transportation need.')
    setShowToast(true)
  }

  const handleJoinRide = (rideOffer) => {
    const driver = demoRideData.users.find(u => u.id === rideOffer.driverId)
    setToastMessage(`Ride request sent to ${driver.name}! You'll receive pickup details soon.`)
    setShowToast(true)
  }

  return (
    <div className="min-h-screen bg-mountain-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-mountain-900 mb-2">
            Plan New Activity
          </h1>
          <p className="text-mountain-600 mb-6">
            Organize your next outdoor adventure and invite compatible partners to join you.
          </p>

          {/* Coming Soon Banner */}
          <Card className="bg-gradient-to-r from-secondary-500 to-secondary-600 text-white border-0 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">🚀 Feature Coming Soon!</h2>
                <p className="text-secondary-100">
                  Activity planning and coordination tools are currently in development. Preview the interface below!
                </p>
              </div>
              <Link to="/dashboard">
                <Button variant="outline" className="bg-white bg-opacity-20 border-white text-white hover:bg-white hover:text-secondary-600">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Activity Planning Form */}
          <div className="lg:col-span-2">
            <Card>
              <Card.Header>
                <h3 className="text-xl font-semibold text-mountain-900">Create New Activity</h3>
                <p className="text-mountain-600 text-sm">Fill out the details for your outdoor adventure</p>
              </Card.Header>
              
              <Card.Body className="space-y-6">
                {/* Activity Type */}
                <div>
                  <label className="block text-sm font-medium text-mountain-700 mb-2">Activity Type</label>
                  <select 
                    className="w-full p-3 border border-mountain-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={formData.activityType}
                    onChange={(e) => setFormData({...formData, activityType: e.target.value})}
                  >
                    <option value="running">Running</option>
                    <option value="hiking">Hiking</option>
                    <option value="cycling">Cycling</option>
                    <option value="climbing">Rock Climbing</option>
                    <option value="skiing">Skiing</option>
                    <option value="swimming">Swimming</option>
                  </select>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-mountain-700 mb-2">Activity Title</label>
                  <input
                    type="text"
                    placeholder="e.g., Morning Trail Run at Lynn Canyon"
                    className="w-full p-3 border border-mountain-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-mountain-700 mb-2">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Describe the activity, route, and what participants should expect..."
                    className="w-full p-3 border border-mountain-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-mountain-700 mb-2">Date</label>
                    <input
                      type="date"
                      className="w-full p-3 border border-mountain-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-mountain-700 mb-2">Time</label>
                    <input
                      type="time"
                      className="w-full p-3 border border-mountain-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-mountain-700 mb-2">Meeting Location</label>
                  <input
                    type="text"
                    placeholder="e.g., Lynn Canyon Park Entrance"
                    className="w-full p-3 border border-mountain-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>

                {/* Duration & Difficulty */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-mountain-700 mb-2">Duration (minutes)</label>
                    <select 
                      className="w-full p-3 border border-mountain-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    >
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="90">1.5 hours</option>
                      <option value="120">2 hours</option>
                      <option value="180">3 hours</option>
                      <option value="240">4+ hours</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-mountain-700 mb-2">Difficulty Level</label>
                    <select 
                      className="w-full p-3 border border-mountain-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      value={formData.difficulty}
                      onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                {/* Max Participants */}
                <div>
                  <label className="block text-sm font-medium text-mountain-700 mb-2">Maximum Participants</label>
                  <select 
                    className="w-full p-3 border border-mountain-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={formData.maxParticipants}
                    onChange={(e) => setFormData({...formData, maxParticipants: e.target.value})}
                  >
                    <option value="2">2 people</option>
                    <option value="3">3 people</option>
                    <option value="4">4 people</option>
                    <option value="5">5 people</option>
                    <option value="6">6 people</option>
                    <option value="8">8 people</option>
                    <option value="10">10+ people</option>
                  </select>
                </div>

                {/* Equipment */}
                <div>
                  <label className="block text-sm font-medium text-mountain-700 mb-2">Required Equipment</label>
                  <input
                    type="text"
                    placeholder="e.g., Running shoes, water bottle, headlamp"
                    className="w-full p-3 border border-mountain-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={formData.equipment}
                    onChange={(e) => setFormData({...formData, equipment: e.target.value})}
                  />
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-sm font-medium text-mountain-700 mb-2">Additional Notes</label>
                  <textarea
                    rows={2}
                    placeholder="Any other important information for participants..."
                    className="w-full p-3 border border-mountain-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  />
                </div>

                {/* Transportation Section - Demo Feature */}
                {isDemoMode && (
                  <div className="border-t pt-6 mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-mountain-900">Transportation Coordination</h4>
                        <p className="text-sm text-mountain-600">Help participants get to the activity</p>
                      </div>
                      <span className="bg-secondary-100 text-secondary-800 text-xs font-medium px-2 py-1 rounded-full">
                        Demo Feature
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <Button
                        variant="outline"
                        className="p-4 h-auto flex flex-col items-center space-y-2 border-2 border-dashed border-mountain-300 hover:border-primary-500 hover:bg-primary-50"
                        onClick={() => setShowRideForm({ offer: true, request: false })}
                      >
                        <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 17l4-4 4 4M8 7l4 4 4-4" />
                        </svg>
                        <div className="text-center">
                          <div className="font-semibold text-mountain-900">Offer a Ride</div>
                          <div className="text-sm text-mountain-600">Share your vehicle with participants</div>
                        </div>
                      </Button>

                      <Button
                        variant="outline"
                        className="p-4 h-auto flex flex-col items-center space-y-2 border-2 border-dashed border-mountain-300 hover:border-secondary-500 hover:bg-secondary-50"
                        onClick={() => setShowRideForm({ offer: false, request: true })}
                      >
                        <svg className="w-8 h-8 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                        </svg>
                        <div className="text-center">
                          <div className="font-semibold text-mountain-900">Request a Ride</div>
                          <div className="text-sm text-mountain-600">Find transportation to the activity</div>
                        </div>
                      </Button>
                    </div>

                    {/* Ride Offer Form */}
                    {showRideForm.offer && (
                      <div className="bg-primary-50 p-4 rounded-xl border border-primary-200 mb-4">
                        <h5 className="font-semibold text-mountain-900 mb-3">Offer Transportation</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-mountain-700 mb-1">Available Seats</label>
                            <select className="w-full p-2 border border-mountain-300 rounded-lg text-sm">
                              <option value="1">1 seat</option>
                              <option value="2">2 seats</option>
                              <option value="3">3 seats</option>
                              <option value="4">4 seats</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-mountain-700 mb-1">Cost Share (per person)</label>
                            <input type="number" placeholder="8" className="w-full p-2 border border-mountain-300 rounded-lg text-sm" />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-mountain-700 mb-1">Pickup Locations</label>
                            <input type="text" placeholder="e.g., Lonsdale Quay, Deep Cove" className="w-full p-2 border border-mountain-300 rounded-lg text-sm" />
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-3">
                          <Button size="sm" onClick={handleOfferRide}>Post Ride Offer</Button>
                          <Button size="sm" variant="outline" onClick={() => setShowRideForm({ offer: false, request: false })}>Cancel</Button>
                        </div>
                      </div>
                    )}

                    {/* Ride Request Form */}
                    {showRideForm.request && (
                      <div className="bg-secondary-50 p-4 rounded-xl border border-secondary-200 mb-4">
                        <h5 className="font-semibold text-mountain-900 mb-3">Request Transportation</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-mountain-700 mb-1">Preferred Pickup</label>
                            <input type="text" placeholder="e.g., Vancouver Downtown" className="w-full p-2 border border-mountain-300 rounded-lg text-sm" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-mountain-700 mb-1">Willing to Share ($)</label>
                            <input type="number" placeholder="15" className="w-full p-2 border border-mountain-300 rounded-lg text-sm" />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-mountain-700 mb-1">Additional Notes</label>
                            <input type="text" placeholder="Flexible on pickup location within Vancouver" className="w-full p-2 border border-mountain-300 rounded-lg text-sm" />
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-3">
                          <Button size="sm" onClick={handleRequestRide}>Post Ride Request</Button>
                          <Button size="sm" variant="outline" onClick={() => setShowRideForm({ offer: false, request: false })}>Cancel</Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex space-x-4 pt-4">
                  <Button 
                    className="flex-1"
                    onClick={handleCreateActivity}
                    disabled={isCreating}
                  >
                    {isCreating ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Activity...
                      </>
                    ) : (
                      <>
                        Create Activity
                        <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </>
                    )}
                  </Button>
                  <Button variant="outline">
                    Save as Draft
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Tips */}
            <Card>
              <Card.Header>
                <h3 className="text-lg font-semibold text-mountain-900">Planning Tips</h3>
              </Card.Header>
              <Card.Body className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-mountain-900 text-sm">Be Specific</h4>
                    <p className="text-mountain-600 text-xs">Include exact meeting points and clear activity descriptions</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-mountain-900 text-sm">Plan Ahead</h4>
                    <p className="text-mountain-600 text-xs">Give participants at least 24-48 hours notice</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-mountain-900 text-sm">Check Weather</h4>
                    <p className="text-mountain-600 text-xs">Include backup plans for weather changes</p>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Popular Locations */}
            <Card>
              <Card.Header>
                <h3 className="text-lg font-semibold text-mountain-900">Popular BC Locations</h3>
              </Card.Header>
              <Card.Body className="space-y-3">
                <div className="text-sm space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-mountain-700">Lynn Canyon Park</span>
                    <span className="text-xs text-mountain-500">North Van</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-mountain-700">Stanley Park Seawall</span>
                    <span className="text-xs text-mountain-500">Vancouver</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-mountain-700">Grouse Mountain</span>
                    <span className="text-xs text-mountain-500">North Van</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-mountain-700">Deep Cove</span>
                    <span className="text-xs text-mountain-500">North Van</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-mountain-700">Pacific Spirit Park</span>
                    <span className="text-xs text-mountain-500">Vancouver</span>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Transportation Tips - Demo Feature */}
            {isDemoMode && (
              <Card>
                <Card.Header>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-mountain-900">Transportation Tips</h3>
                    <span className="bg-secondary-100 text-secondary-800 text-xs font-medium px-2 py-1 rounded-full">Demo</span>
                  </div>
                </Card.Header>
                <Card.Body className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-mountain-900 text-sm">Share Costs</h4>
                      <p className="text-mountain-600 text-xs">Split gas money fairly - typical $8-15 per person for local activities</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-mountain-900 text-sm">Pick Central Locations</h4>
                      <p className="text-mountain-600 text-xs">Choose pickup spots accessible to multiple participants</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-mountain-900 text-sm">Confirm Early</h4>
                      <p className="text-mountain-600 text-xs">Finalize ride arrangements 24 hours before the activity</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            )}
          </div>
        </div>

        {/* Upcoming Activities */}
        <section className="mt-12">
          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-display font-bold text-mountain-900">Upcoming Activities</h2>
                  <p className="text-mountain-600 text-sm">Join other organized adventures in your area</p>
                </div>
                <Link to="/find-partners">
                  <Button variant="outline" size="sm">
                    Browse All Activities
                  </Button>
                </Link>
              </div>
            </Card.Header>
            
            <Card.Body className="p-0">
              <div className="divide-y divide-mountain-200">
                {upcomingActivities.map((activity) => (
                  <div key={activity.id} className="p-6 hover:bg-mountain-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-lg font-semibold text-mountain-900">{activity.title}</h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(activity.status)}`}>
                              {activity.status.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-sm text-mountain-600 mb-2">
                            Organized by {activity.organizer}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-mountain-600">
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {new Date(activity.date).toLocaleDateString()} at {activity.time}
                            </div>
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {activity.location}
                            </div>
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              {activity.participants}/{activity.maxParticipants} joined
                            </div>
                          </div>

                          {/* Transportation Info - Demo Feature */}
                          {isDemoMode && (
                            <div className="mt-3">
                              {(() => {
                                const activityRides = demoRideData.rideOffers.filter(offer => offer.activityId === activity.id)
                                const activityRequests = demoRideData.rideRequests.filter(req => req.activityId === activity.id)
                                
                                if (activityRides.length > 0 || activityRequests.length > 0) {
                                  return (
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
                                  )
                                }
                                return null
                              })()}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                        {activity.participants < activity.maxParticipants && (
                          <Button 
                            size="sm"
                            onClick={() => handleJoinActivity(activity)}
                            disabled={joiningActivityId === activity.id}
                          >
                            {joiningActivityId === activity.id ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                ))}
              </div>
            </Card.Body>
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

export default PlanActivity