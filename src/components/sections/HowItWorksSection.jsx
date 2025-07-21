import { Link } from 'react-router-dom'
import Button from '../ui/Button'
import Card from '../ui/Card'

const HowItWorksSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-mountain-900 mb-6">
            How TrailBuddy Works
          </h2>
          <p className="text-xl text-mountain-600 max-w-3xl mx-auto">
            Getting started is simple. Create your profile, find compatible partners, and start exploring BC together.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Step 1 */}
          <Card className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-white mx-auto mb-6 text-2xl font-bold shadow-lg">
              1
            </div>
            <h3 className="text-xl font-display font-bold text-mountain-900 mb-4">
              Create Your Profile
            </h3>
            <p className="text-mountain-600 leading-relaxed">
              Connect your Strava account, set your fitness level, and tell us about your favorite outdoor activities.
            </p>
          </Card>

          {/* Step 2 */}
          <Card className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-700 rounded-xl flex items-center justify-center text-white mx-auto mb-6 text-2xl font-bold shadow-lg">
              2
            </div>
            <h3 className="text-xl font-display font-bold text-mountain-900 mb-4">
              Find Compatible Partners
            </h3>
            <p className="text-mountain-600 leading-relaxed">
              Our smart matching algorithm connects you with partners who share your pace, interests, and availability.
            </p>
          </Card>

          {/* Step 3 */}
          <Card className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center text-white mx-auto mb-6 text-2xl font-bold shadow-lg">
              3
            </div>
            <h3 className="text-xl font-display font-bold text-mountain-900 mb-4">
              Plan & Adventure
            </h3>
            <p className="text-mountain-600 leading-relaxed">
              Coordinate rides, plan activities, and enjoy amazing outdoor experiences with reliable partners.
            </p>
          </Card>
        </div>

        <div className="text-center">
          <Link to="/login">
            <Button size="xl" className="px-12 py-4 text-lg">
              Start Your Adventure Journey
              <svg className="ml-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default HowItWorksSection;