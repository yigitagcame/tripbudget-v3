'use client';

import { motion } from 'framer-motion';
import { Bot, MessageCircle, CreditCard, ArrowRight, Calendar, Search, Users, Layout } from 'lucide-react';

const features = [
  {
    icon: MessageCircle,
    title: 'Natural AI Conversation',
    description: 'Plan your entire trip through natural conversation. Ask questions, get personalized recommendations, and refine your itinerary with simple chat.',
    color: 'from-blue-500 to-purple-600',
    bgColor: 'from-blue-50 to-purple-50'
  },
  {
    icon: Search,
    title: 'Smart Flight & Hotel Search',
    description: 'AI-powered search for flights, accommodations, and attractions. Get real-time recommendations based on your preferences and budget.',
    color: 'from-green-500 to-emerald-600',
    bgColor: 'from-green-50 to-emerald-50'
  },
  {
    icon: Layout,
    title: 'Interactive Card System',
    description: 'Organize selected flights, hotels, and activities into interactive cards. View booking links, edit selections, and keep everything organized.',
    color: 'from-orange-500 to-red-600',
    bgColor: 'from-orange-50 to-red-50'
  },
  {
    icon: Users,
    title: 'Real-time Collaboration',
    description: 'Share your trip plans with friends and family. Real-time chat and collaboration features let everyone contribute to the perfect itinerary.',
    color: 'from-teal-500 to-green-600',
    bgColor: 'from-teal-50 to-green-50'
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Everything You Need to{' '}
            <span className="text-gradient-primary bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Plan the Perfect Trip
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stop juggling between multiple apps and spreadsheets. Our AI-powered platform brings all your travel planning 
            into one seamless, intelligent experience.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-blue-700" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Ready to End Travel Planning Chaos?
            </h3>
            <p className="text-blue-100 text-lg mb-6 max-w-2xl mx-auto">
              Join thousands of travelers who have ditched the spreadsheets and multiple apps for one intelligent AI-powered platform.
            </p>
            <a 
              href="/chat" 
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Started for Free
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 