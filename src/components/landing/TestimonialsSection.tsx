'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { Button } from '@/components/ui';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Solo Traveler',
    avatar: '/api/placeholder/60/60',
    content: 'I used to spend hours jumping between booking sites, Google Maps, and spreadsheets. Trip Budget changed everything - I can plan my entire trip through natural conversation with AI. No more decision fatigue!',
    rating: 5,
    location: 'New York, USA'
  },
  {
    id: 2,
    name: 'Marcus Chen',
    role: 'Business Traveler',
    avatar: '/api/placeholder/60/60',
    content: 'The automatic budget tracking is a game-changer. I can see exactly where my money is going in real-time, and the AI helps me stay within budget while finding the best deals.',
    rating: 5,
    location: 'San Francisco, USA'
  },
  {
    id: 3,
    name: 'Emma Rodriguez',
    role: 'Family Traveler',
    avatar: '/api/placeholder/60/60',
    content: 'Finally, everything in one place! No more juggling multiple apps and losing track of bookings. The card system keeps everything organized and the AI finds perfect family-friendly options.',
    rating: 5,
    location: 'Toronto, Canada'
  },
  {
    id: 4,
    name: 'David Kim',
    role: 'Adventure Seeker',
    avatar: '/api/placeholder/60/60',
    content: 'The natural conversation with AI is incredible. I can ask "I want an adventurous trip to Japan with a €3000 budget" and get personalized recommendations instantly. No more missed opportunities!',
    rating: 5,
    location: 'Seoul, South Korea'
  }
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="py-20 bg-white">
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
            Travelers Who{' '}
            <span className="text-gradient-primary bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Ditched the Spreadsheets
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how real travelers solved their planning problems with AI-powered trip planning.
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-4xl mx-auto">
          {/* Navigation Buttons */}
          <Button
            onClick={prevTestimonial}
            variant="ghost"
            size="sm"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow border border-gray-200"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </Button>

          <Button
            onClick={nextTestimonial}
            variant="ghost"
            size="sm"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow border border-gray-200"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-12 text-gray-600" />
          </Button>

          {/* Testimonial Cards */}
          <div className="overflow-hidden">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg border border-gray-100"
            >
              <div className="flex items-start gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {testimonials[currentIndex].name.charAt(0)}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  {/* Quote Icon */}
                  <Quote className="w-8 h-8 text-blue-600 mb-4" />
                  
                  {/* Testimonial Text */}
                  <blockquote className="text-lg text-gray-700 leading-relaxed mb-6">
                    &ldquo;{testimonials[currentIndex].content}&rdquo;
                  </blockquote>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Author Info */}
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonials[currentIndex].name}
                    </div>
                    <div className="text-gray-600">
                      {testimonials[currentIndex].role} • {testimonials[currentIndex].location}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <Button
                key={index}
                onClick={() => setCurrentIndex(index)}
                variant="ghost"
                size="sm"
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              >
                <span className="sr-only">Testimonial {index + 1}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-16 border-t border-gray-200"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">50K+</div>
            <div className="text-gray-600">Travelers Who Switched</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">150+</div>
            <div className="text-gray-600">Countries Explored</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">4.9/5</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 