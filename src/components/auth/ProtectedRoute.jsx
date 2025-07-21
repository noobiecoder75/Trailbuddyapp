import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useDemo } from '../../contexts/DemoContext'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  const { isDemoMode } = useDemo()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!user && !isDemoMode) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute