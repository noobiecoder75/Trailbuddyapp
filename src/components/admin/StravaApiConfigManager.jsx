import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { clearUserApiConfigCache } from '../../lib/stravaApiEnhanced'
import {
  Plus,
  Edit,
  Trash2,
  Users,
  Key,
  BarChart3,
  Save,
  X,
  AlertTriangle,
  CheckCircle,
  Settings
} from 'lucide-react'

const StravaApiConfigManager = () => {
  const { user } = useAuth()
  const [configs, setConfigs] = useState([])
  const [assignments, setAssignments] = useState([])
  const [rateLimits, setRateLimits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingConfig, setEditingConfig] = useState(null)
  const [newConfig, setNewConfig] = useState({
    name: '',
    client_id: '',
    client_secret: '',
    daily_limit: 1000,
    fifteen_min_limit: 100,
    is_active: true
  })

  // Check if user is admin (you'll need to implement this check)
  const isAdmin = true // TODO: Implement proper admin check

  useEffect(() => {
    if (user && isAdmin) {
      loadData()
    }
  }, [user, isAdmin])

  const loadData = async () => {
    setLoading(true)
    try {
      await Promise.all([
        loadConfigs(),
        loadAssignments(),
        loadRateLimits()
      ])
    } catch (error) {
      setError('Failed to load data: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const loadConfigs = async () => {
    const { data, error } = await supabase
      .from('strava_api_configs')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    setConfigs(data || [])
  }

  const loadAssignments = async () => {
    const { data, error } = await supabase
      .from('user_strava_config_assignments')
      .select(`
        *,
        strava_api_configs(name),
        user_profiles(display_name)
      `)

    if (error) throw error
    setAssignments(data || [])
  }

  const loadRateLimits = async () => {
    const { data, error } = await supabase
      .from('strava_rate_limits')
      .select(`
        *,
        strava_api_configs(name)
      `)

    if (error) throw error
    setRateLimits(data || [])
  }

  const handleSaveConfig = async () => {
    setError(null)
    setSuccess(null)

    try {
      if (editingConfig) {
        // Update existing config
        const { error } = await supabase
          .from('strava_api_configs')
          .update(newConfig)
          .eq('id', editingConfig.id)

        if (error) throw error
        setSuccess('Configuration updated successfully')
      } else {
        // Create new config
        const { error } = await supabase
          .from('strava_api_configs')
          .insert(newConfig)

        if (error) throw error
        setSuccess('Configuration created successfully')
      }

      // Clear cache and reload data
      clearUserApiConfigCache()
      await loadData()
      setShowAddModal(false)
      setEditingConfig(null)
      setNewConfig({
        name: '',
        client_id: '',
        client_secret: '',
        daily_limit: 1000,
        fifteen_min_limit: 100,
        is_active: true
      })
    } catch (error) {
      setError(error.message)
    }
  }

  const handleDeleteConfig = async (configId) => {
    if (!confirm('Are you sure you want to delete this configuration? This will affect all assigned users.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('strava_api_configs')
        .delete()
        .eq('id', configId)

      if (error) throw error

      setSuccess('Configuration deleted successfully')
      clearUserApiConfigCache()
      await loadData()
    } catch (error) {
      setError(error.message)
    }
  }

  const handleEditConfig = (config) => {
    setNewConfig({
      name: config.name,
      client_id: config.client_id,
      client_secret: config.client_secret,
      daily_limit: config.daily_limit,
      fifteen_min_limit: config.fifteen_min_limit,
      is_active: config.is_active
    })
    setEditingConfig(config)
    setShowAddModal(true)
  }

  const handleAssignUser = async (userId, configId) => {
    try {
      const { error } = await supabase
        .from('user_strava_config_assignments')
        .upsert({
          user_id: userId,
          strava_config_id: configId
        })

      if (error) throw error

      setSuccess('User assignment updated')
      clearUserApiConfigCache(userId)
      await loadAssignments()
    } catch (error) {
      setError(error.message)
    }
  }

  const getRateLimitForConfig = (configId) => {
    return rateLimits.find(rl => rl.strava_config_id === configId)
  }

  const formatPercentage = (used, total) => {
    const percentage = (used / total) * 100
    return Math.round(percentage)
  }

  const getRateLimitColor = (used, total) => {
    const percentage = (used / total) * 100
    if (percentage >= 90) return 'text-red-600 bg-red-100'
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-green-600 bg-green-100'
  }

  if (!isAdmin) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
          <p className="text-red-700">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Settings className="w-6 h-6 text-blue-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">Strava API Configuration Manager</h2>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Configuration
        </button>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            <p className="text-green-700">{success}</p>
          </div>
        </div>
      )}

      {/* API Configurations */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">API Configurations</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rate Limits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {configs.map((config) => {
                const rateLimit = getRateLimitForConfig(config.id)
                const assignedUsers = assignments.filter(a => a.strava_config_id === config.id).length

                return (
                  <tr key={config.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Key className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">{config.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{config.client_id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        <div>Daily: {config.daily_limit}</div>
                        <div>15min: {config.fifteen_min_limit}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {rateLimit ? (
                        <div className="text-sm">
                          <div className={`inline-flex px-2 py-1 rounded-full text-xs ${getRateLimitColor(rateLimit.daily_requests, config.daily_limit)}`}>
                            Daily: {rateLimit.daily_requests}/{config.daily_limit} ({formatPercentage(rateLimit.daily_requests, config.daily_limit)}%)
                          </div>
                          <div className={`inline-flex px-2 py-1 rounded-full text-xs mt-1 ${getRateLimitColor(rateLimit.fifteen_min_requests, config.fifteen_min_limit)}`}>
                            15min: {rateLimit.fifteen_min_requests}/{config.fifteen_min_limit} ({formatPercentage(rateLimit.fifteen_min_requests, config.fifteen_min_limit)}%)
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">No usage</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          config.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {config.is_active ? 'Active' : 'Inactive'}
                        </span>
                        <div className="flex items-center ml-2 text-sm text-gray-500">
                          <Users className="w-4 h-4 mr-1" />
                          {assignedUsers}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditConfig(config)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteConfig(config.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingConfig ? 'Edit Configuration' : 'Add Configuration'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setEditingConfig(null)
                  setNewConfig({
                    name: '',
                    client_id: '',
                    client_secret: '',
                    daily_limit: 1000,
                    fifteen_min_limit: 100,
                    is_active: true
                  })
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Configuration Name
                </label>
                <input
                  type="text"
                  value={newConfig.name}
                  onChange={(e) => setNewConfig({ ...newConfig, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., user1_config"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client ID
                </label>
                <input
                  type="text"
                  value={newConfig.client_id}
                  onChange={(e) => setNewConfig({ ...newConfig, client_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Strava Client ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Secret
                </label>
                <input
                  type="password"
                  value={newConfig.client_secret}
                  onChange={(e) => setNewConfig({ ...newConfig, client_secret: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Strava Client Secret"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Daily Limit
                  </label>
                  <input
                    type="number"
                    value={newConfig.daily_limit}
                    onChange={(e) => setNewConfig({ ...newConfig, daily_limit: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    15min Limit
                  </label>
                  <input
                    type="number"
                    value={newConfig.fifteen_min_limit}
                    onChange={(e) => setNewConfig({ ...newConfig, fifteen_min_limit: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={newConfig.is_active}
                  onChange={(e) => setNewConfig({ ...newConfig, is_active: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                  Active
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setEditingConfig(null)
                }}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveConfig}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingConfig ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StravaApiConfigManager