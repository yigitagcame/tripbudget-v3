import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - TripBudget',
  description: 'Terms of Service for TripBudget - AI-powered travel planning platform',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          <p className="text-gray-600 mb-8">Last updated: 7/8/2025</p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Agreement to Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using TripBudget ("the Service"), operated by FreshBeautyTech OU ("we," "our," or "us"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Service Description</h2>
              <p className="text-gray-700 mb-4">
                TripBudget is an AI-powered travel planning platform that provides:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Personalized travel recommendations based on your preferences</li>
                <li>Budget planning and cost estimates</li>
                <li>Itinerary suggestions and travel tips</li>
                <li>Integration with third-party booking platforms</li>
              </ul>
              <p className="text-gray-700 mb-4">
                <strong>Important:</strong> We provide recommendations only. We do not make actual bookings, reservations, or purchases on your behalf. All bookings must be made directly through third-party platforms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Eligibility</h2>
              <p className="text-gray-700 mb-4">
                You must be at least 18 years old to use this Service. By using the Service, you represent and warrant that:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>You are at least 18 years old</li>
                <li>You have the legal capacity to enter into these Terms</li>
                <li>You will use the Service in accordance with these Terms</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. User Accounts</h2>
              <p className="text-gray-700 mb-4">
                To access certain features of the Service, you must create an account. You are responsible for:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Providing accurate and complete information</li>
                <li>Maintaining the security of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use</li>
              </ul>
              <p className="text-gray-700 mb-4">
                You may delete your account at any time by contacting us at support@tripbudget.me. We will process your request within 14 days.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Payment Terms</h2>
              <p className="text-gray-700 mb-4">
                Our Service operates on a pay-per-message model. Some features may be available for free.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">5.1 Pricing</h3>
              <p className="text-gray-700 mb-4">
                Pricing is displayed on our platform and may change with notice. You agree to pay all charges incurred through your account at the rates in effect when such charges are incurred.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">5.2 Refunds</h3>
              <p className="text-gray-700 mb-4">
                Unused purchases may be refunded within 14 days of purchase. Refund requests must be submitted via email to support@tripbudget.me.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">5.3 Payment Processing</h3>
              <p className="text-gray-700 mb-4">
                Payments are processed securely through third-party payment providers. We do not store your payment information on our servers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Acceptable Use</h2>
              <p className="text-gray-700 mb-4">
                You agree not to use the Service to:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Harass, abuse, or harm others</li>
                <li>Transmit malicious code or attempt to gain unauthorized access</li>
                <li>Use the Service for commercial purposes without authorization</li>
                <li>Attempt to reverse engineer or copy the Service</li>
                <li>Interfere with the proper functioning of the Service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Intellectual Property</h2>
              <p className="text-gray-700 mb-4">
                The Service and its original content, features, and functionality are owned by FreshBeautyTech OU and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
              <p className="text-gray-700 mb-4">
                You retain ownership of any content you submit to the Service, but you grant us a license to use, modify, and display such content in connection with providing the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Disclaimers and Limitations</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">8.1 Service Availability</h3>
              <p className="text-gray-700 mb-4">
                We strive to provide reliable service but cannot guarantee uninterrupted availability. The Service is provided "as is" without warranties of any kind.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">8.2 Travel Information Accuracy</h3>
              <p className="text-gray-700 mb-4">
                We do not guarantee the accuracy, completeness, or timeliness of travel information, recommendations, or pricing. Travel conditions, prices, and availability change frequently. Always verify information with official sources before making travel decisions.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">8.3 Third-Party Services</h3>
              <p className="text-gray-700 mb-4">
                We may earn commissions from third-party booking platforms when you make purchases through our recommendations. We are not responsible for the services, policies, or practices of third-party platforms.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">8.4 AI-Generated Content</h3>
              <p className="text-gray-700 mb-4">
                Our recommendations are generated using AI technology. While we strive for accuracy, AI-generated content may contain errors or inaccuracies. You should independently verify all information before making travel decisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                To the maximum extent permitted by law, FreshBeautyTech OU shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Loss of profits, data, or use</li>
                <li>Travel disruptions or cancellations</li>
                <li>Booking errors or miscommunications</li>
                <li>Personal injury or property damage</li>
                <li>Any damages arising from use of third-party services</li>
              </ul>
              <p className="text-gray-700 mb-4">
                Our total liability shall not exceed the amount you paid for the Service in the 12 months preceding the claim.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Indemnification</h2>
              <p className="text-gray-700 mb-4">
                You agree to indemnify and hold harmless FreshBeautyTech OU from any claims, damages, or expenses arising from your use of the Service or violation of these Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Termination</h2>
              <p className="text-gray-700 mb-4">
                We may terminate or suspend your account and access to the Service immediately, without prior notice, for any reason, including violation of these Terms.
              </p>
              <p className="text-gray-700 mb-4">
                Upon termination, your right to use the Service will cease immediately, and we may delete your account data.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Governing Law</h2>
              <p className="text-gray-700 mb-4">
                These Terms shall be governed by and construed in accordance with the laws of Estonia, without regard to its conflict of law provisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Changes to Terms</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to modify these Terms at any time. We will notify users of material changes by posting the new Terms on our website and updating the "Last updated" date.
              </p>
              <p className="text-gray-700 mb-4">
                Your continued use of the Service after changes become effective constitutes acceptance of the new Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-2">
                  <strong>Email:</strong> support@tripbudget.me
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