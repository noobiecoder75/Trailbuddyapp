import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

const About = () => {
  return (
    <div className="min-h-screen bg-mountain-50 pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-mountain-900 opacity-10"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
            About TrailBuddy
          </h1>
          <p className="text-xl md:text-2xl text-white opacity-90 max-w-3xl mx-auto leading-relaxed">
            We're solving British Columbia's outdoor partnership problem, one adventure at a time.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-display font-bold text-mountain-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-mountain-600 leading-relaxed mb-6">
                TrailBuddy exists to connect outdoor enthusiasts in British Columbia who share similar 
                fitness levels, activity preferences, and availability. We believe that the best adventures 
                happen when you have the right partner by your side.
              </p>
              <p className="text-lg text-mountain-600 leading-relaxed mb-8">
                Too many planned outdoor activities fall through due to coordination issues, mismatched 
                fitness levels, or unreliable partners. We're changing that by building a community of 
                committed outdoor enthusiasts who actually show up.
              </p>
              <Link to="/login">
                <Button size="lg">
                  Join Our Community
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </Link>
            </div>
            <div className="lg:pl-8">
              <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-3xl p-8">
                <div className="space-y-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-mountain-900">BC Focused</h3>
                      <p className="text-sm text-mountain-600">Built specifically for British Columbia's outdoor community</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-secondary-500 rounded-xl flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-mountain-900">Reliable Partners</h3>
                      <p className="text-sm text-mountain-600">Verified community members who actually show up</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-mountain-900">Fair Pricing</h3>
                      <p className="text-sm text-mountain-600">Pay only when activities happen - no monthly fees</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-20 bg-mountain-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-display font-bold text-mountain-900 mb-8">
            The Problem We're Solving
          </h2>
          <p className="text-xl text-mountain-600 leading-relaxed mb-12">
            Young people in British Columbia want to be more active outdoors, but they often 
            struggle with two key challenges that prevent them from getting outside.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="text-left">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-mountain-900 mb-4">
                Finding Compatible Partners
              </h3>
              <p className="text-mountain-600 leading-relaxed">
                It's difficult to find reliable adventure partners who match your fitness level, 
                activity preferences, and commitment level. Most people end up going solo or 
                missing out entirely.
              </p>
            </Card>
            
            <Card className="text-left">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-mountain-900 mb-4">
                Coordination Challenges
              </h3>
              <p className="text-mountain-600 leading-relaxed">
                Even when you find potential partners, coordinating schedules, transportation, 
                and meetup details is frustrating. Too many planned adventures fall through 
                at the last minute.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-display font-bold text-mountain-900 mb-8">
            Our Solution
          </h2>
          <p className="text-xl text-mountain-600 leading-relaxed mb-12">
            TrailBuddy makes it easy to find the right adventure buddy based on pace, 
            availability, and shared interests—so you can skip the flake-outs and finally get outside.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-mountain-900 mb-4">Smart Matching</h3>
              <p className="text-mountain-600">
                Our algorithm connects you with compatible partners based on fitness level, 
                activity preferences, and availability.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-mountain-900 mb-4">Easy Coordination</h3>
              <p className="text-mountain-600">
                Built-in tools for planning activities, coordinating rides, and sending 
                reminders keep everyone on track.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-mountain-900 mb-4">Reliable Community</h3>
              <p className="text-mountain-600">
                Verification system and community standards ensure you connect with 
                committed outdoor enthusiasts.
              </p>
            </div>
          </div>
          
          <Link to="/features">
            <Button size="lg" variant="secondary">
              Explore All Features
            </Button>
          </Link>
        </div>
      </section>

      {/* Team/Vision */}
      <section className="py-20 bg-mountain-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-display font-bold mb-8">
            Built for BC Outdoor Enthusiasts
          </h2>
          <p className="text-xl text-mountain-300 leading-relaxed mb-8">
            We understand the unique challenges of outdoor activities in British Columbia. 
            From the coastal trails to mountain peaks, we're building a platform that 
            respects the adventure spirit while solving real coordination problems.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div>
              <div className="text-3xl font-bold text-primary-400 mb-2">500+</div>
              <div className="text-mountain-300">Active Members</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-400 mb-2">1,200+</div>
              <div className="text-mountain-300">Adventures Coordinated</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-400 mb-2">98%</div>
              <div className="text-mountain-300">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold text-white mb-6">
            Ready to Join Our Community?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Start finding reliable adventure partners in BC today.
          </p>
          <Link to="/login">
            <Button size="xl" variant="secondary">
              Get Started Free
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

export default About