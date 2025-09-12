import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import StravaCallback from './pages/StravaCallback';
import HealthCallback from './pages/HealthCallback';
import PlanActivity from './pages/PlanActivity';
import FindPartners from './pages/FindPartners';
import HealthAnalysis from './pages/HealthAnalysis';
import Terms from './pages/Terms';
import { AuthProvider } from './contexts/AuthContext';
import { HealthProvider } from './contexts/HealthContext';
import { DemoProvider } from './contexts/DemoContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

function App() {
  return (
    <AuthProvider>
      <DemoProvider>
        <HealthProvider>
          <Router>
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/auth/strava/callback"
                element={
                  <ProtectedRoute>
                    <StravaCallback />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/auth/health/callback"
                element={
                  <ProtectedRoute>
                    <HealthCallback />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/health-connect-callback"
                element={
                  <ProtectedRoute>
                    <HealthCallback />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/apple-health-callback"
                element={
                  <ProtectedRoute>
                    <HealthCallback />
                  </ProtectedRoute>
                }
              />
              {/* Feature pages requiring authentication */}
              <Route
                path="/find-partners"
                element={
                  <ProtectedRoute>
                    <FindPartners />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/plan-activity"
                element={
                  <ProtectedRoute>
                    <PlanActivity />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analysis"
                element={
                  <ProtectedRoute>
                    <HealthAnalysis />
                  </ProtectedRoute>
                }
              />
              {/* Placeholder routes for marketing pages */}
              <Route path="/features" element={<LandingPage />} />
              <Route path="/about" element={<LandingPage />} />
              <Route path="/terms" element={<Terms />} />
            </Routes>
          </main>
          <Footer />
          </Router>
        </HealthProvider>
      </DemoProvider>
    </AuthProvider>
  );
}

export default App;