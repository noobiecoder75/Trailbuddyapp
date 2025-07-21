import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import StravaCallback from './pages/StravaCallback';
import PlanActivity from './pages/PlanActivity';
import FindPartners from './pages/FindPartners';
import { AuthProvider } from './contexts/AuthContext';
import { StravaProvider } from './contexts/StravaContext';
import { DemoProvider } from './contexts/DemoContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

function App() {
  return (
    <AuthProvider>
      <DemoProvider>
        <StravaProvider>
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
              {/* Placeholder routes for marketing pages */}
              <Route path="/features" element={<LandingPage />} />
              <Route path="/about" element={<LandingPage />} />
            </Routes>
          </main>
          <Footer />
          </Router>
        </StravaProvider>
      </DemoProvider>
    </AuthProvider>
  );
}

export default App;