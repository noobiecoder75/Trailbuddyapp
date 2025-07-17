import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { getStravaAuthUrl } from '../lib/stravaApi'

import Header from '../components/landing/Header'
import HeroSection from '../components/landing/HeroSection'
import HowItWorksSection from '../components/landing/HowItWorksSection'
import AppPreviewSection from '../components/landing/AppPreviewSection'
import TrustSafetySection from '../components/landing/TrustSafetySection'
import TestimonialsSection from '../components/landing/TestimonialsSection'
import FinalCTASection from '../components/landing/FinalCTASection'
import AuthModal from '../components/landing/AuthModal'

const LandingPage = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const { user } = useAuth()
  const navigate = useNavigate()

  // Redirect to dashboard if already logged in
  if (user) {
    navigate('/dashboard')
    return null
  }

  const handleSignInClick = () => {
    setAuthMode('login')
    setAuthModalOpen(true)
  }

  const handleSignUpClick = () => {
    setAuthMode('signup')
    setAuthModalOpen(true)
  }

  const handleStravaClick = () => {
    // Always show signup modal first for Strava connection
    setAuthMode('signup')
    setAuthModalOpen(true)
  }

  const handleModalClose = () => {
    setAuthModalOpen(false)
  }

  return (
    <div className="min-h-screen">
      <Header onSignInClick={handleSignInClick} onSignUpClick={handleSignUpClick} />
      
      <HeroSection onSignUpClick={handleSignUpClick} onStravaClick={handleStravaClick} />
      
      <HowItWorksSection />
      
      <AppPreviewSection />
      
      <TrustSafetySection />
      
      <TestimonialsSection />
      
      <FinalCTASection onSignUpClick={handleSignUpClick} onStravaClick={handleStravaClick} />
      
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={handleModalClose}
        initialMode={authMode}
      />
    </div>
  )
}

export default LandingPage