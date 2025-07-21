import Card from '../ui/Card'

const SuccessStoriesSection = () => {
  return (
    <section className="py-24 bg-mountain-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-mountain-900 mb-6">
            Real Adventures, Real Stories
          </h2>
          <p className="text-xl text-mountain-600 max-w-3xl mx-auto">
            See how TrailBuddy is helping outdoor enthusiasts across BC find their perfect adventure partners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Story 1 */}
          <Card className="h-full">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white font-bold">
                SC
              </div>
              <div>
                <h3 className="font-bold text-mountain-900">Sarah Chen</h3>
                <p className="text-sm text-mountain-600">Vancouver Runner</p>
              </div>
            </div>
            <blockquote className="text-mountain-700 italic mb-6">
              "I found Mike through TrailBuddy and we've been running partners for 6 months now. No more cancelled plans or mismatched paces!"
            </blockquote>
            <div className="border-t pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-mountain-500">Activities together:</span>
                <span className="font-semibold text-mountain-900">23</span>
              </div>
            </div>
          </Card>
          
          {/* Story 2 */}
          <Card className="h-full">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-700 rounded-full flex items-center justify-center text-white font-bold">
                MJ
              </div>
              <div>
                <h3 className="font-bold text-mountain-900">Mike Johnson</h3>
                <p className="text-sm text-mountain-600">Mountain Biker</p>
              </div>
            </div>
            <blockquote className="text-mountain-700 italic mb-6">
              "TrailBuddy's coordination tools are amazing. We've organized group rides to Whistler with zero flake-outs."
            </blockquote>
            <div className="border-t pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-mountain-500">Group activities led:</span>
                <span className="font-semibold text-mountain-900">12</span>
              </div>
            </div>
          </Card>
          
          {/* Story 3 */}
          <Card className="h-full">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center text-white font-bold">
                ER
              </div>
              <div>
                <h3 className="font-bold text-mountain-900">Emily Rodriguez</h3>
                <p className="text-sm text-mountain-600">Hiking Enthusiast</p>
              </div>
            </div>
            <blockquote className="text-mountain-700 italic mb-6">
              "As someone new to BC, TrailBuddy helped me discover amazing trails and make lasting friendships."
            </blockquote>
            <div className="border-t pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-mountain-500">Trails discovered:</span>
                <span className="font-semibold text-mountain-900">15</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default SuccessStoriesSection;