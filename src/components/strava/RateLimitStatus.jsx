import { useState, useEffect } from 'react'
import { getRateLimitState } from '../../lib/stravaApi'

const RateLimitStatus = () => {
  const [rateLimitInfo, setRateLimitInfo] = useState(null)
  
  useEffect(() => {
    const updateRateLimitInfo = () => {
      setRateLimitInfo(getRateLimitState())
    }
    
    // Update immediately
    updateRateLimitInfo()
    
    // Update every 5 seconds
    const interval = setInterval(updateRateLimitInfo, 5000)
    
    return () => clearInterval(interval)
  }, [])
  
  if (!rateLimitInfo) return null
  
  const { remainingRequests, windowTimeLeft, isRateLimited } = rateLimitInfo
  const minutesLeft = Math.ceil(windowTimeLeft / 60000)
  
  return (
    <div className="text-xs text-gray-500 mt-2">
      {isRateLimited ? (
        <div className="flex items-center text-red-600">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          Rate limited - try again in {minutesLeft} minutes
        </div>
      ) : (
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          API requests: {remainingRequests} remaining ({minutesLeft}min left)
        </div>
      )}
    </div>
  )
}

export default RateLimitStatus