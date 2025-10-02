import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { getRateLimitState } from '../../lib/stravaApiEnhanced'
import { BarChart3, AlertTriangle, Clock, Zap } from 'lucide-react'

const EnhancedRateLimitStatus = () => {
  const { user } = useAuth()
  const [rateLimitInfo, setRateLimitInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      updateRateLimitInfo()
      // Update every 30 seconds for enhanced mode, 5 seconds for legacy
      const interval = setInterval(updateRateLimitInfo, 30000)
      return () => clearInterval(interval)
    }
  }, [user])

  const updateRateLimitInfo = async () => {
    try {
      const info = await getRateLimitState(user?.id)
      setRateLimitInfo(info)
    } catch (error) {
      console.error('Failed to get rate limit state:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="text-xs text-gray-500 mt-2 flex items-center">
        <div className="animate-spin rounded-full h-3 w-3 border-b border-gray-400 mr-2"></div>
        Loading rate limits...
      </div>
    )
  }

  if (!rateLimitInfo) return null

  const {
    remainingRequests,
    dailyRemainingRequests,
    windowTimeLeft,
    isRateLimited,
    retryAfter,
    isEnhanced
  } = rateLimitInfo

  const minutesLeft = Math.ceil(windowTimeLeft / 60000)
  const hoursLeft = Math.floor(minutesLeft / 60)
  const minsLeft = minutesLeft % 60

  const formatTimeLeft = () => {
    if (hoursLeft > 0) {
      return `${hoursLeft}h ${minsLeft}m`
    }
    return `${minutesLeft}m`
  }

  const getStatusColor = () => {
    if (isRateLimited) return 'text-red-600'
    if (remainingRequests <= 10) return 'text-amber-600'
    return 'text-green-600'
  }

  const getStatusIcon = () => {
    if (isRateLimited) return <AlertTriangle className="w-4 h-4" />
    if (remainingRequests <= 10) return <Clock className="w-4 h-4" />
    return <Zap className="w-4 h-4" />
  }

  return (
    <div className="text-xs mt-2">
      {isRateLimited && retryAfter ? (
        <div className="flex items-center text-red-600 bg-red-50 px-3 py-2 rounded-lg">
          <AlertTriangle className="w-4 h-4 mr-2" />
          <div>
            <div className="font-medium">Rate Limited</div>
            <div className="text-red-500">
              Try again at {new Date(retryAfter).toLocaleTimeString()}
            </div>
          </div>
        </div>
      ) : (
        <div className={`flex items-center ${getStatusColor()}`}>
          {getStatusIcon()}
          <div className="ml-2">
            {isEnhanced ? (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">15min:</span>
                  <span>{remainingRequests} remaining</span>
                </div>
                {dailyRemainingRequests !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Daily:</span>
                    <span>{dailyRemainingRequests} remaining</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-gray-500">
                  <span>Resets in:</span>
                  <span>{formatTimeLeft()}</span>
                </div>
                <div className="flex items-center text-blue-600">
                  <BarChart3 className="w-3 h-3 mr-1" />
                  <span className="text-xs">Enhanced Tracking</span>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span>API requests:</span>
                  <span>{remainingRequests} remaining</span>
                </div>
                <div className="flex items-center justify-between text-gray-500">
                  <span>Resets in:</span>
                  <span>{formatTimeLeft()}</span>
                </div>
                <div className="text-gray-400 text-xs">Legacy Mode</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Progress bars */}
      {!isRateLimited && (
        <div className="mt-2 space-y-1">
          {/* 15-minute progress */}
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${
                remainingRequests <= 10 ? 'bg-amber-500' : 'bg-green-500'
              }`}
              style={{
                width: `${Math.max(0, (remainingRequests / (isEnhanced ? 100 : 90)) * 100)}%`
              }}
            ></div>
          </div>

          {/* Daily progress (enhanced mode only) */}
          {isEnhanced && dailyRemainingRequests !== undefined && (
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div
                className={`h-1 rounded-full transition-all duration-300 ${
                  dailyRemainingRequests <= 100 ? 'bg-amber-400' : 'bg-blue-500'
                }`}
                style={{
                  width: `${Math.max(0, (dailyRemainingRequests / 1000) * 100)}%`
                }}
              ></div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default EnhancedRateLimitStatus