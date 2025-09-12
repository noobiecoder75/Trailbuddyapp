import { useMemo } from 'react'

const ActivityChart = ({ activities, dateRange }) => {
  const chartData = useMemo(() => {
    // Group activities by date
    const groupedData = {}
    const now = new Date()
    let days = 7

    switch (dateRange) {
      case 'week':
        days = 7
        break
      case 'month':
        days = 30
        break
      case 'year':
        days = 365
        break
      default:
        days = 7
    }

    // Initialize all days with zero values
    for (let i = 0; i < days; i++) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dateKey = date.toISOString().split('T')[0]
      groupedData[dateKey] = {
        date: dateKey,
        activities: 0,
        distance: 0,
        duration: 0,
        calories: 0
      }
    }

    // Aggregate activities by date
    activities.forEach(activity => {
      const dateKey = new Date(activity.start_time || activity.start_date).toISOString().split('T')[0]
      if (groupedData[dateKey]) {
        groupedData[dateKey].activities++
        // Handle different data formats from different providers
        groupedData[dateKey].distance += activity.distance_meters || activity.distance || 0
        groupedData[dateKey].duration += activity.duration_seconds || activity.moving_time || activity.elapsed_time || 0
        groupedData[dateKey].calories += activity.calories_burned || activity.calories || 0
      }
    })

    // Convert to array and sort by date
    return Object.values(groupedData)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-Math.min(days, 30)) // Limit to max 30 days for display
  }, [activities, dateRange])

  // Calculate max values for scaling
  const maxDistance = Math.max(...chartData.map(d => d.distance)) || 1
  const maxDuration = Math.max(...chartData.map(d => d.duration)) || 1

  return (
    <div className="space-y-4">
      {/* Distance Chart */}
      <div>
        <h3 className="text-sm font-medium text-mountain-700 mb-2">Distance (km)</h3>
        <div className="relative h-32 bg-mountain-50 rounded-lg p-2">
          <div className="flex items-end justify-between h-full gap-1">
            {chartData.map((day, index) => {
              const height = ((day.distance / maxDistance) * 100) || 0
              const distanceKm = (day.distance / 1000).toFixed(1)
              return (
                <div
                  key={day.date}
                  className="flex-1 relative group"
                >
                  <div
                    className="bg-primary-500 hover:bg-primary-600 transition-colors rounded-t cursor-pointer"
                    style={{ height: `${height}%` }}
                  >
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      <div className="bg-mountain-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                        <div>{new Date(day.date).toLocaleDateString()}</div>
                        <div className="font-semibold">{distanceKm} km</div>
                      </div>
                      <div className="w-2 h-2 bg-mountain-900 transform rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          {/* X-axis labels */}
          <div className="flex justify-between mt-2 text-xs text-mountain-600">
            <span>{chartData[0] && new Date(chartData[0].date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</span>
            <span>{chartData[chartData.length - 1] && new Date(chartData[chartData.length - 1].date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* Duration Chart */}
      <div>
        <h3 className="text-sm font-medium text-mountain-700 mb-2">Duration (minutes)</h3>
        <div className="relative h-32 bg-mountain-50 rounded-lg p-2">
          <div className="flex items-end justify-between h-full gap-1">
            {chartData.map((day, index) => {
              const height = ((day.duration / maxDuration) * 100) || 0
              const durationMin = Math.round(day.duration / 60)
              return (
                <div
                  key={day.date}
                  className="flex-1 relative group"
                >
                  <div
                    className="bg-secondary-500 hover:bg-secondary-600 transition-colors rounded-t cursor-pointer"
                    style={{ height: `${height}%` }}
                  >
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      <div className="bg-mountain-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                        <div>{new Date(day.date).toLocaleDateString()}</div>
                        <div className="font-semibold">{durationMin} min</div>
                      </div>
                      <div className="w-2 h-2 bg-mountain-900 transform rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          {/* X-axis labels */}
          <div className="flex justify-between mt-2 text-xs text-mountain-600">
            <span>{chartData[0] && new Date(chartData[0].date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</span>
            <span>{chartData[chartData.length - 1] && new Date(chartData[chartData.length - 1].date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* Activity Type Distribution */}
      <div>
        <h3 className="text-sm font-medium text-mountain-700 mb-2">Activity Types</h3>
        <div className="space-y-2">
          {(() => {
            const typeCounts = {}
            activities.forEach(a => {
              // Normalize activity types from different providers
              let activityType = a.activity_type || a.type || 'unknown'
              if (typeof activityType === 'string') {
                activityType = activityType.toLowerCase()
              }
              typeCounts[activityType] = (typeCounts[activityType] || 0) + 1
            })
            const total = activities.length || 1
            
            return Object.entries(typeCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([type, count]) => {
                const percentage = ((count / total) * 100).toFixed(1)
                return (
                  <div key={type} className="flex items-center gap-2">
                    <span className="text-xs text-mountain-600 w-20 capitalize">
                      {type === 'run' ? 'Running' : type === 'ride' ? 'Cycling' : type.charAt(0).toUpperCase() + type.slice(1)}
                    </span>
                    <div className="flex-1 bg-mountain-100 rounded-full h-4 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary-500 to-primary-600"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-mountain-600 w-12 text-right">
                      {percentage}%
                    </span>
                  </div>
                )
              })
          })()}
        </div>
      </div>
    </div>
  )
}

export default ActivityChart