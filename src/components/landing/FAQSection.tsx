'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: 'How does Trip Budget solve fragmented travel planning?',
    answer: 'Instead of jumping between blogs, booking sites, Google Maps, and spreadsheets, Trip Budget brings everything into one AI-powered platform. You can plan your entire trip through natural conversation, get personalized recommendations, and track your budget automatically - all in one place.'
  },
  {
    question: 'How does the AI conversation work?',
    answer: 'Simply tell our AI about your travel preferences, budget, and interests in natural language. For example, "I want to plan a 5-day trip to Paris with a €2000 budget. I love art and food." The AI will understand your needs and suggest flights, hotels, and activities that match your criteria.'
  },
  {
    question: 'How does the automatic budget tracking work?',
    answer: 'Our AI automatically calculates costs for flights, hotels, and activities as you plan. You can see real-time budget updates, get alerts when you approach your limit, and view detailed cost breakdowns. No more manual spreadsheet calculations!'
  },
  {
    question: 'What\'s the card system and how does it help?',
    answer: 'The card system organizes all your selected travel options into interactive cards. You can view booking links, edit selections, compare options, and keep everything organized visually. It\'s like having a digital travel board that updates in real-time.'
  },
  {
    question: 'Do I need to create an account to use Trip Budget?',
    answer: 'Yes, we use secure authentication via Supabase to protect your travel data and preferences. This allows us to save your trip plans, remember your preferences, and provide personalized recommendations across sessions.'
  },
  {
    question: 'How accurate are the flight and hotel recommendations?',
    answer: 'Our AI uses function calling with real-time data sources to provide accurate recommendations. While we strive for accuracy, actual prices may vary due to availability and seasonal changes. We always show you the most current information available.'
  },
  {
    question: 'Can I collaborate with friends and family on trip planning?',
    answer: 'Yes! Our real-time chat features allow you to share your trip plans and collaborate with others. Everyone can contribute to the planning process, making it perfect for group trips and family vacations.'
  },
  {
    question: 'What if I\'m not satisfied with the service?',
    answer: 'We offer a 30-day money-back guarantee. If you\'re not completely satisfied with Trip Budget, contact our support team within 30 days of your purchase and we\'ll provide a full refund.'
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Frequently Asked{' '}
            <span className="text-gradient-primary bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to know about how Trip Budget solves your travel planning problems. 
            Can&apos;t find the answer you&apos;re looking for? Please chat to our friendly team.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-50 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </button>
              
              <motion.div
                id={`faq-answer-${index}`}
                initial={false}
                animate={{
                  height: openIndex === index ? 'auto' : 0,
                  opacity: openIndex === index ? 1 : 0
                }}
                transition={{
                  duration: 0.3,
                  ease: 'easeInOut'
                }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Still have questions?
            </h3>
            <p className="text-blue-100 text-lg mb-6 max-w-2xl mx-auto">
              Our support team is here to help you get the most out of Trip Budget and end your travel planning frustrations. 
              We typically respond within a few hours.
            </p>
            <div className="flex justify-center">
              <a href="/contact" className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                Contact Support
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 