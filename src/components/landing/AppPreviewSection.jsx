const AppPreviewSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            See TrailBuddy in Action
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect your Strava account to find partners with compatible fitness levels and activity preferences
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Mock Phone Screen 1 - Profile */}
          <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-sm mx-auto">
            <div className="bg-gray-100 rounded-2xl p-4 mb-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">JD</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">John Doe</h3>
                  <p className="text-sm text-gray-600">Intermediate Hiker</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Pace:</span>
                  <span className="font-medium">5:30/km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Activities:</span>
                  <span className="font-medium">47 this year</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rating:</span>
                  <span className="font-medium">⭐⭐⭐⭐⭐ 4.8</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Matched Pace
              </span>
            </div>
          </div>
          
          {/* Mock Phone Screen 2 - Activity Feed */}
          <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-sm mx-auto">
            <h3 className="font-semibold text-gray-900 mb-4">Recent Activities</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Grouse Grind</p>
                  <p className="text-xs text-gray-600">2.9km • 1h 15m</p>
                </div>
                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                  Ride Needed
                </span>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Seawall Ride</p>
                  <p className="text-xs text-gray-600">22km • 1h 30m</p>
                </div>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                  Available
                </span>
              </div>
            </div>
          </div>
          
          {/* Mock Phone Screen 3 - Ride Sharing */}
          <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-sm mx-auto">
            <h3 className="font-semibold text-gray-900 mb-4">Ride Requests</h3>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">Lynn Canyon</span>
                  <span className="text-xs text-gray-600">Tomorrow 9AM</span>
                </div>
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-6 h-6 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Sarah M.</span>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                    5-Star Rated
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button className="flex-1 bg-green-600 text-white py-2 px-3 rounded text-sm">
                    Accept
                  </button>
                  <button className="flex-1 bg-gray-200 text-gray-700 py-2 px-3 rounded text-sm">
                    Decline
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AppPreviewSection