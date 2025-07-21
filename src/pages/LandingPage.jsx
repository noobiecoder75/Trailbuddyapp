import Hero from '../components/marketing/Hero'
import FeatureGrid from '../components/marketing/FeatureGrid'
import HowItWorksSection from '../components/sections/HowItWorksSection'
import SuccessStoriesSection from '../components/sections/SuccessStoriesSection'
import PricingTable from '../components/marketing/PricingTable'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Feature Grid */}
      <FeatureGrid />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Success Stories Section */}
      <SuccessStoriesSection />

      {/* Pricing Section */}
      <PricingTable />

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-8 leading-tight">
            Your Next Adventure 
            <span className="block text-secondary-300">Starts Here</span>
          </h2>
          <p className="text-xl text-primary-100 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join hundreds of outdoor enthusiasts in BC who are already using TrailBuddy to explore together safely and reliably.
          </p>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="flex items-center justify-center space-x-3 text-primary-100">
              <svg className="w-5 h-5 text-secondary-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Free to start</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-primary-100">
              <svg className="w-5 h-5 text-secondary-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Verified members</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-primary-100">
              <svg className="w-5 h-5 text-secondary-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">BC focused</span>
            </div>
          </div>

          {/* Main CTA Buttons */}
          <div className="mb-12 space-y-4">
            <Link to="/login">
              <Button 
                size="xl" 
                variant="secondary" 
                className="px-12 py-4 text-lg font-semibold group hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-secondary-500/25"
              >
                Start Your Adventure Today
                <svg className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </Link>
            
            <div className="flex items-center justify-center">
              <span className="text-primary-200 text-sm mr-4">or</span>
              <Link to="/dashboard?demo=true">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="px-8 py-3 text-base font-medium border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300"
                >
                  Try Demo
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </Button>
              </Link>
            </div>
          </div>

          {/* Social proof */}
          <div className="border-t border-white border-opacity-20 pt-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="group">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-secondary-300 transition-colors">
                  500+
                </div>
                <div className="text-primary-200 text-sm uppercase tracking-wide">
                  Active Members
                </div>
              </div>
              <div className="group">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-secondary-300 transition-colors">
                  1,200+
                </div>
                <div className="text-primary-200 text-sm uppercase tracking-wide">
                  Adventures Completed
                </div>
              </div>
              <div className="group">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-secondary-300 transition-colors">
                  4.9★
                </div>
                <div className="text-primary-200 text-sm uppercase tracking-wide">
                  Average Rating
                </div>
              </div>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 text-center">
            <p className="text-primary-200 text-sm mb-4">
              Trusted by outdoor enthusiasts across British Columbia
            </p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="text-xs text-primary-300 font-medium">Vancouver</div>
              <div className="w-1 h-1 bg-primary-300 rounded-full"></div>
              <div className="text-xs text-primary-300 font-medium">Whistler</div>
              <div className="w-1 h-1 bg-primary-300 rounded-full"></div>
              <div className="text-xs text-primary-300 font-medium">Victoria</div>
              <div className="w-1 h-1 bg-primary-300 rounded-full"></div>
              <div className="text-xs text-primary-300 font-medium">Kelowna</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage