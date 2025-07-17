const Header = ({ onSignInClick, onSignUpClick }) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-30 bg-black/10 backdrop-blur-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white">
              🌲 TrailBuddy
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={onSignInClick}
              className="text-white hover:text-gray-200 px-4 py-2 rounded-md transition-all duration-300 border border-white/20 hover:border-white/40 backdrop-blur-sm"
            >
              Sign In
            </button>
            <button
              onClick={onSignUpClick}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header