const FinalCTASection = ({ onSignUpClick, onStravaClick }) => {
  return (
    <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to meet your next trail buddy?
        </h2>
        <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
          Join the community of outdoor enthusiasts who never adventure alone
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
          <button
            onClick={onSignUpClick}
            className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Sign Up Free
          </button>
          <button
            onClick={onStravaClick}
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center"
          >
            <svg className="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066l-2.084 4.116zm-7.008-5.599l2.836 5.599h3.065L9.129 6.772L4.228 17.944h3.065l.998-1.969H8.379z"/>
            </svg>
            Connect Your Strava
          </button>
        </div>
        
        <p className="text-sm text-green-100">
          Free to join. No commitment.
        </p>
      </div>
    </section>
  )
}

export default FinalCTASection