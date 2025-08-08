'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, DollarSign, Star, MapPin, Plane, Hotel, Utensils, Mountain } from 'lucide-react';
import { Card } from '@/lib/api/chat/chat-api';
import { Button } from '@/components/ui';

interface TripPlanItem extends Card {
  id: number;
}

interface TripPlanStackProps {
  tripPlan: TripPlanItem[];
  onRemoveItem: (id: number) => void;
  onAddItem?: (card: Card) => void;
}

export default function TripPlanStack({ tripPlan, onRemoveItem }: TripPlanStackProps) {
  const getIconForType = (type: string) => {
    switch (type) {
      case 'flight':
        return <Plane className="w-4 h-4" />;
      case 'hotel':
        return <Hotel className="w-4 h-4" />;
      case 'restaurant':
        return <Utensils className="w-4 h-4" />;
      case 'activity':
        return <MapPin className="w-4 h-4" />;
      case 'destination':
        return <Mountain className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  const getColorForType = (type: string) => {
    switch (type) {
      case 'flight':
        return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'hotel':
        return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'restaurant':
        return 'bg-orange-100 text-orange-600 border-orange-200';
      case 'activity':
        return 'bg-green-100 text-green-600 border-green-200';
      case 'destination':
        return 'bg-teal-100 text-teal-600 border-teal-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'flight':
        return 'Flight';
      case 'hotel':
        return 'Hotel';
      case 'restaurant':
        return 'Restaurant';
      case 'activity':
        return 'Activity';
      case 'destination':
        return 'Destination';
      default:
        return 'Item';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-200 h-full flex flex-col"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Trip Plan</h2>
              <p className="text-sm text-gray-500">{tripPlan.length} items added</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {tripPlan.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No items yet</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Start chatting with the AI assistant to add flights, hotels, restaurants, and activities to your trip plan!
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {tripPlan.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-xl border ${getColorForType(item.type)} relative group`}
                >
                  {/* Remove button */}
                  <Button
                    onClick={() => onRemoveItem(item.id)}
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 p-1 rounded-lg bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-600 hover:text-red-600 transition-all duration-200 opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-3 h-3" />
                  </Button>

                  {/* Item content */}
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${getColorForType(item.type).replace('bg-', 'bg-opacity-20 ')}`}>
                      {getIconForType(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-white bg-opacity-50">
                          {getTypeLabel(item.type)}
                        </span>
                      </div>
                      <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                      <p className="text-xs opacity-80 mb-2">{item.description}</p>
                      
                      {/* Additional details */}
                      <div className="flex items-center space-x-4 text-xs">
                        {item.price && (
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-3 h-3" />
                            <span>{item.price}</span>
                          </div>
                        )}
                        {item.rating && (
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3" />
                            <span>{item.rating}</span>
                          </div>
                        )}
                        {item.location && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{item.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Summary */}
      {tripPlan.length > 0 && (
        <div className="p-6 border-t border-gray-200">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Plan Summary</h3>
            <div className="text-xs text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>Flights:</span>
                <span>{tripPlan.filter(item => item.type === 'flight').length}</span>
              </div>
              <div className="flex justify-between">
                <span>Hotels:</span>
                <span>{tripPlan.filter(item => item.type === 'hotel').length}</span>
              </div>
              <div className="flex justify-between">
                <span>Restaurants:</span>
                <span>{tripPlan.filter(item => item.type === 'restaurant').length}</span>
              </div>
              <div className="flex justify-between">
                <span>Activities:</span>
                <span>{tripPlan.filter(item => item.type === 'activity').length}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
} 