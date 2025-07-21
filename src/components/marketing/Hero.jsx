import { Link } from 'react-router-dom'
import Button from '../ui/Button'

const Hero = () => {
  return (
    <div className="relative min-h-screen" style={{background: 'linear-gradient(to bottom right, #16a34a, #166534)'}}>
      {/* Mountain silhouette background */}
      <div className="absolute inset-0">
        <svg className="absolute bottom-0 w-full h-64" viewBox="0 0 1200 300" preserveAspectRatio="none">
          <path d="M0,300 L0,180 Q300,120 600,160 Q900,100 1200,140 L1200,300 Z" 
                className="fill-mountain-700 opacity-30" />
        </svg>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center">
          
          {/* Main headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-8 leading-tight">
            Find Your Perfect
            <span className="block text-secondary-300">Adventure Partner</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-white opacity-90 mb-12 leading-relaxed max-w-3xl mx-auto">
            Connect with outdoor enthusiasts in British Columbia who match your fitness level and activity style.
          </p>

          {/* Primary CTA */}
          <div className="mb-16">
            <Link to="/login">
              <Button size="xl" className="text-lg px-16 py-6 shadow-xl">
                Get Started Free
                <svg className="ml-3 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-white opacity-80">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-secondary-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-lg font-medium">500+ Active Members</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-secondary-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-lg font-medium">98% Success Rate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom transition */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg className="w-full h-16" viewBox="0 0 1200 80" preserveAspectRatio="none">
          <path d="M0,0 L1200,20 L1200,80 L0,80 Z" className="fill-white"></path>
        </svg>
      </div>
    </div>
  )
}

export default Hero;