import { formatDistance, formatDuration, formatDate } from '../../utils/formatters'

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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'hike':
        return (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l7 7-7 7" />
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

  const getActivityColor = (type) => {
    switch (type.toLowerCase()) {
      case 'run':
        return 'text-red-500 bg-red-50'
      case 'ride':
        return 'text-blue-500 bg-blue-50'
      case 'hike':
        return 'text-green-500 bg-green-50'
      default:
        return 'text-gray-500 bg-gray-50'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
            {getActivityIcon(activity.type)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {activity.name}
            </h3>
            <p className="text-xs text-gray-500 capitalize">
              {activity.type} • {formatDate(activity.start_date)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {formatDistance(activity.distance)}
          </div>
          <div className="text-xs text-gray-500">Distance</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {formatDuration(activity.moving_time)}
          </div>
          <div className="text-xs text-gray-500">Duration</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {activity.total_elevation_gain ? `${Math.round(activity.total_elevation_gain)}m` : '-'}
          </div>
          <div className="text-xs text-gray-500">Elevation</div>
        </div>
      </div>

      {activity.average_speed && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Avg Speed</span>
            <span>{(activity.average_speed * 3.6).toFixed(1)} km/h</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ActivityCard