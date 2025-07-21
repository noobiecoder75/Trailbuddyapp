import { Link } from 'react-router-dom'
import Button from '../ui/Button'

const Hero = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-black opacity-10"></div>
      
      {/* Mountain silhouette background */}
      <div className="absolute inset-0">
        <svg className="absolute bottom-0 w-full h-1/3" viewBox="0 0 1200 300" preserveAspectRatio="none">
          <path d="M0,300 L0,180 Q300,120 600,160 Q900,100 1200,140 L1200,300 Z" 
                className="fill-primary-900 opacity-20" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-8">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Trusted by 500+ BC Adventurers
          </div>
          
          {/* Main headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6 leading-tight">
            Find Your Perfect
            <span className="block text-secondary-300 mt-2">Adventure Partner</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-primary-100 mb-12 leading-relaxed max-w-3xl mx-auto">
            Connect with outdoor enthusiasts in British Columbia who match your fitness level and activity style.
          </p>

          {/* Primary CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/login">
              <Button 
                size="xl" 
                variant="secondary"
                className="px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-secondary-500/25"
              >
                Get Started Free
                <svg className="ml-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </Link>
            <Link to="/features">
              <Button 
                size="xl" 
                variant="outline"
                className="px-8 py-4 text-lg font-semibold border-white text-white hover:bg-white hover:text-primary-700"
              >
                Learn More
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">500+</div>
              <div className="text-primary-200 text-sm">Active Members</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">98%</div>
              <div className="text-primary-200 text-sm">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">4.9★</div>
              <div className="text-primary-200 text-sm">User Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave transition */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg className="w-full h-24" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,40 C300,80 900,0 1200,40 L1200,120 L0,120 Z" className="fill-white"></path>
        </svg>
      </div>
    </div>
  )
}

export default Hero;