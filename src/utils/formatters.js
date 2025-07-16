// Format distance in meters to km or m
export const formatDistance = (distanceInMeters) => {
  if (!distanceInMeters) return '-'
  
  if (distanceInMeters >= 1000) {
    return `${(distanceInMeters / 1000).toFixed(1)} km`
  }
  return `${Math.round(distanceInMeters)} m`
}

// Format duration in seconds to HH:MM:SS or MM:SS
export const formatDuration = (durationInSeconds) => {
  if (!durationInSeconds) return '-'
  
  const hours = Math.floor(durationInSeconds / 3600)
  const minutes = Math.floor((durationInSeconds % 3600) / 60)
  const seconds = durationInSeconds % 60
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// Format date to readable format
export const formatDate = (dateString) => {
  if (!dateString) return '-'
  
  const date = new Date(dateString)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today'
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday'
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }
}

// Format elevation gain
export const formatElevation = (elevationInMeters) => {
  if (!elevationInMeters) return '-'
  return `${Math.round(elevationInMeters)} m`
}

// Format speed from m/s to km/h
export const formatSpeed = (speedInMs) => {
  if (!speedInMs) return '-'
  return `${(speedInMs * 3.6).toFixed(1)} km/h`
}

// Format pace for running (min/km)
export const formatPace = (speedInMs) => {
  if (!speedInMs) return '-'
  
  const paceInSeconds = 1000 / speedInMs // seconds per km
  const minutes = Math.floor(paceInSeconds / 60)
  const seconds = Math.round(paceInSeconds % 60)
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}/km`
}