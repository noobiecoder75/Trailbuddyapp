import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import StravaCallback from './pages/StravaCallback'
import { AuthProvider } from './contexts/AuthContext'
import { StravaProvider } from './contexts/StravaContext'
import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <StravaProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/auth/strava/callback" element={
                <ProtectedRoute>
                  <StravaCallback />
                </ProtectedRoute>
              } />
              <Route path="/" element={<Login />} />
            </Routes>
          </div>
        </Router>
      </StravaProvider>
    </AuthProvider>
  )
}

export default App