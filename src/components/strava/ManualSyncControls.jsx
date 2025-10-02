import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import {
  requestSyncApproval,
  getPendingSyncRequests,
  requiresManualSyncApproval,
  updateSyncRequestStatus
} from '../../lib/stravaApiEnhanced'
import { Play, Clock, CheckCircle, XCircle, AlertTriangle, Settings } from 'lucide-react'

const ManualSyncControls = () => {
  const { user } = useAuth()
  const [isManualSyncOnly, setIsManualSyncOnly] = useState(false)
  const [pendingRequests, setPendingRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    if (user) {
      loadSyncStatus()
      loadPendingRequests()
    }
  }, [user])

  const loadSyncStatus = async () => {
    try {
      const manualOnly = await requiresManualSyncApproval(user.id)
      setIsManualSyncOnly(manualOnly)
    } catch (error) {
      console.error('Failed to load sync status:', error)
    }
  }

  const loadPendingRequests = async () => {
    try {
      const requests = await getPendingSyncRequests(user.id)
      setPendingRequests(requests)
    } catch (error) {
      console.error('Failed to load pending requests:', error)
    }
  }

  const handleRequestSync = async (syncType) => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      await requestSyncApproval(user.id, syncType)
      setSuccess(`${syncType.replace('_', ' ')} request submitted successfully`)
      await loadPendingRequests()
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleApproveRequest = async (requestId) => {
    try {
      await updateSyncRequestStatus(requestId, 'approved')
      setSuccess('Sync request approved')
      await loadPendingRequests()
    } catch (error) {
      setError(error.message)
    }
  }

  const handleRejectRequest = async (requestId) => {
    try {
      await updateSyncRequestStatus(requestId, 'rejected')
      setSuccess('Sync request rejected')
      await loadPendingRequests()
    } catch (error) {
      setError(error.message)
    }
  }

  const formatRequestType = (type) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now - time) / (1000 * 60))

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!user) return null

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Settings className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Sync Controls</h3>
        </div>
        {isManualSyncOnly && (
          <div className="flex items-center text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
            <AlertTriangle className="w-4 h-4 mr-1" />
            Manual Approval Required
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <XCircle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            <p className="text-green-700">{success}</p>
          </div>
        </div>
      )}

      {/* Request Sync Buttons */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-800 mb-3">Request Sync</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => handleRequestSync('profile_sync')}
            disabled={loading}
            className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Play className="w-4 h-4 mr-2" />
            Profile Sync
          </button>
          <button
            onClick={() => handleRequestSync('activities_sync')}
            disabled={loading}
            className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Play className="w-4 h-4 mr-2" />
            Activities Sync
          </button>
          <button
            onClick={() => handleRequestSync('full_sync')}
            disabled={loading}
            className="flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Play className="w-4 h-4 mr-2" />
            Full Sync
          </button>
        </div>
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div>
          <h4 className="text-md font-medium text-gray-800 mb-3">Pending Requests</h4>
          <div className="space-y-3">
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center">
                  {getStatusIcon(request.status)}
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {formatRequestType(request.request_type)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Requested {formatTimeAgo(request.requested_at)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                  {request.status === 'pending' && (
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleApproveRequest(request.id)}
                        className="p-1 text-green-600 hover:bg-green-100 rounded"
                        title="Approve"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRejectRequest(request.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                        title="Reject"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h5 className="text-sm font-medium text-blue-900 mb-2">How Manual Sync Works</h5>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Click a sync button to request permission</li>
          <li>• Each request must be manually approved</li>
          <li>• This prevents excessive API calls to Strava</li>
          <li>• Profile sync: Updates your athlete information</li>
          <li>• Activities sync: Fetches your latest activities</li>
          <li>• Full sync: Updates both profile and activities</li>
        </ul>
      </div>
    </div>
  )
}

export default ManualSyncControls