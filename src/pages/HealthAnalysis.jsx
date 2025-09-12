import { useState, useEffect } from 'react'
import { useHealth } from '../contexts/HealthContext'
import { useAuth } from '../contexts/AuthContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import ActivityMetricsCard from '../components/health/ActivityMetricsCard'
import ActivityChart from '../components/health/ActivityChart'
import ActivityCalendar from '../components/health/ActivityCalendar'
import MatchingInsights from '../components/health/MatchingInsights'

const HealthAnalysis = () => {
  const { user } = useAuth()
  const { 
    unifiedActivities, 
    activityMetrics, 
    healthConnections,
    syncProviderActivities,
    loading,
    error 
  } = useHealth()

  const [dateRange, setDateRange] = useState('week') // week, month, year
  const [activityTypeFilter, setActivityTypeFilter] = useState('all')
  const [isSyncing, setIsSyncing] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState('all')

  // Get connected providers
  const connectedProviders = Object.entries(healthConnections)
    .filter(([_, connection]) => connection.isConnected)
    .map(([provider, _]) => provider)

  // Filter activities based on date range and type
  const filteredActivities = unifiedActivities.filter(activity => {
    // Handle both unified activities and legacy Strava activities
    const activityDate = new Date(activity.start_time || activity.start_date)
    const now = new Date()
    let startDate = new Date()

    // Date range filter
    switch (dateRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(now.getMonth() - 1)
        break
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate = new Date(0) // All time
    }

    const inDateRange = activityDate >= startDate

    // Activity type filter - normalize activity types
    let activityType = activity.activity_type || activity.type || 'unknown'
    if (typeof activityType === 'string') {
      activityType = activityType.toLowerCase()
      // Normalize common activity types
      if (activityType === 'run') activityType = 'running'
      if (activityType === 'ride') activityType = 'cycling'
      if (activityType === 'walk') activityType = 'walking'
    }
    
    const matchesType = activityTypeFilter === 'all' || 
      activityType === activityTypeFilter.toLowerCase()

    // Provider filter
    const matchesProvider = selectedProvider === 'all' || 
      activity.provider_type === selectedProvider

    return inDateRange && matchesType && matchesProvider
  })

  // Calculate summary metrics with cross-provider compatibility
  const summaryMetrics = {
    totalActivities: filteredActivities.length,
    totalDistance: filteredActivities.reduce((sum, a) => sum + (a.distance_meters || a.distance || 0), 0),
    totalDuration: filteredActivities.reduce((sum, a) => sum + (a.duration_seconds || a.moving_time || a.elapsed_time || 0), 0),
    totalCalories: filteredActivities.reduce((sum, a) => sum + (a.calories_burned || a.calories || 0), 0),
    totalSteps: filteredActivities.reduce((sum, a) => sum + (a.steps || 0), 0),
    avgHeartRate: Math.round(
      filteredActivities.reduce((sum, a, _, arr) => 
        sum + (a.heart_rate_avg || a.average_heartrate || 0) / (arr.filter(x => x.heart_rate_avg || x.average_heartrate).length || 1), 0
      )
    )
  }

  // Get unique activity types for filter - normalize from all providers
  const activityTypes = [...new Set(unifiedActivities.map(a => {
    let type = a.activity_type || a.type || 'unknown'
    if (typeof type === 'string') {
      type = type.toLowerCase()
      // Normalize common activity types
      if (type === 'run') return 'running'
      if (type === 'ride') return 'cycling'  
      if (type === 'walk') return 'walking'
    }
    return type
  }).filter(Boolean))].sort()

  const handleSync = async () => {
    setIsSyncing(true)
    try {
      for (const provider of connectedProviders) {
        await syncProviderActivities(provider)
      }
    } catch (error) {
      console.error('Sync error:', error)
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <div className="min-h-screen bg-mountain-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-display font-bold text-mountain-900 mb-2">
                Health & Activity Analysis
              </h1>
              <p className="text-mountain-600">
                Comprehensive view of your fitness data from all connected providers
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleSync}
                disabled={isSyncing}
                variant="secondary"
                size="sm"
              >
                {isSyncing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Syncing...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Sync Data
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Connected Providers Status */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {connectedProviders.length > 0 ? (
              connectedProviders.map(provider => (
                <span
                  key={provider}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {provider === 'google_health' ? 'Google Fit' : 
                   provider === 'apple_health' ? 'Apple Health' :
                   provider === 'strava' ? 'Strava' :
                   provider.charAt(0).toUpperCase() + provider.slice(1)}
                </span>
              ))
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-blue-800 font-medium">No health providers connected yet</span>
                </div>
                <p className="text-blue-700 text-sm mt-1 ml-7">
                  Connect Google Fit, Strava, or Apple Health to see your activity analysis and partner matching insights.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <Card.Body>
            <div className="flex flex-wrap gap-4">
              {/* Date Range Filter */}
              <div>
                <label className="block text-sm font-medium text-mountain-700 mb-1">
                  Date Range
                </label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-3 py-2 border border-mountain-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="year">Last Year</option>
                  <option value="all">All Time</option>
                </select>
              </div>

              {/* Activity Type Filter */}
              <div>
                <label className="block text-sm font-medium text-mountain-700 mb-1">
                  Activity Type
                </label>
                <select
                  value={activityTypeFilter}
                  onChange={(e) => setActivityTypeFilter(e.target.value)}
                  className="px-3 py-2 border border-mountain-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Activities</option>
                  {activityTypes.map(type => (
                    <option key={type} value={type}>
                      {type === 'running' ? 'Running' : 
                       type === 'cycling' ? 'Cycling' :
                       type === 'walking' ? 'Walking' :
                       type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Provider Filter */}
              {connectedProviders.length > 1 && (
                <div>
                  <label className="block text-sm font-medium text-mountain-700 mb-1">
                    Data Source
                  </label>
                  <select
                    value={selectedProvider}
                    onChange={(e) => setSelectedProvider(e.target.value)}
                    className="px-3 py-2 border border-mountain-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="all">All Providers</option>
                    {connectedProviders.map(provider => (
                      <option key={provider} value={provider}>
                        {provider === 'google_health' ? 'Google Fit' : 
                         provider === 'apple_health' ? 'Apple Health' :
                         provider === 'strava' ? 'Strava' :
                         provider.charAt(0).toUpperCase() + provider.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </Card.Body>
        </Card>

        {/* Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <ActivityMetricsCard
            title="Total Activities"
            value={summaryMetrics.totalActivities}
            icon="activity"
            color="primary"
          />
          <ActivityMetricsCard
            title="Distance"
            value={`${(summaryMetrics.totalDistance / 1000).toFixed(1)} km`}
            icon="distance"
            color="secondary"
          />
          <ActivityMetricsCard
            title="Duration"
            value={`${Math.floor(summaryMetrics.totalDuration / 3600)}h ${Math.floor((summaryMetrics.totalDuration % 3600) / 60)}m`}
            icon="duration"
            color="green"
          />
          <ActivityMetricsCard
            title="Calories"
            value={summaryMetrics.totalCalories.toLocaleString()}
            icon="calories"
            color="orange"
          />
          <ActivityMetricsCard
            title="Steps"
            value={summaryMetrics.totalSteps.toLocaleString()}
            icon="steps"
            color="purple"
          />
          <ActivityMetricsCard
            title="Avg Heart Rate"
            value={summaryMetrics.avgHeartRate || 'N/A'}
            suffix="bpm"
            icon="heart"
            color="red"
          />
        </div>

        {/* Main Content Grid */}
        {connectedProviders.length === 0 || unifiedActivities.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-mountain-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-mountain-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-semibold text-mountain-900 mb-4">
                {connectedProviders.length === 0 ? 'Connect Your Health Apps' : 'No Activity Data Yet'}
              </h2>
              
              <p className="text-mountain-600 mb-8">
                {connectedProviders.length === 0 
                  ? 'Connect Google Fit, Strava, or Apple Health to see comprehensive activity analysis, partner matching insights, and detailed fitness metrics.'
                  : 'Your connected health apps don\'t have activity data yet, or the data is still syncing. Try manually syncing or check back later.'
                }
              </p>

              <div className="space-y-4">
                {connectedProviders.length === 0 ? (
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link to="/dashboard" className="inline-block">
                      <Button className="w-full sm:w-auto">
                        Connect Health Apps
                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </Button>
                    </Link>
                    <Link to="/find-partners" className="inline-block">
                      <Button variant="outline" className="w-full sm:w-auto">
                        Explore Partner Matching
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      onClick={handleSync}
                      disabled={isSyncing}
                      className="w-full sm:w-auto"
                    >
                      {isSyncing ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Syncing...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Sync Health Data
                        </>
                      )}
                    </Button>
                    <Link to="/dashboard" className="inline-block">
                      <Button variant="outline" className="w-full sm:w-auto">
                        Back to Dashboard
                      </Button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Preview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
                <div className="bg-mountain-50 rounded-lg p-4">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-mountain-900 text-sm">Activity Analytics</h3>
                  <p className="text-xs text-mountain-600 mt-1">Charts, trends, and insights from your workouts</p>
                </div>
                
                <div className="bg-mountain-50 rounded-lg p-4">
                  <div className="w-8 h-8 bg-secondary-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <svg className="w-4 h-4 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-mountain-900 text-sm">Partner Matching</h3>
                  <p className="text-xs text-mountain-600 mt-1">Compatibility analysis for finding workout buddies</p>
                </div>
                
                <div className="bg-mountain-50 rounded-lg p-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-mountain-900 text-sm">Activity Calendar</h3>
                  <p className="text-xs text-mountain-600 mt-1">Year-long heatmap of your fitness activity</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Charts */}
            <div className="lg:col-span-2 space-y-6">
              {/* Activity Chart */}
              <Card>
                <Card.Header>
                  <h2 className="text-xl font-semibold text-mountain-900">Activity Trends</h2>
                </Card.Header>
                <Card.Body>
                  <ActivityChart 
                    activities={filteredActivities}
                    dateRange={dateRange}
                  />
                </Card.Body>
              </Card>

              {/* Activity Calendar */}
              <Card>
                <Card.Header>
                  <h2 className="text-xl font-semibold text-mountain-900">Activity Calendar</h2>
                </Card.Header>
                <Card.Body>
                  <ActivityCalendar activities={filteredActivities} />
                </Card.Body>
              </Card>
            </div>

            {/* Right Column - Insights */}
            <div className="space-y-6">
              {/* Matching Insights */}
              <MatchingInsights 
                activityMetrics={activityMetrics}
                activities={filteredActivities}
              />

              {/* Recent Activities */}
              <Card>
                <Card.Header>
                  <h2 className="text-lg font-semibold text-mountain-900">Recent Activities</h2>
                </Card.Header>
                <Card.Body className="p-0">
                  <div className="divide-y divide-mountain-200 max-h-96 overflow-y-auto">
                    {filteredActivities.slice(0, 10).map((activity) => (
                      <div key={activity.id} className="p-4 hover:bg-mountain-50">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-mountain-900">
                                {activity.name || activity.activity_type}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                activity.provider_type === 'google_health' 
                                  ? 'bg-blue-100 text-blue-700'
                                  : activity.provider_type === 'strava'
                                  ? 'bg-orange-100 text-orange-700'
                                  : activity.provider_type === 'apple_health'
                                  ? 'bg-gray-100 text-gray-700'
                                  : 'bg-green-100 text-green-700'
                              }`}>
                                {activity.provider_type === 'google_health' ? 'Google Fit' : 
                                 activity.provider_type === 'apple_health' ? 'Apple Health' :
                                 activity.provider_type === 'strava' ? 'Strava' :
                                 activity.provider_type}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 mt-1 text-xs text-mountain-600">
                              <span>{new Date(activity.start_time || activity.start_date).toLocaleDateString()}</span>
                              {(activity.distance_meters || activity.distance) && (
                                <span>{((activity.distance_meters || activity.distance) / 1000).toFixed(1)} km</span>
                              )}
                              {(activity.duration_seconds || activity.moving_time || activity.elapsed_time) && (
                                <span>{Math.floor((activity.duration_seconds || activity.moving_time || activity.elapsed_time) / 60)} min</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {filteredActivities.length === 0 && (
                      <div className="p-8 text-center text-mountain-600">
                        No activities found for the selected filters
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HealthAnalysis