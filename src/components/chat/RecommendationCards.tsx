'use client';

import { motion } from 'framer-motion';
import { Plane, Hotel, Utensils, MapPin, Star, ExternalLink, Plus, Globe } from 'lucide-react';
import { Card } from '@/lib/chat-api';

interface RecommendationCardsProps {
  cards: Card[];
  onAddToTripPlan?: (card: Card) => void;
}

const getCardIcon = (type: Card['type']) => {
  switch (type) {
    case 'flight':
      return <Plane className="w-5 h-5" />;
    case 'hotel':
      return <Hotel className="w-5 h-5" />;
    case 'restaurant':
      return <Utensils className="w-5 h-5" />;
    case 'activity':
    case 'place':
      return <MapPin className="w-5 h-5" />;
    case 'transport':
      return <Plane className="w-5 h-5" />;
    case 'destination':
      return <Globe className="w-5 h-5" />;
    default:
      return <MapPin className="w-5 h-5" />;
  }
};

const getCardColor = (type: Card['type']) => {
  switch (type) {
    case 'flight':
      return 'from-blue-500 to-blue-600';
    case 'hotel':
      return 'from-purple-500 to-purple-600';
    case 'restaurant':
      return 'from-orange-500 to-orange-600';
    case 'activity':
      return 'from-green-500 to-green-600';
    case 'place':
      return 'from-indigo-500 to-indigo-600';
    case 'transport':
      return 'from-red-500 to-red-600';
    case 'destination':
      return 'from-teal-500 to-teal-600';
    default:
      return 'from-gray-500 to-gray-600';
  }
};

const getCardTypeLabel = (type: Card['type']) => {
  switch (type) {
    case 'flight':
      return 'Flight';
    case 'hotel':
      return 'Hotel';
    case 'restaurant':
      return 'Restaurant';
    case 'activity':
      return 'Activity';
    case 'place':
      return 'Place';
    case 'transport':
      return 'Transport';
    case 'destination':
      return 'Destination';
    default:
      return 'Recommendation';
  }
};

export default function RecommendationCards({ cards, onAddToTripPlan }: RecommendationCardsProps) {
  if (!cards || cards.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {cards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 bg-gradient-to-r ${getCardColor(card.type)} rounded-lg flex items-center justify-center text-white`}>
                  {getCardIcon(card.type)}
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {getCardTypeLabel(card.type)}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900">{card.title}</h3>
                </div>
              </div>
              {card.rating && (
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-gray-700">{card.rating}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-3 leading-relaxed">
              {card.description}
            </p>

            {/* Details */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm">
                {card.location && (
                  <div className="flex items-center space-x-1 text-gray-500">
                    <MapPin className="w-3 h-3" />
                    <span>{card.location}</span>
                  </div>
                )}
                {card.price && (
                  <span className="font-semibold text-green-600">{card.price}</span>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                {onAddToTripPlan && card.type !== 'destination' && (
                  <button
                    onClick={() => onAddToTripPlan(card)}
                    className="inline-flex items-center space-x-1 text-green-600 hover:text-green-700 text-sm font-medium transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add to Trip</span>
                  </button>
                )}
                {card.bookingUrl && (
                  <a
                    href={card.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                  >
                    <span>Book Now</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
} 