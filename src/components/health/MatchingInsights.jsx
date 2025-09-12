import Card from '../ui/Card'
import Button from '../ui/Button'
import { Link } from 'react-router-dom'

const MatchingInsights = ({ activityMetrics, activities }) => {
  // Calculate activity level score
  const calculateActivityScore = () => {
    if (!activities.length) return 0
    
    // Get activities from last 4 weeks
    const fourWeeksAgo = new Date()
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28)
    
    const recentActivities = activities.filter(a => 
      new Date(a.start_time || a.start_date) >= fourWeeksAgo
    )
    
    if (!recentActivities.length) return 0
    
    // Calculate weekly averages - handle all provider formats
    const weeklyMinutes = recentActivities.reduce((sum, a) => 
      sum + ((a.duration_seconds || a.moving_time || a.elapsed_time || 0) / 60), 0) / 4
    const weeklyWorkouts = recentActivities.length / 4
    const weeklySteps = recentActivities.reduce((sum, a) => 
      sum + (a.steps || 0), 0) / 4
    
    // Score calculation (0-100)
    let score = 0
    // Active minutes (40% weight): 150+ minutes = full points
    score += Math.min(40, (weeklyMinutes / 150) * 40)
    // Workout frequency (30% weight): 4+ workouts = full points  
    score += Math.min(30, (weeklyWorkouts / 4) * 30)
    // Daily steps (30% weight): 10000+ steps/day = full points
    score += Math.min(30, ((weeklySteps / 7) / 10000) * 30)
    
    return Math.round(score)
  }

  // Determine fitness level
  const getFitnessLevel = (score) => {
    if (score >= 80) return { level: 'Elite', color: 'text-purple-600', bg: 'bg-purple-100' }
    if (score >= 60) return { level: 'Advanced', color: 'text-green-600', bg: 'bg-green-100' }
    if (score >= 40) return { level: 'Intermediate', color: 'text-blue-600', bg: 'bg-blue-100' }
    if (score >= 20) return { level: 'Beginner', color: 'text-yellow-600', bg: 'bg-yellow-100' }
    return { level: 'Getting Started', color: 'text-mountain-600', bg: 'bg-mountain-100' }
  }

  // Calculate preferred workout times
  const getPreferredTimes = () => {
    const hourCounts = {}
    activities.forEach(activity => {
      const hour = new Date(activity.start_time || activity.start_date).getHours()
      hourCounts[hour] = (hourCounts[hour] || 0) + 1
    })
    
    const sortedHours = Object.entries(hourCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
    
    return sortedHours.map(([hour, count]) => ({
      time: `${hour}:00`,
      timeLabel: `${hour > 12 ? hour - 12 : hour}${hour >= 12 ? 'PM' : 'AM'}`,
      count
    }))
  }

  // Get activity type preferences - handle all provider formats
  const getActivityPreferences = () => {
    const typeCounts = {}
    activities.forEach(activity => {
      let activityType = activity.activity_type || activity.type || 'unknown'
      // Normalize activity types
      if (typeof activityType === 'string') {
        activityType = activityType.toLowerCase()
        if (activityType === 'run') activityType = 'running'
        if (activityType === 'ride') activityType = 'cycling'
        if (activityType === 'walk') activityType = 'walking'
      }
      typeCounts[activityType] = (typeCounts[activityType] || 0) + 1
    })
    
    return Object.entries(typeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([type, count]) => ({
        type: type.charAt(0).toUpperCase() + type.slice(1),
        count,
        percentage: Math.round((count / activities.length) * 100)
      }))
  }

  // Calculate compatibility insights
  const getCompatibilityInsights = (score) => {
    const insights = []
    
    if (score >= 60) {
      insights.push({
        icon: '🏃‍♂️',
        text: 'Great match for active partners seeking regular training sessions'
      })
      insights.push({
        icon: '⚡',
        text: 'Compatible with high-intensity group activities and challenges'
      })
    } else if (score >= 40) {
      insights.push({
        icon: '🚶‍♂️',
        text: 'Perfect for moderate-pace activities and weekend adventures'
      })
      insights.push({
        icon: '🌟',
        text: 'Great for partners looking to build consistent habits together'
      })
    } else {
      insights.push({
        icon: '🌱',
        text: 'Excellent match for beginners starting their fitness journey'
      })
      insights.push({
        icon: '👥',
        text: 'Ideal for supportive, encouraging workout partnerships'
      })
    }
    
    return insights
  }

  const activityScore = calculateActivityScore()
  const fitnessLevel = getFitnessLevel(activityScore)
  const preferredTimes = getPreferredTimes()
  const activityPreferences = getActivityPreferences()
  const compatibilityInsights = getCompatibilityInsights(activityScore)

  return (
    <div className="space-y-6">
      {/* Activity Level Score */}
      <Card>
        <Card.Header>
          <h2 className="text-lg font-semibold text-mountain-900">Your Activity Level</h2>
        </Card.Header>
        <Card.Body>
          <div className="text-center mb-4">
            <div className="relative w-24 h-24 mx-auto mb-3">
              {/* Circular progress */}
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-mountain-200"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${activityScore * 2.83} 283`}
                  className={fitnessLevel.color}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-mountain-900">{activityScore}</span>
              </div>
            </div>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${fitnessLevel.bg} ${fitnessLevel.color}`}>
              {fitnessLevel.level}
            </div>
          </div>
          <p className="text-sm text-mountain-600 text-center">
            Based on your last 4 weeks of activity data
          </p>
        </Card.Body>
      </Card>

      {/* Preferred Times */}
      {preferredTimes.length > 0 && (
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold text-mountain-900">Preferred Workout Times</h3>
          </Card.Header>
          <Card.Body>
            <div className="space-y-2">
              {preferredTimes.map((timeSlot, index) => (
                <div key={timeSlot.time} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-mountain-900">
                    {timeSlot.timeLabel}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-mountain-200 rounded-full h-2">
                      <div 
                        className="bg-primary-500 h-2 rounded-full"
                        style={{ width: `${(timeSlot.count / preferredTimes[0].count) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-mountain-600 w-8 text-right">
                      {timeSlot.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Activity Preferences */}
      {activityPreferences.length > 0 && (
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold text-mountain-900">Activity Preferences</h3>
          </Card.Header>
          <Card.Body>
            <div className="space-y-3">
              {activityPreferences.map((activity, index) => (
                <div key={activity.type} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-mountain-900">
                    {activity.type}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-mountain-600">
                      {activity.percentage}%
                    </span>
                    <div className="w-16 bg-mountain-200 rounded-full h-2">
                      <div 
                        className="bg-secondary-500 h-2 rounded-full"
                        style={{ width: `${activity.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Compatibility Insights */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-mountain-900">Partner Compatibility</h3>
        </Card.Header>
        <Card.Body>
          <div className="space-y-3">
            {compatibilityInsights.map((insight, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="text-lg">{insight.icon}</span>
                <p className="text-sm text-mountain-700 flex-1">
                  {insight.text}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-mountain-200">
            <Link to="/find-partners" className="w-full">
              <Button className="w-full">
                Find Compatible Partners
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </Button>
            </Link>
          </div>
        </Card.Body>
      </Card>

      {/* Quick Stats */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-mountain-900">Quick Stats</h3>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-mountain-900">
                {Math.round(activities.reduce((sum, a) => sum + (a.duration_seconds || a.moving_time || a.elapsed_time || 0), 0) / 3600)}h
              </div>
              <div className="text-xs text-mountain-600">Total Hours</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-mountain-900">
                {activities.length ? Math.round(activities.length / ((Date.now() - new Date(activities[activities.length - 1]?.start_time || activities[activities.length - 1]?.start_date)) / (1000 * 60 * 60 * 24 * 7))) : 0}
              </div>
              <div className="text-xs text-mountain-600">Avg/Week</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-mountain-900">
                {activities.length ? Math.round(activities.reduce((sum, a) => sum + (a.duration_seconds || a.moving_time || a.elapsed_time || 0), 0) / activities.length / 60) : 0}m
              </div>
              <div className="text-xs text-mountain-600">Avg Duration</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-mountain-900">
                {new Set(activities.map(a => a.activity_type || a.type)).size}
              </div>
              <div className="text-xs text-mountain-600">Activity Types</div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}

export default MatchingInsights