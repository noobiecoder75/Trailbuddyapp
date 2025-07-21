import { useState, useEffect } from 'react'
import { useStrava } from '../../contexts/StravaContext'
import ActivityCard from './ActivityCard'
import ActivityFilters from './ActivityFilters'
import RateLimitStatus from './RateLimitStatus'

const ActivityList = () => {
  const { activities, loading, error, fetchActivities, isConnected } = useStrava()
  const [filteredActivities, setFilteredActivities] = useState([])
  const [filters, setFilters] = useState({
    activityType: 'all',
    sortBy: 'date',
    sortOrder: 'desc'
  })

  useEffect(() => {
    if (isConnected) {
      fetchActivities()
    }
  }, [isConnected, fetchActivities])

  useEffect(() => {
    let filtered = [...activities]

    // Filter by activity type
    if (filters.activityType !== 'all') {
      filtered = filtered.filter(activity => 
        activity.type.toLowerCase() === filters.activityType.toLowerCase()
      )
    }

    // Sort activities
    filtered.sort((a, b) => {
      let aValue, bValue

      switch (filters.sortBy) {
        case 'distance':
          aValue = a.distance || 0
          bValue = b.distance || 0
          break
        case 'duration':
          aValue = a.moving_time || 0
          bValue = b.moving_time || 0
          break
        case 'elevation':
          aValue = a.total_elevation_gain || 0
          bValue = b.total_elevation_gain || 0
          break
        case 'date':
        default:
          aValue = new Date(a.start_date).getTime()
          bValue = new Date(b.start_date).getTime()
          break
      }

      if (filters.sortOrder === 'asc') {
        return aValue - bValue
      } else {
        return bValue - aValue
      }
    })

    setFilteredActivities(filtered)
  }, [activities, filters])

  if (!isConnected) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          Connect your Strava account to view your activities.
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="h-6 bg-gray-200 rounded mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
                <div className="text-center">
                  <div className="h-6 bg-gray-200 rounded mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
                <div className="text-center">
                  <div className="h-6 bg-gray-200 rounded mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => fetchActivities()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <ActivityFilters filters={filters} onFiltersChange={setFilters} />
        <RateLimitStatus />
      </div>
      
      {filteredActivities.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">
            No activities found. Try adjusting your filters or go for a run!
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      )}
    </div>
  )
}

export default ActivityList