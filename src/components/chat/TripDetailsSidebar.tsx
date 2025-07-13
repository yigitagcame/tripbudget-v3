'use client';

import { motion } from 'framer-motion';
import { Plane, Calendar, Users, MapPin, Sparkles, RefreshCw } from 'lucide-react';

interface TripDetails {
  from: string;
  to: string;
  departDate: string;
  returnDate: string;
  passengers: number;
}

interface TripDetailsSidebarProps {
  tripDetails: TripDetails;
  onTripDetailsChange?: (details: TripDetails) => void;
}

export default function TripDetailsSidebar({ tripDetails, onTripDetailsChange }: TripDetailsSidebarProps) {
  // Check if AI has provided trip details
  const hasTripDetails = tripDetails.from || tripDetails.to || tripDetails.departDate || tripDetails.returnDate || tripDetails.passengers > 0;

  // Add debugging to understand what's happening
  console.log('TripDetailsSidebar - tripDetails:', tripDetails);
  console.log('TripDetailsSidebar - hasTripDetails:', hasTripDetails);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-200 h-full flex flex-col"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <Plane className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Travel Details</h2>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {!hasTripDetails ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No trip details yet</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Start chatting with the AI assistant about your trip! Tell us where you want to go, when you're traveling, and how many people are coming.
            </p>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-700">
                💡 <strong>Tip:</strong> The AI will remember your trip details throughout the conversation and use them for personalized recommendations.
              </p>
            </div>
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">Try asking:</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• "I want to go to Paris in March"</li>
                <li>• "Planning a trip to Tokyo for 2 people"</li>
                <li>• "Looking for flights to New York next month"</li>
              </ul>
            </div>
          </motion.div>
        ) : (
          /* Trip Details Display */
          <div className="space-y-4">
            {/* AI Context Indicator */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200"
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-xs text-green-700 font-medium">
                  AI has trip context and will provide personalized recommendations
                </p>
              </div>
            </motion.div>
            {/* From */}
            {tripDetails.from && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-gray-50 rounded-xl border border-gray-200"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">From</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">{tripDetails.from}</p>
              </motion.div>
            )}

            {/* To */}
            {tripDetails.to && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="p-4 bg-gray-50 rounded-xl border border-gray-200"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <MapPin className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">To</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">{tripDetails.to}</p>
              </motion.div>
            )}

            {/* Dates */}
            {(tripDetails.departDate || tripDetails.returnDate) && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Travel Dates</span>
                </div>
                <div className="space-y-2">
                  {tripDetails.departDate && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Departure:</span>
                      <span className="font-semibold text-gray-900">
                        {new Date(tripDetails.departDate).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  )}
                  {tripDetails.returnDate && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Return:</span>
                      <span className="font-semibold text-gray-900">
                        {new Date(tripDetails.returnDate).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Passengers - only show if AI has provided passenger information */}
            {tripDetails.passengers && tripDetails.passengers > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="p-4 bg-gray-50 rounded-xl border border-gray-200"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <Users className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Travelers</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {tripDetails.passengers} {tripDetails.passengers === 1 ? 'person' : 'people'}
                </p>
              </motion.div>
            )}

            {/* Trip Summary */}
            {tripDetails.from && tripDetails.to && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-6 p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white"
              >
                <h3 className="font-semibold mb-2">Trip Summary</h3>
                <div className="space-y-1 text-sm opacity-90">
                  <p><span className="font-medium">Route:</span> {tripDetails.from} → {tripDetails.to}</p>
                  {tripDetails.departDate && tripDetails.returnDate && (
                    <p><span className="font-medium">Duration:</span> {
                      Math.ceil((new Date(tripDetails.returnDate).getTime() - new Date(tripDetails.departDate).getTime()) / (1000 * 60 * 60 * 24))
                    } days</p>
                  )}
                  {tripDetails.passengers && tripDetails.passengers > 0 && (
                    <p><span className="font-medium">Travelers:</span> {tripDetails.passengers}</p>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
} 