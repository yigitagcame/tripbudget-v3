import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Disclaimer - Trip Budget',
  description: 'Important legal disclaimers and terms for Trip Budget travel planning service.',
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Disclaimer
            </h1>
            <p className="text-gray-600 text-lg">
              Last updated: 7/8/2025
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="space-y-8">
              {/* General Disclaimer */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. General Disclaimer</h2>
                <p className="text-gray-700 mb-4">
                  The information provided on TripBudget, operated by FreshBeautyTech OU, is for general informational purposes only. All content, recommendations, and advice are provided "as is" without any warranties of any kind, either express or implied.
                </p>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                  <p className="text-yellow-800 font-semibold">
                    Important: We provide travel recommendations and planning assistance only. We do not make actual bookings, reservations, or purchases on your behalf.
                  </p>
                </div>
              </section>

              {/* Travel Information Accuracy */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Travel Information Accuracy</h2>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">No Guarantee of Accuracy</h3>
                <p className="text-gray-700 mb-4">
                  While we strive to provide accurate and up-to-date travel information, we cannot guarantee the accuracy, completeness, or timeliness of any information provided through our service.
                </p>
                <p className="text-gray-700 mb-4">Travel information, including but not limited to:</p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1 ml-4">
                  <li>Flight schedules and prices</li>
                  <li>Hotel availability and rates</li>
                  <li>Attraction opening hours and admission fees</li>
                  <li>Transportation options and costs</li>
                  <li>Weather conditions and forecasts</li>
                  <li>Visa requirements and travel restrictions</li>
                  <li>Health and safety information</li>
                </ul>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                  <p className="text-blue-800">
                    <strong>Always verify information:</strong> We strongly recommend that you independently verify all travel information with official sources, airlines, hotels, and relevant authorities before making any travel decisions or bookings.
                  </p>
                </div>
              </section>

              {/* AI-Generated Content Disclaimer */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. AI-Generated Content Disclaimer</h2>
                <p className="text-gray-700 mb-4">
                  Our travel recommendations and content are generated using artificial intelligence technology, including OpenAI, Gemini, and Grok. While we strive for accuracy, AI-generated content may contain errors, inaccuracies, or outdated information.
                </p>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">AI Limitations:</h3>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1 ml-4">
                  <li>AI may not have access to the most current information</li>
                  <li>Recommendations may be based on historical data</li>
                  <li>AI cannot account for real-time changes in travel conditions</li>
                  <li>Personal preferences and circumstances may not be fully understood</li>
                  <li>AI-generated itineraries may not be optimal for all travelers</li>
                </ul>
                <div className="bg-orange-50 border-l-4 border-orange-400 p-4">
                  <p className="text-orange-800">
                    <strong>Independent Verification Required:</strong> You should always independently verify AI-generated recommendations before making travel decisions.
                  </p>
                </div>
              </section>

              {/* Third-Party Services and Links */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Third-Party Services and Links</h2>
                <p className="text-gray-700 mb-4">
                  Our service may include links to third-party websites, booking platforms, and services. We do not endorse, control, or take responsibility for:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1 ml-4">
                  <li>The content, policies, or practices of third-party websites</li>
                  <li>The accuracy of information provided by third parties</li>
                  <li>The quality, safety, or legality of third-party services</li>
                  <li>Any transactions or bookings made through third-party platforms</li>
                  <li>The availability, pricing, or terms offered by third parties</li>
                </ul>
                <p className="text-gray-700 mb-4">
                  <strong>Commission Disclosure:</strong> We may earn commissions from third-party booking platforms when you make purchases through our recommendations. This does not affect the price you pay.
                </p>
              </section>

              {/* Travel Risks and Responsibilities */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Travel Risks and Responsibilities</h2>
                <p className="text-gray-700 mb-4">Travel is inherently risky. You acknowledge and accept that:</p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1 ml-4">
                  <li>Travel plans may be disrupted due to various factors beyond our control</li>
                  <li>Weather conditions, natural disasters, and political events may affect travel</li>
                  <li>Health and safety risks exist in all travel destinations</li>
                  <li>Local laws, customs, and conditions may differ from your expectations</li>
                  <li>Travel insurance is recommended for all trips</li>
                </ul>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Your Responsibility:</h3>
                <p className="text-gray-700 mb-4">You are solely responsible for:</p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1 ml-4">
                  <li>Making your own travel arrangements and bookings</li>
                  <li>Ensuring you have proper travel documentation</li>
                  <li>Checking travel advisories and health requirements</li>
                  <li>Obtaining appropriate travel insurance</li>
                  <li>Complying with local laws and customs</li>
                </ul>
              </section>

              {/* Health and Safety Disclaimers */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Health and Safety Disclaimers</h2>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">COVID-19 and Health Emergencies</h3>
                <p className="text-gray-700 mb-4">
                  Travel during health emergencies, including COVID-19, involves additional risks. We do not provide medical advice or guarantee the safety of any destination.
                </p>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Health Information</h3>
                <p className="text-gray-700 mb-4">
                  Any health-related information provided is for general reference only and should not be considered medical advice. Always consult with healthcare professionals before traveling, especially if you have health conditions.
                </p>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Safety Information</h3>
                <p className="text-gray-700 mb-4">
                  Safety conditions can change rapidly. We cannot guarantee the safety of any destination or activity. Always check current safety information from official sources.
                </p>
              </section>

              {/* Financial and Pricing Disclaimers */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Financial and Pricing Disclaimers</h2>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Price Estimates</h3>
                <p className="text-gray-700 mb-4">
                  All cost estimates and budget recommendations are approximate and subject to change. Actual costs may vary significantly due to:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1 ml-4">
                  <li>Seasonal price fluctuations</li>
                  <li>Currency exchange rate changes</li>
                  <li>Availability and demand</li>
                  <li>Taxes, fees, and surcharges</li>
                  <li>Individual preferences and choices</li>
                </ul>
                <p className="text-gray-700 mb-4">
                  <strong>No Financial Advice:</strong> Our budget recommendations are not financial advice. You should consult with financial professionals for investment or financial planning decisions.
                </p>
              </section>

              {/* Service Availability and Technical Disclaimers */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Service Availability and Technical Disclaimers</h2>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Service Availability</h3>
                <p className="text-gray-700 mb-4">
                  We strive to provide reliable service but cannot guarantee uninterrupted availability. Our service may be temporarily unavailable due to:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1 ml-4">
                  <li>Technical issues or maintenance</li>
                  <li>Server problems or outages</li>
                  <li>Internet connectivity issues</li>
                  <li>Third-party service disruptions</li>
                </ul>
                <p className="text-gray-700 mb-4">
                  <strong>No Warranty:</strong> The service is provided "as is" without warranties of any kind, including but not limited to merchantability, fitness for a particular purpose, or non-infringement.
                </p>
              </section>

              {/* Limitation of Liability */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Limitation of Liability</h2>
                <p className="text-gray-700 mb-4">
                  To the maximum extent permitted by law, FreshBeautyTech OU shall not be liable for any damages arising from:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1 ml-4">
                  <li>Use of our travel recommendations or information</li>
                  <li>Travel disruptions, cancellations, or delays</li>
                  <li>Booking errors or miscommunications</li>
                  <li>Personal injury, illness, or property damage</li>
                  <li>Financial losses or missed opportunities</li>
                  <li>Service interruptions or technical issues</li>
                  <li>Third-party actions or inactions</li>
                </ul>
                <p className="text-gray-700 mb-4">
                  <strong>Maximum Liability:</strong> Our total liability shall not exceed the amount you paid for our service in the 12 months preceding the claim.
                </p>
              </section>

              {/* Indemnification */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Indemnification</h2>
                <p className="text-gray-700 mb-4">
                  You agree to indemnify and hold harmless FreshBeautyTech OU from any claims, damages, or expenses arising from your use of our service, including but not limited to:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1 ml-4">
                  <li>Travel-related losses or damages</li>
                  <li>Violation of these disclaimers</li>
                  <li>Misuse of our recommendations</li>
                  <li>Third-party claims related to your travel</li>
                </ul>
              </section>

              {/* Changes to Disclaimer */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Changes to Disclaimer</h2>
                <p className="text-gray-700 mb-4">
                  We reserve the right to modify this disclaimer at any time. Changes will be effective immediately upon posting on our website. Your continued use of our service after changes constitutes acceptance of the updated disclaimer.
                </p>
              </section>

              {/* Contact Information */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact Information</h2>
                <p className="text-gray-700 mb-4">
                  If you have questions about this disclaimer or our service, please contact us:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 mb-2">
                    <strong>Email:</strong> support@tripbudget.me
                  </p>
                  <p className="text-gray-700">
                    <strong>Address:</strong> FreshBeautyTech OU, Suur Ameerika 22-2, 10122 Tallinn, Harjumaa, Estonia
                  </p>
                </div>
              </section>

              {/* Important Notice */}
              <section>
                <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg">
                  <h2 className="text-2xl font-semibold text-red-800 mb-4">⚠️ Important Notice</h2>
                  <p className="text-red-700 text-lg">
                    By using TripBudget, you acknowledge that you have read, understood, and agree to this disclaimer. If you do not agree with any part of this disclaimer, please do not use our service.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 