import React, { useState, useEffect } from 'react'
import { X, CheckCircle, Smartphone, Download, Shield, Play } from 'lucide-react'
import { appleHealthApi } from '../../lib/appleHealthApi'

const AppleHealthSetup = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [isInstalling, setIsInstalling] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [setupStatus, setSetupStatus] = useState({
    shortcutInstalled: false,
    permissionsGranted: false,
    connectionTested: false
  })
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isOpen) {
      checkSetupStatus()
    }
  }, [isOpen])

  const checkSetupStatus = async () => {
    try {
      const status = await appleHealthApi.checkSetupStatus()
      setSetupStatus(status)
      
      // Skip to appropriate step based on status
      if (status.shortcutInstalled && !status.connectionTested) {
        setCurrentStep(4)
      } else if (status.shortcutInstalled && status.permissionsGranted) {
        setCurrentStep(4)
      }
    } catch (error) {
      console.error('Error checking setup status:', error)
    }
  }

  const handleInstallShortcut = async () => {
    setIsInstalling(true)
    setError(null)
    
    try {
      // Create the shortcut installation URL
      const shortcutUrl = appleHealthApi.getShortcutInstallUrl()
      
      // Track that user initiated installation
      localStorage.setItem('apple_health_install_initiated', Date.now().toString())
      
      // Open the shortcut installation link
      window.open(shortcutUrl, '_blank')
      
      // Wait a bit then check if they returned
      setTimeout(() => {
        setIsInstalling(false)
        setSetupStatus(prev => ({ ...prev, shortcutInstalled: true }))
        setCurrentStep(3)
      }, 3000)
      
    } catch (error) {
      setError('Failed to open shortcut installation. Please try again.')
      setIsInstalling(false)
    }
  }

  const handleTestConnection = async () => {
    setIsTesting(true)
    setError(null)
    
    try {
      const result = await appleHealthApi.testShortcutConnection()
      
      if (result.success) {
        setSetupStatus(prev => ({ ...prev, connectionTested: true }))
        setTimeout(() => {
          onComplete(result)
        }, 1500)
      } else {
        setError(result.error || 'Connection test failed. Please ensure the shortcut is installed correctly.')
      }
    } catch (error) {
      setError('Failed to test connection. Please make sure the shortcut is installed.')
    } finally {
      setIsTesting(false)
    }
  }

  const handleSkipSetup = () => {
    // Allow users to skip and try connecting anyway
    onComplete({ skipSetup: true })
  }

  if (!isOpen) return null

  const steps = [
    {
      number: 1,
      title: 'Welcome',
      icon: <Smartphone className="w-8 h-8" />,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Connect Apple Health to TrailBuddy</h3>
          <p className="text-gray-600">
            To sync your health data from Apple Health, we need to set up a secure connection 
            using iOS Shortcuts. This is a one-time setup that takes about 2 minutes.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Why Shortcuts?</strong> Web apps can't directly access HealthKit data 
              for privacy reasons. Shortcuts acts as a secure bridge to share your data.
            </p>
          </div>
          <div className="flex justify-between pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={() => setCurrentStep(2)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Get Started
            </button>
          </div>
        </div>
      )
    },
    {
      number: 2,
      title: 'Install Shortcut',
      icon: <Download className="w-8 h-8" />,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Install TrailBuddy Health Shortcut</h3>
          <p className="text-gray-600">
            Click the button below to add the TrailBuddy shortcut to your iPhone. 
            This will open the Shortcuts app where you can review and add it.
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> You'll be redirected to the Shortcuts app. 
              After adding the shortcut, return to this page to continue.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            onClick={handleInstallShortcut}
            disabled={isInstalling}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isInstalling ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Opening Shortcuts...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Install TrailBuddy Shortcut
              </>
            )}
          </button>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Back
            </button>
            <button
              onClick={() => {
                setSetupStatus(prev => ({ ...prev, shortcutInstalled: true }))
                setCurrentStep(3)
              }}
              className="px-4 py-2 text-blue-600 hover:text-blue-800"
            >
              I've installed it
            </button>
          </div>
        </div>
      )
    },
    {
      number: 3,
      title: 'Grant Permissions',
      icon: <Shield className="w-8 h-8" />,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Grant Health Data Permissions</h3>
          <p className="text-gray-600">
            When you run the shortcut for the first time, iOS will ask for permission 
            to access your health data. Please allow access to:
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Workouts & Activities</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Steps & Distance</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Heart Rate</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Active Calories</span>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Privacy:</strong> Your health data is encrypted and only shared 
              with TrailBuddy. We never sell or share your personal health information.
            </p>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Back
            </button>
            <button
              onClick={() => {
                setSetupStatus(prev => ({ ...prev, permissionsGranted: true }))
                setCurrentStep(4)
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Continue
            </button>
          </div>
        </div>
      )
    },
    {
      number: 4,
      title: 'Test Connection',
      icon: <Play className="w-8 h-8" />,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Test Your Connection</h3>
          <p className="text-gray-600">
            Let's make sure everything is working correctly. Click the test button below 
            to verify the connection to Apple Health.
          </p>

          {setupStatus.connectionTested && (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-green-800 font-medium">Connection successful!</p>
              </div>
              <p className="text-sm text-green-700 mt-1">
                Your Apple Health data is ready to sync with TrailBuddy.
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
              <p className="text-xs text-red-500 mt-1">
                Make sure you've installed the shortcut and granted permissions.
              </p>
            </div>
          )}

          <button
            onClick={handleTestConnection}
            disabled={isTesting || setupStatus.connectionTested}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isTesting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Testing Connection...
              </>
            ) : setupStatus.connectionTested ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Connection Verified
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Test Connection
              </>
            )}
          </button>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setCurrentStep(3)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Back
            </button>
            {setupStatus.connectionTested && (
              <button
                onClick={() => onComplete({ success: true })}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Complete Setup
              </button>
            )}
          </div>

          {!setupStatus.connectionTested && (
            <div className="text-center pt-2">
              <button
                onClick={handleSkipSetup}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Skip setup and try connecting anyway
              </button>
            </div>
          )}
        </div>
      )
    }
  ]

  const currentStepData = steps[currentStep - 1]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-blue-600">
              {currentStepData.icon}
            </div>
            <div>
              <h2 className="text-xl font-semibold">Apple Health Setup</h2>
              <p className="text-sm text-gray-500">Step {currentStep} of 4</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="px-6 py-4">
          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  step <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Step content */}
          {currentStepData.content}
        </div>
      </div>
    </div>
  )
}

export default AppleHealthSetup