import { Link } from 'react-router-dom'
import Button from '../ui/Button'
import Card from '../ui/Card'

const PricingTable = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-mountain-900 mb-6">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-xl text-mountain-600 max-w-3xl mx-auto">
            Join thousands of adventurers who've discovered the joy of exploring BC with the perfect trail buddy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="text-center">
            <div className="mb-6">
              <h3 className="text-2xl font-display font-bold text-mountain-900 mb-2">Free Plan</h3>
              <div className="text-4xl font-bold text-primary-600 mb-4">$0<span className="text-lg text-mountain-500 font-normal">/month</span></div>
            </div>
            <p className="text-mountain-600 mb-6">
              Get started for free and find your first adventure partner.
            </p>
            <ul className="text-left space-y-3 mb-8">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-mountain-700">Basic partner matching</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-mountain-700">5 messages per month</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-mountain-700">Basic activity planning</span>
              </li>
            </ul>
            <Link to="/login">
              <Button size="lg" className="w-full">
                Get Started Free
              </Button>
            </Link>
          </Card>

          <Card className="text-center border-2 border-primary-500 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">Most Popular</span>
            </div>
            <div className="mb-6">
              <h3 className="text-2xl font-display font-bold text-mountain-900 mb-2">Premium Plan</h3>
              <div className="text-4xl font-bold text-primary-600 mb-4">$9<span className="text-lg text-mountain-500 font-normal">/month</span></div>
            </div>
            <p className="text-mountain-600 mb-6">
              Unlock advanced features and find unlimited adventure partners.
            </p>
            <ul className="text-left space-y-3 mb-8">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-mountain-700">Advanced matching algorithm</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-mountain-700">Unlimited messaging</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-mountain-700">Group activity coordination</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-mountain-700">Priority support</span>
              </li>
            </ul>
            <Link to="/login">
              <Button variant="secondary" size="lg" className="w-full">
                Go Premium
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default PricingTable;