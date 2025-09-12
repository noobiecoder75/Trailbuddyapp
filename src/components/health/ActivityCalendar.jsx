import { useMemo } from 'react'

const ActivityCalendar = ({ activities }) => {
  const calendarData = useMemo(() => {
    const now = new Date()
    const startDate = new Date(now.getFullYear(), 0, 1) // Start of current year
    const endDate = new Date(now.getFullYear(), 11, 31) // End of current year
    
    // Create activity map by date - handle all provider formats
    const activityMap = {}
    activities.forEach(activity => {
      const dateKey = new Date(activity.start_time || activity.start_date).toISOString().split('T')[0]
      if (!activityMap[dateKey]) {
        activityMap[dateKey] = {
          count: 0,
          distance: 0,
          duration: 0,
          calories: 0
        }
      }
      activityMap[dateKey].count++
      activityMap[dateKey].distance += activity.distance_meters || activity.distance || 0
      activityMap[dateKey].duration += activity.duration_seconds || activity.moving_time || activity.elapsed_time || 0
      activityMap[dateKey].calories += activity.calories_burned || activity.calories || 0
    })

    // Calculate max values for intensity scaling
    const maxCount = Math.max(...Object.values(activityMap).map(d => d.count), 1)
    
    // Generate calendar grid (weeks x 7 days)
    const weeks = []
    const currentDate = new Date(startDate)
    
    // Start from the first day of the week containing startDate
    currentDate.setDate(currentDate.getDate() - currentDate.getDay())
    
    while (currentDate <= endDate || currentDate.getDay() !== 0) {
      const week = []
      for (let i = 0; i < 7; i++) {
        const dateStr = currentDate.toISOString().split('T')[0]
        const isCurrentYear = currentDate.getFullYear() === now.getFullYear()
        const activityData = activityMap[dateStr]
        
        week.push({
          date: new Date(currentDate),
          dateStr,
          isCurrentYear,
          isToday: dateStr === now.toISOString().split('T')[0],
          activityData,
          intensity: activityData ? Math.min(4, Math.ceil((activityData.count / maxCount) * 4)) : 0
        })
        
        currentDate.setDate(currentDate.getDate() + 1)
      }
      weeks.push(week)
      
      if (currentDate > endDate && currentDate.getDay() === 0) break
    }
    
    return weeks
  }, [activities])

  const getIntensityColor = (intensity) => {
    const colors = [
      'bg-mountain-100', // 0 activities
      'bg-green-200',    // 1 activity level
      'bg-green-300',    // 2 activity level
      'bg-green-400',    // 3 activity level
      'bg-green-500'     // 4+ activity level
    ]
    return colors[intensity] || colors[0]
  }

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex items-center justify-between text-xs text-mountain-600">
        <span>Activity intensity for {new Date().getFullYear()}</span>
        <div className="flex items-center gap-1">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map(level => (
            <div
              key={level}
              className={`w-3 h-3 rounded-sm ${getIntensityColor(level)}`}
            />
          ))}
          <span>More</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="relative">
        {/* Month Labels */}
        <div className="flex mb-2">
          {monthNames.map((month, index) => {
            // Calculate approximate position for each month
            const monthStart = new Date(new Date().getFullYear(), index, 1)
            const yearStart = new Date(new Date().getFullYear(), 0, 1)
            const daysDiff = Math.floor((monthStart - yearStart) / (1000 * 60 * 60 * 24))
            const weeksDiff = Math.floor(daysDiff / 7)
            const leftPosition = (weeksDiff / calendarData.length) * 100

            return (
              <div
                key={month}
                className="absolute text-xs text-mountain-600"
                style={{ left: `${leftPosition}%` }}
              >
                {month}
              </div>
            )
          })}
        </div>

        {/* Day Labels */}
        <div className="flex">
          <div className="flex flex-col text-xs text-mountain-600 mr-2 justify-around h-20">
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
          </div>

          {/* Calendar Cells */}
          <div className="flex gap-1 overflow-x-auto">
            {calendarData.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day, dayIndex) => (
                  <div
                    key={day.dateStr}
                    className={`
                      w-3 h-3 rounded-sm cursor-pointer transition-all duration-200 hover:scale-110
                      ${getIntensityColor(day.intensity)}
                      ${day.isToday ? 'ring-2 ring-primary-500' : ''}
                      ${!day.isCurrentYear ? 'opacity-30' : ''}
                      group relative
                    `}
                    title={`${day.date.toLocaleDateString()} - ${day.activityData ? day.activityData.count : 0} activities`}
                  >
                    {/* Tooltip */}
                    {day.activityData && (
                      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                        <div className="bg-mountain-900 text-white text-xs rounded px-2 py-1">
                          <div className="font-semibold">{day.date.toLocaleDateString()}</div>
                          <div>{day.activityData.count} activities</div>
                          {day.activityData.distance > 0 && (
                            <div>{(day.activityData.distance / 1000).toFixed(1)} km</div>
                          )}
                          {day.activityData.duration > 0 && (
                            <div>{Math.round(day.activityData.duration / 60)} min</div>
                          )}
                        </div>
                        <div className="w-2 h-2 bg-mountain-900 transform rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-mountain-200">
        <div className="text-center">
          <div className="text-lg font-semibold text-mountain-900">
            {activities.length}
          </div>
          <div className="text-xs text-mountain-600">Total Activities</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-mountain-900">
            {Math.round(activities.length / 12 * 10) / 10}
          </div>
          <div className="text-xs text-mountain-600">Per Month</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-mountain-900">
            {activities.filter(a => {
              const activityDate = new Date(a.start_time || a.start_date)
              const today = new Date()
              const diffTime = Math.abs(today - activityDate)
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
              return diffDays <= 7
            }).length}
          </div>
          <div className="text-xs text-mountain-600">This Week</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-mountain-900">
            {(() => {
              const activeDays = new Set(
                activities.map(a => new Date(a.start_time || a.start_date).toISOString().split('T')[0])
              ).size
              return Math.round((activeDays / 365) * 100)
            })()}%
          </div>
          <div className="text-xs text-mountain-600">Days Active</div>
        </div>
      </div>
    </div>
  )
}

export default ActivityCalendar