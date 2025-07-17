import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
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
              <Route path="/" element={<LandingPage />} />
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
            </Routes>
          </div>
        </Router>
      </StravaProvider>
    </AuthProvider>
  )
}

export default App