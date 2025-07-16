const ActivityFilters = ({ filters, onFiltersChange }) => {
  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const activityTypes = [
    { value: 'all', label: 'All Activities' },
    { value: 'run', label: 'Running' },
    { value: 'ride', label: 'Cycling' },
    { value: 'hike', label: 'Hiking' },
    { value: 'walk', label: 'Walking' },
    { value: 'swim', label: 'Swimming' }
  ]

  const sortOptions = [
    { value: 'date', label: 'Date' },
    { value: 'distance', label: 'Distance' },
    { value: 'duration', label: 'Duration' },
    { value: 'elevation', label: 'Elevation' }
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Type:</label>
          <select
            value={filters.activityType}
            onChange={(e) => handleFilterChange('activityType', e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {activityTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Order:</label>
          <select
            value={filters.sortOrder}
            onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="desc">Highest First</option>
            <option value="asc">Lowest First</option>
          </select>
        </div>

        <div className="flex items-center space-x-2 ml-auto">
          <button
            onClick={() => onFiltersChange({
              activityType: 'all',
              sortBy: 'date',
              sortOrder: 'desc'
            })}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  )
}

export default ActivityFilters