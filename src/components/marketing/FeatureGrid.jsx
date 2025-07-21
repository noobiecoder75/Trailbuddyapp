import Card from '../ui/Card'

const FeatureGrid = () => {
  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Smart Partner Matching',
      description: 'Find partners based on fitness level, activity preferences, and location. Our algorithm ensures compatible matches.',
      gradient: 'from-primary-500 to-primary-700',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Schedule Coordination',
      description: 'Coordinate rides, meetups, and activities with integrated calendar and automatic reminders.',
      gradient: 'from-secondary-500 to-secondary-700',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Verified Partners',
      description: 'Connect with trusted, verified outdoor enthusiasts. Safety and reliability you can count on.',
      gradient: 'from-green-500 to-green-700',
    },
  ]

  return (
    <section className="py-24 bg-mountain-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-mountain-900 mb-6">
            Why Choose TrailBuddy?
          </h2>
          <p className="text-xl text-mountain-600 max-w-3xl mx-auto">
            Connect with like-minded outdoor enthusiasts through our smart matching system and reliable coordination tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center h-full">
              <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-display font-bold text-mountain-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-mountain-600 leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeatureGrid;