const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-soft p-8 lg:p-12">
          <h1 className="text-4xl font-display font-bold text-mountain-900 mb-8">
            Terms of Service & Privacy Policy
          </h1>
          
          <div className="prose prose-lg max-w-none text-mountain-700">
            <p className="text-xl text-mountain-600 mb-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-mountain-900 mb-6">1. Service Overview</h2>
              <p>
                TrailBuddy ("we," "our," or "us") provides a platform that connects outdoor enthusiasts 
                in British Columbia for safe and reliable adventure partnerships. Our service integrates 
                with Strava to enhance your outdoor experience while maintaining strict privacy and 
                data protection standards.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-mountain-900 mb-6">2. Strava Integration & Data Handling</h2>
              
              <h3 className="text-xl font-semibold text-mountain-800 mb-4">2.1 Strava API Compliance</h3>
              <p className="mb-4">
                TrailBuddy uses the Strava API under license and complies with all Strava API Agreement requirements. 
                By using our service, you acknowledge that:
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>Your Strava data will only be displayed to you personally</li>
                <li>We do not share your Strava activity data with other users or third parties</li>
                <li>We comply with Strava's November 2024 privacy standards</li>
                <li>Your data will not be used for AI training or model development</li>
              </ul>

              <h3 className="text-xl font-semibold text-mountain-800 mb-4">2.2 Data Collection & Use</h3>
              <p className="mb-4">When you connect your Strava account, we collect:</p>
              <ul className="list-disc pl-6 mb-6">
                <li>Basic profile information (name, profile picture)</li>
                <li>Activity data (routes, timing, performance metrics)</li>
                <li>Location data for activity matching purposes</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-mountain-800 mb-4">2.3 Data Retention & Security</h3>
              <ul className="list-disc pl-6 mb-6">
                <li>We store Strava data for a maximum of 7 days</li>
                <li>All data transmission is encrypted using industry-standard protocols</li>
                <li>We implement commercially reasonable security measures to protect your data</li>
                <li>We will notify Strava and affected users within 24 hours of any security breach</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-mountain-900 mb-6">3. User Rights & Consent</h2>
              
              <h3 className="text-xl font-semibold text-mountain-800 mb-4">3.1 Your Rights</h3>
              <p className="mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 mb-6">
                <li>Withdraw consent for data collection at any time</li>
                <li>Request immediate deletion of your data</li>
                <li>Know what data we collect and how it's used</li>
                <li>Disconnect your Strava account at any time</li>
              </ul>

              <h3 className="text-xl font-semibold text-mountain-800 mb-4">3.2 Data Deletion</h3>
              <p className="mb-4">
                To request data deletion or withdraw consent, contact us at support@trailbuddy.ca. 
                We will process your request within 48 hours and permanently delete your data 
                from our systems.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-mountain-900 mb-6">4. Service Terms</h2>
              
              <h3 className="text-xl font-semibold text-mountain-800 mb-4">4.1 Acceptable Use</h3>
              <p className="mb-4">You agree to:</p>
              <ul className="list-disc pl-6 mb-6">
                <li>Use the service for legitimate outdoor activity partnerships</li>
                <li>Provide accurate information about your outdoor experience and capabilities</li>
                <li>Respect other users and maintain safety standards</li>
                <li>Not use the service for commercial purposes without authorization</li>
              </ul>

              <h3 className="text-xl font-semibold text-mountain-800 mb-4">4.2 Safety & Liability</h3>
              <p className="mb-4">
                TrailBuddy is a platform for connecting outdoor enthusiasts. Users are responsible for:
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>Their own safety and the safety of their adventure partners</li>
                <li>Verifying the credentials and experience of potential partners</li>
                <li>Following all applicable outdoor safety guidelines and regulations</li>
                <li>Having appropriate insurance and emergency preparedness</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-mountain-900 mb-6">5. Disclaimers & Limitations</h2>
              
              <h3 className="text-xl font-semibold text-mountain-800 mb-4">5.1 Service Disclaimers</h3>
              <p className="mb-4">
                TrailBuddy provides the service "as is" and "as available." We exclude third-party 
                service providers (including Strava) from all liability for consequential, special, 
                punitive, or indirect damages.
              </p>
              
              <h3 className="text-xl font-semibold text-mountain-800 mb-4">5.2 Outdoor Activity Risks</h3>
              <p className="mb-4">
                Outdoor activities carry inherent risks. By using TrailBuddy, you acknowledge that:
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>You participate in activities at your own risk</li>
                <li>TrailBuddy does not guarantee the safety, reliability, or qualifications of users</li>
                <li>We are not responsible for accidents, injuries, or damages occurring during activities</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-mountain-900 mb-6">6. Privacy & Compliance</h2>
              <p className="mb-4">
                We comply with all applicable privacy and data protection laws, including:
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>Personal Information Protection and Electronic Documents Act (PIPEDA)</li>
                <li>British Columbia Personal Information Protection Act</li>
                <li>Applicable provincial and federal privacy legislation</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-mountain-900 mb-6">7. API Access & Revocation</h2>
              <p className="mb-4">
                We acknowledge that API access is a privilege that can be revoked by Strava at any time. 
                In the event of API access revocation, we will:
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>Immediately cease all data collection from Strava</li>
                <li>Delete all stored Strava data within 7 days</li>
                <li>Notify affected users of service limitations</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-mountain-900 mb-6">8. Support & Contact</h2>
              <p className="mb-4">
                For questions about these terms, data handling, or to exercise your rights:
              </p>
              <div className="bg-primary-50 p-6 rounded-lg">
                <p className="font-semibold text-primary-800">Email:</p>
                <p className="text-primary-700 mb-4">support@trailbuddy.ca</p>
                
                <p className="font-semibold text-primary-800">Mailing Address:</p>
                <p className="text-primary-700">
                  TrailBuddy<br/>
                  Vancouver, BC<br/>
                  Canada
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-mountain-900 mb-6">9. Changes to Terms</h2>
              <p>
                We may update these terms periodically. Users will be notified of significant changes 
                via email or through the platform. Continued use of the service after changes constitutes 
                acceptance of the updated terms.
              </p>
            </section>

            <div className="border-t border-gray-200 pt-8">
              <p className="text-sm text-mountain-500">
                These terms are designed to comply with Strava API requirements and Canadian privacy laws. 
                For the most current version of Strava's API agreement, visit{' '}
                <a href="https://www.strava.com/legal/api" className="text-primary-600 hover:text-primary-800 underline">
                  strava.com/legal/api
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Terms