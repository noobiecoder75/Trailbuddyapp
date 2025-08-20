import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-mountain-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="font-display font-bold text-xl">TrailBuddy</span>
            </div>
            <p className="text-mountain-300 max-w-md">
              Connecting outdoor enthusiasts in British Columbia. Find reliable adventure partners who match your fitness level and activity style.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-mountain-400 hover:text-primary-400 transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-mountain-400 hover:text-primary-400 transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.316-1.296C4.343 14.928 3.5 13.718 3.5 12.321c0-1.297.49-2.448 1.296-3.316C5.56 8.241 6.77 7.398 8.167 7.398c1.297 0 2.448.49 3.316 1.296.764.764 1.607 1.974 1.607 3.371 0 1.297-.49 2.448-1.296 3.316-.764.764-1.974 1.607-3.371 1.607zM16.988 8.167c-.764 0-1.386-.622-1.386-1.386s.622-1.386 1.386-1.386 1.386.622 1.386 1.386-.622 1.386-1.386 1.386z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-mountain-400 hover:text-primary-400 transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Product
            </h3>
            <ul className="space-y-3">
              <li><Link to="/features" className="text-mountain-300 hover:text-primary-400 transition-colors">Features</Link></li>
              <li><Link to="/find-partners" className="text-mountain-300 hover:text-primary-400 transition-colors">Find Partners</Link></li>
              <li><Link to="/plan-activity" className="text-mountain-300 hover:text-primary-400 transition-colors">Plan Activities</Link></li>
              <li><Link to="/dashboard" className="text-mountain-300 hover:text-primary-400 transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-mountain-300 hover:text-primary-400 transition-colors">About</Link></li>
              <li><Link to="/terms" className="text-mountain-300 hover:text-primary-400 transition-colors">Privacy & Terms</Link></li>
              <li><a href="mailto:support@trailbuddy.ca" className="text-mountain-300 hover:text-primary-400 transition-colors">Support</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-mountain-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-mountain-400 text-sm">
            © 2024 TrailBuddy. All rights reserved.
          </p>
          <p className="text-mountain-400 text-sm mt-4 md:mt-0">
            Made with ❤️ for BC outdoor enthusiasts
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer