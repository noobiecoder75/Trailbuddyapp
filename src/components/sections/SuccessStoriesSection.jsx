import Card from '../ui/Card'

const SuccessStoriesSection = () => {
  const stories = [
    {
      initials: 'SC',
      name: 'Sarah Chen',
      role: 'Vancouver Runner',
      testimonial: "I found Mike through TrailBuddy and we've been running partners for 6 months now. No more cancelled plans or mismatched paces!",
      metric: 'Activities together',
      value: '23',
      color: 'from-primary-500 to-primary-600',
    },
    {
      initials: 'MJ',
      name: 'Mike Johnson',
      role: 'Mountain Biker',
      testimonial: "TrailBuddy's coordination tools are amazing. We've organized group rides to Whistler with zero flake-outs.",
      metric: 'Group activities led',
      value: '12',
      color: 'from-secondary-500 to-secondary-600',
    },
    {
      initials: 'ER',
      name: 'Emily Rodriguez',
      role: 'Hiking Enthusiast',
      testimonial: "As someone new to BC, TrailBuddy helped me discover amazing trails and make lasting friendships.",
      metric: 'Trails discovered',
      value: '15',
      color: 'from-green-500 to-green-600',
    },
  ]

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
            Real Adventures, Real Stories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how TrailBuddy is helping outdoor enthusiasts across BC find their perfect adventure partners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <Card key={index} className="h-full hover:shadow-xl transition-all duration-300" hover={true}>
              <div className="flex items-center space-x-4 mb-6">
                <div className={`w-14 h-14 bg-gradient-to-br ${story.color} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                  {story.initials}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{story.name}</h3>
                  <p className="text-sm text-gray-600">{story.role}</p>
                </div>
              </div>
              
              <blockquote className="text-gray-700 italic mb-6 text-lg leading-relaxed">
                "{story.testimonial}"
              </blockquote>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{story.metric}:</span>
                  <span className="font-bold text-2xl text-gray-900">{story.value}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SuccessStoriesSection;