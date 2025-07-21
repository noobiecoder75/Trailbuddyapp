import { formatDistance, formatDuration, formatDate } from '../../utils/formatters'
import Card from '../ui/Card'

const ActivityCard = ({ activity }) => {
  const getActivityIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'run':
        return (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )
      case 'ride':
        return (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
          </svg>
        )
      case 'hike':
        return (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )
      case 'swim':
        return (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )
      default:
        return (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )
    }
  }

  const getActivityGradient = (type) => {
    switch (type.toLowerCase()) {
      case 'run':
        return 'from-red-500 to-red-600'
      case 'ride':
        return 'from-blue-500 to-blue-600'
      case 'hike':
        return 'from-green-500 to-green-600'
      case 'swim':
        return 'from-cyan-500 to-cyan-600'
      case 'walk':
        return 'from-yellow-500 to-yellow-600'
      case 'workout':
        return 'from-purple-500 to-purple-600'
      default:
        return 'from-mountain-500 to-mountain-600'
    }
  }

  const getActivityBgColor = (type) => {
    switch (type.toLowerCase()) {
      case 'run':
        return 'bg-gradient-to-br from-red-50 to-red-100'
      case 'ride':
        return 'bg-gradient-to-br from-blue-50 to-blue-100'
      case 'hike':
        return 'bg-gradient-to-br from-green-50 to-green-100'
      case 'swim':
        return 'bg-gradient-to-br from-cyan-50 to-cyan-100'
      case 'walk':
        return 'bg-gradient-to-br from-yellow-50 to-yellow-100'
      case 'workout':
        return 'bg-gradient-to-br from-purple-50 to-purple-100'
      default:
        return 'bg-gradient-to-br from-mountain-50 to-mountain-100'
    }
  }

  return (
    <Card 
      hover={true} 
      className={`group relative overflow-hidden ${getActivityBgColor(activity.type)} border-0 transition-all duration-300`}
    >
      {/* Activity type indicator strip */}
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${getActivityGradient(activity.type)}`}></div>
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${getActivityGradient(activity.type)} text-white shadow-soft group-hover:scale-110 transition-transform duration-300`}>
            {getActivityIcon(activity.type)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-mountain-900 truncate mb-1">
              {activity.name}
            </h3>
            <p className="text-sm text-mountain-600 capitalize">
              {activity.type} • {formatDate(activity.start_date)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-xl font-bold text-mountain-900 mb-1">
            {formatDistance(activity.distance)}
          </div>
          <div className="text-xs text-mountain-600 font-medium uppercase tracking-wide">Distance</div>
        </div>
        
        <div className="text-center">
          <div className="text-xl font-bold text-mountain-900 mb-1">
            {formatDuration(activity.moving_time)}
          </div>
          <div className="text-xs text-mountain-600 font-medium uppercase tracking-wide">Duration</div>
        </div>
        
        <div className="text-center">
          <div className="text-xl font-bold text-mountain-900 mb-1">
            {activity.total_elevation_gain ? `${Math.round(activity.total_elevation_gain)}m` : '-'}
          </div>
          <div className="text-xs text-mountain-600 font-medium uppercase tracking-wide">Elevation</div>
        </div>
      </div>

      {activity.average_speed && (
        <div className="pt-4 border-t border-white border-opacity-50">
          <div className="flex justify-between items-center">
            <span className="text-sm text-mountain-600 font-medium">Avg Speed</span>
            <span className="text-sm font-semibold text-mountain-900">
              {(activity.average_speed * 3.6).toFixed(1)} km/h
            </span>
          </div>
        </div>
      )}

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-white bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 pointer-events-none"></div>
    </Card>
  )
}

export default ActivityCard