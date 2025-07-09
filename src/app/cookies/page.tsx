import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Cookie Policy</h1>
          <p className="text-gray-600 mt-2">Last updated: 7/8/2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 mb-4">
                This Cookie Policy explains how FreshBeautyTech OU ("we," "our," or "us") uses cookies and similar technologies when you visit or use our TripBudget application. This policy should be read alongside our Privacy Policy.
              </p>
              <p className="text-gray-700">
                By using our Service, you consent to the use of cookies in accordance with this policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. What Are Cookies?</h2>
              <p className="text-gray-700">
                Cookies are small text files that are stored on your device (computer, tablet, or mobile phone) when you visit a website. They help websites remember information about your visit, such as your preferred language and other settings, which can make your next visit easier and more useful.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Cookies</h2>
              <p className="text-gray-700 mb-4">We use cookies for several purposes, including:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Making our website work properly</li>
                <li>Remembering your preferences and settings</li>
                <li>Understanding how you use our Service</li>
                <li>Improving our website and user experience</li>
                <li>Providing personalized content and recommendations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Types of Cookies We Use</h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">4.1 Essential Cookies (Necessary)</h3>
                <p className="text-gray-700 mb-3">
                  These cookies are essential for the website to function properly. They enable basic functions like page navigation, access to secure areas, and user authentication. The website cannot function properly without these cookies.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700"><strong>Purpose:</strong> Basic functionality and security</p>
                  <p className="text-gray-700"><strong>Duration:</strong> Session or up to 1 year</p>
                  <p className="text-gray-700"><strong>Can be disabled:</strong> No (required for service to work)</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">4.2 Analytics Cookies</h3>
                <p className="text-gray-700 mb-3">
                  These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                </p>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Google Analytics</h4>
                    <p className="text-gray-700"><strong>Purpose:</strong> Website analytics and performance monitoring</p>
                    <p className="text-gray-700"><strong>Data collected:</strong> Anonymous usage statistics, page views, user behavior</p>
                    <p className="text-gray-700"><strong>Duration:</strong> Up to 2 years</p>
                    <p className="text-gray-700"><strong>Third-party:</strong> Google LLC</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">PostHog</h4>
                    <p className="text-gray-700"><strong>Purpose:</strong> Product analytics and user behavior tracking</p>
                    <p className="text-gray-700"><strong>Data collected:</strong> Feature usage, user interactions, performance metrics</p>
                    <p className="text-gray-700"><strong>Duration:</strong> Up to 1 year</p>
                    <p className="text-gray-700"><strong>Third-party:</strong> PostHog Inc.</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">4.3 Preference Cookies</h3>
                <p className="text-gray-700 mb-3">
                  These cookies allow the website to remember choices you make (such as your username, language, or the region you are in) and provide enhanced, more personal features.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700"><strong>Purpose:</strong> Remember user preferences and settings</p>
                  <p className="text-gray-700"><strong>Duration:</strong> Up to 1 year</p>
                  <p className="text-gray-700"><strong>Can be disabled:</strong> Yes (may affect user experience)</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Third-Party Cookies</h2>
              <p className="text-gray-700 mb-4">
                Some cookies are placed by third-party services that appear on our pages. We use the following third-party services:
              </p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">5.1 Google Analytics</h3>
                  <p className="text-gray-700 mb-3">
                    Google Analytics uses cookies to help us analyze how users use our website. The information generated by the cookie about your use of our website (including your IP address) will be transmitted to and stored by Google on servers in the United States.
                  </p>
                  <p className="text-gray-700">
                    Google will use this information for the purpose of evaluating your use of our website, compiling reports on website activity, and providing other services relating to website activity and internet usage.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">5.2 PostHog</h3>
                  <p className="text-gray-700">
                    PostHog uses cookies to track user behavior and provide product analytics. This helps us understand how users interact with our features and improve our service.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Cookie Duration</h2>
              <p className="text-gray-700 mb-4">Cookies can be categorized by their duration:</p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">6.1 Session Cookies</h3>
                  <p className="text-gray-700">
                    These cookies are temporary and are deleted when you close your browser. They are used to maintain your session while you browse our website.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">6.2 Persistent Cookies</h3>
                  <p className="text-gray-700">
                    These cookies remain on your device for a set period or until you delete them. They are used to remember your preferences and settings for future visits.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Managing Your Cookie Preferences</h2>
              <p className="text-gray-700 mb-4">You have several options for managing cookies:</p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">7.1 Browser Settings</h3>
                  <p className="text-gray-700 mb-3">Most web browsers allow you to control cookies through their settings preferences. You can:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>Delete existing cookies</li>
                    <li>Block cookies from being set</li>
                    <li>Set your browser to notify you when cookies are being set</li>
                    <li>Choose which cookies to accept or reject</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">7.2 Opt-Out Links</h3>
                  <p className="text-gray-700 mb-3">You can opt out of specific third-party analytics:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li><strong>Google Analytics:</strong> Google Analytics Opt-out Browser Add-on</li>
                    <li><strong>PostHog:</strong> Contact us to disable PostHog tracking for your account</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">7.3 Contact Us</h3>
                  <p className="text-gray-700">
                    If you have questions about our use of cookies or would like to manage your preferences, please contact us at{' '}
                    <a href="mailto:support@tripbudget.me" className="text-blue-600 hover:text-blue-800">
                      support@tripbudget.me
                    </a>
                    .
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Impact of Disabling Cookies</h2>
              <p className="text-gray-700 mb-4">If you choose to disable cookies, please note that:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Some features of our website may not function properly</li>
                <li>Your preferences and settings may not be remembered</li>
                <li>We may not be able to provide personalized recommendations</li>
                <li>Some third-party integrations may not work correctly</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Updates to This Policy</h2>
              <p className="text-gray-700">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on our website and updating the "Last updated" date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Cookie Policy or our use of cookies, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700"><strong>Email:</strong> <a href="mailto:support@tripbudget.me" className="text-blue-600 hover:text-blue-800">support@tripbudget.me</a></p>
                <p className="text-gray-700"><strong>Address:</strong> FreshBeautyTech OU, Suur Ameerika 22-2, 10122 Tallinn, Harjumaa, Estonia</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 