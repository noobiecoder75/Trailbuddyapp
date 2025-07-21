const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "I finally found hiking partners who actually show up.",
      author: "Alex Chen",
      location: "Vancouver",
      activity: "Hiking enthusiast"
    },
    {
      quote: "Way easier than posting in Facebook groups.",
      author: "Maria Rodriguez",
      location: "Burnaby",
      activity: "Trail runner"
    },
    {
      quote: "As someone without a car, this changed the game for me.",
      author: "Jordan Kim",
      location: "Richmond",
      activity: "Mountain biker"
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Community Says
          </h2>
          <p className="text-xl text-gray-600">
            Join thousands of outdoor enthusiasts across BC
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 p-8 rounded-lg">
              <div className="mb-6">
                <svg className="w-8 h-8 text-green-500 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                </svg>
                <p className="text-lg text-gray-700 italic">
                  "{testimonial.quote}"
                </p>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                  {testimonial.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-600">{testimonial.activity} • {testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection