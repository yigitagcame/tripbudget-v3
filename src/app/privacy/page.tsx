import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Trip Budget',
  description: 'Privacy Policy for Trip Budget - Learn how we collect, use, and protect your information.',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: 7/8/2025</p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 mb-4">
                FreshBeautyTech OU ("we," "our," or "us") operates the TripBudget application. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
              </p>
              <p className="text-gray-700">
                By using TripBudget, you consent to the data practices described in this policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Company Information</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700 mb-2"><strong>Company Name:</strong> FreshBeautyTech OU</p>
                <p className="text-gray-700 mb-2"><strong>Legal Form:</strong> Private Limited Company (Osaühing)</p>
                <p className="text-gray-700 mb-2"><strong>Address:</strong> Suur Ameerika 22-2, 10122 Tallinn, Harjumaa, Estonia</p>
                <p className="text-gray-700 mb-2"><strong>Registration Number:</strong> 16717409</p>
                <p className="text-gray-700 mb-2"><strong>Managing Director:</strong> Yigit Agca</p>
                <p className="text-gray-700 mb-2"><strong>Email:</strong> support@makermeet.me</p>
                <p className="text-gray-700"><strong>Website:</strong> www.makermeet.me</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 Personal Information</h3>
              <p className="text-gray-700 mb-4">We collect the following personal information:</p>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li>Name and email address</li>
                <li>Profile pictures</li>
                <li>Travel preferences and requirements</li>
                <li>Account credentials</li>
                <li>Payment information (processed securely through third-party providers)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">3.2 Usage Data</h3>
              <p className="text-gray-700 mb-4">We collect information about how you use our service:</p>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li>Chat conversations and travel planning queries</li>
                <li>Features you use and interactions with our platform</li>
                <li>Device information and browser type</li>
                <li>IP address and general location data</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">3.3 Cookies and Tracking Technologies</h3>
              <p className="text-gray-700 mb-4">We use cookies and similar technologies:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Necessary cookies:</strong> Required for basic functionality</li>
                <li><strong>Analytical cookies:</strong> Via PostHog and Google Analytics to understand usage patterns</li>
                <li><strong>Preference cookies:</strong> To remember your settings and preferences</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">We use your information for the following purposes:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Providing and improving our AI-powered travel planning service</li>
                <li>Processing your travel queries and generating personalized recommendations</li>
                <li>Managing your account and processing payments</li>
                <li>Communicating with you about our service</li>
                <li>Analyzing usage patterns to improve our platform</li>
                <li>Ensuring security and preventing fraud</li>
                <li>Complying with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Sharing and Third Parties</h2>
              <p className="text-gray-700 mb-4">We do not sell your personal information. We may share data in the following circumstances:</p>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">5.1 AI Service Providers</h3>
              <p className="text-gray-700 mb-4">
                We use OpenAI, Gemini, and Grok for AI processing. We do not share personal identifiers with these services. Premium users can opt to hide their messages from processing.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">5.2 Analytics Services</h3>
              <p className="text-gray-700 mb-4">
                We use PostHog and Google Analytics for usage analytics. These services may collect anonymous usage data.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">5.3 Legal Requirements</h3>
              <p className="text-gray-700">
                We may disclose information if required by law or to protect our rights and safety.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Security</h2>
              <p className="text-gray-700">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Data Retention</h2>
              <p className="text-gray-700">
                We retain your personal information for as long as necessary to provide our services and comply with legal obligations. You may request deletion of your personal identifiers at any time.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Your Rights (GDPR/CCPA)</h2>
              <p className="text-gray-700 mb-4">You have the following rights regarding your personal information:</p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
                <li><strong>Erasure:</strong> Request deletion of your personal data</li>
                <li><strong>Portability:</strong> Receive your data in a structured format</li>
                <li><strong>Objection:</strong> Object to processing of your data</li>
                <li><strong>Restriction:</strong> Limit how we process your data</li>
              </ul>
              <p className="text-gray-700">
                To exercise these rights, contact us at: <a href="mailto:support@tripbudget.me" className="text-blue-600 hover:text-blue-800">support@tripbudget.me</a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Account Deletion</h2>
              <p className="text-gray-700">
                You may request account deletion by emailing <a href="mailto:support@tripbudget.me" className="text-blue-600 hover:text-blue-800">support@tripbudget.me</a>. We will process your request within 14 days and remove your personal identifiers and account data.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Age Restrictions</h2>
              <p className="text-gray-700">
                Our service is intended for users who are at least 18 years old. We do not knowingly collect personal information from individuals under 18.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. International Transfers</h2>
              <p className="text-gray-700">
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Changes to This Policy</h2>
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on our website and updating the "Last updated" date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Us</h2>
              <p className="text-gray-700 mb-4">If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700 mb-2">
                  <strong>Email:</strong> <a href="mailto:support@tripbudget.me" className="text-blue-600 hover:text-blue-800">support@tripbudget.me</a>
                </p>
                <p className="text-gray-700">
                  <strong>Address:</strong> FreshBeautyTech OU, Suur Ameerika 22-2, 10122 Tallinn, Harjumaa, Estonia
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 