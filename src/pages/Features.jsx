import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import FeatureGrid from '../components/marketing/FeatureGrid'
import PricingTable from '../components/marketing/PricingTable'

const Features = () => {
  return (
    <div className="min-h-screen bg-mountain-50 pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-mountain-900 opacity-10"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
            Features That Get You
            <span className="block text-secondary-400">Outside Together</span>
          </h1>
          <p className="text-xl md:text-2xl text-white opacity-90 max-w-3xl mx-auto leading-relaxed">
            Everything you need to find reliable adventure partners and coordinate 
            amazing outdoor experiences in British Columbia.
          </p>
        </div>
      </section>

      {/* Main Features Grid */}
      <FeatureGrid />

      {/* Detailed Feature Breakdown */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-mountain-900 mb-6">
              How TrailBuddy Works
            </h2>
            <p className="text-xl text-mountain-600 max-w-3xl mx-auto">
              From matching to meetup, we've designed every feature to solve the real 
              problems outdoor enthusiasts face when trying to coordinate adventures.
            </p>
          </div>

          {/* Feature Details */}
          <div className="space-y-20">
            {/* Smart Matching */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-display font-bold text-mountain-900 mb-4">
                  Smart Partner Matching
                </h3>
                <p className="text-lg text-mountain-600 leading-relaxed mb-6">
                  Our algorithm analyzes your Strava activities, fitness level, preferred activities, 
                  and availability to connect you with compatible adventure partners.
                </p>
                <ul className="space-y-3 text-mountain-600">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-primary-500 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Fitness level compatibility based on Strava data
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-primary-500 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Activity preferences and experience levels
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-primary-500 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Geographic proximity and availability matching
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-primary-500 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Personality and communication style compatibility
                  </li>
                </ul>
              </div>
              <div className="lg:pl-8">
                <Card className="bg-gradient-to-br from-primary-50 to-blue-50 border-0">
                  <div className="text-center p-8">
                    <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-semibold text-mountain-900 mb-4">
                      Match Example
                    </h4>
                    <p className="text-mountain-600 mb-4">
                      "Sarah runs 5K in 25 minutes and loves weekend trail runs. 
                      We matched her with Mike, who has similar pace and prefers morning runs."
                    </p>
                    <div className="bg-white rounded-xl p-4">
                      <div className="text-sm text-primary-600 font-semibold">98% Compatibility</div>
                      <div className="text-xs text-mountain-500 mt-1">Based on pace, location & preferences</div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Activity Coordination */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="lg:order-2">
                <div className="w-16 h-16 bg-secondary-500 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-display font-bold text-mountain-900 mb-4">
                  Easy Activity Coordination
                </h3>
                <p className="text-lg text-mountain-600 leading-relaxed mb-6">
                  Stop playing endless text message tag. Our coordination tools make it simple 
                  to plan activities, arrange transportation, and ensure everyone shows up.
                </p>
                <ul className="space-y-3 text-mountain-600">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-secondary-500 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Integrated calendar and scheduling
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-secondary-500 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Automatic ride coordination and carpooling
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-secondary-500 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Smart reminders and confirmations
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-secondary-500 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Weather alerts and plan adjustments
                  </li>
                </ul>
              </div>
              <div className="lg:order-1 lg:pr-8">
                <Card className="bg-gradient-to-br from-secondary-50 to-yellow-50 border-0">
                  <div className="p-8">
                    <div className="space-y-4">
                      <div className="bg-white rounded-xl p-4 shadow-soft">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-mountain-900">Saturday Trail Run</span>
                          <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">Confirmed</span>
                        </div>
                        <div className="text-sm text-mountain-600">
                          <div>📍 Lynn Canyon Park</div>
                          <div>🕐 8:00 AM - 10:00 AM</div>
                          <div>🚗 Carpool from Downtown</div>
                        </div>
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow-soft">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-mountain-900">Participants (3)</span>
                          <div className="flex -space-x-2">
                            <div className="w-6 h-6 bg-primary-500 rounded-full"></div>
                            <div className="w-6 h-6 bg-secondary-500 rounded-full"></div>
                            <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                          </div>
                        </div>
                        <div className="text-xs text-mountain-500">All confirmed • Reminders sent</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Safety & Trust */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-display font-bold text-mountain-900 mb-4">
                  Safety & Verification
                </h3>
                <p className="text-lg text-mountain-600 leading-relaxed mb-6">
                  Connect with confidence. Our verification system and community standards 
                  ensure you're meeting reliable, committed outdoor enthusiasts.
                </p>
                <ul className="space-y-3 text-mountain-600">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Strava account verification required
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Community rating and review system
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Report system for inappropriate behavior
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Emergency contact and location sharing
                  </li>
                </ul>
              </div>
              <div className="lg:pl-8">
                <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-0">
                  <div className="p-8">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                        </svg>
                      </div>
                      <h4 className="text-xl font-semibold text-mountain-900 mb-2">Verified Member</h4>
                      <div className="text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full inline-block">
                        ✓ Strava Connected
                      </div>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-mountain-600">Community Rating</span>
                        <div className="flex items-center">
                          <span className="text-yellow-500">★★★★★</span>
                          <span className="text-mountain-500 ml-1">(4.9)</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-mountain-600">Activities Completed</span>
                        <span className="font-semibold text-mountain-900">47</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-mountain-600">Show-up Rate</span>
                        <span className="font-semibold text-green-600">98%</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-20 bg-mountain-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-mountain-900 mb-6">
              Additional Features
            </h2>
            <p className="text-xl text-mountain-600 max-w-3xl mx-auto">
              We've thought of everything to make your outdoor adventures seamless and enjoyable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card hover className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-mountain-900 mb-2">Activity Tracking</h3>
              <p className="text-mountain-600 text-sm">Integrated with Strava to showcase your progress and achievements</p>
            </Card>

            <Card hover className="text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-mountain-900 mb-2">In-App Messaging</h3>
              <p className="text-mountain-600 text-sm">Communicate safely with potential partners before meetups</p>
            </Card>

            <Card hover className="text-center">
              <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-mountain-900 mb-2">Weather Integration</h3>
              <p className="text-mountain-600 text-sm">Real-time weather updates and activity recommendations</p>
            </Card>

            <Card hover className="text-center">
              <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-mountain-900 mb-2">Trail Discovery</h3>
              <p className="text-mountain-600 text-sm">Find new trails and outdoor spots recommended by locals</p>
            </Card>

            <Card hover className="text-center">
              <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-mountain-900 mb-2">Group Activities</h3>
              <p className="text-mountain-600 text-sm">Join larger group adventures and community events</p>
            </Card>

            <Card hover className="text-center">
              <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-mountain-900 mb-2">Gear Sharing</h3>
              <p className="text-mountain-600 text-sm">Connect with local gear rental partners and equipment sharing</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <PricingTable />

      {/* CTA */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold text-white mb-6">
            Ready to Experience All These Features?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join hundreds of outdoor enthusiasts who are already using TrailBuddy to explore BC together.
          </p>
          <Link to="/login">
            <Button size="xl" variant="secondary">
              Start Your Free Account
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Features