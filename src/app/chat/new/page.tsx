'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { sendChatMessage } from '@/lib/api/chat/chat-api';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { Button } from '@/components/ui';

function NewTripContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const createTrip = async () => {
      try {
        const message = searchParams.get('message');
        
        if (!message) {
          setError('No message provided');
          return;
        }

        console.log('Creating new trip with message:', message);

        // Send the first message to create a trip
        const response = await sendChatMessage({
          message,
          conversationHistory: []
        });

        if (response.tripId) {
          console.log('Trip created successfully with ID:', response.tripId);
          // Redirect to the trip-specific page
          router.push(`/chat/${response.tripId}`);
        } else {
          setError('Failed to create trip - no trip ID returned');
        }
      } catch (error) {
        console.error('Error creating trip:', error);
        setError('Failed to create trip. Please try again.');
      }
    };

    createTrip();
  }, [searchParams, router]);

  if (error) {
    return (
      <ProtectedRoute>
        <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="text-red-600 text-4xl mb-4">⚠️</div>
              <h2 className="text-xl font-semibold text-red-800 mb-2">Error Creating Trip</h2>
              <p className="text-red-700 mb-4">{error}</p>
              <Button
                onClick={() => router.push('/chat')}
                variant="danger"
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Go Back to Chat
              </Button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Creating Your Trip</h2>
            <p className="text-gray-600 mb-4">Please wait while I set up your travel planning session...</p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default function NewTripPage() {
  return (
    <Suspense fallback={
      <ProtectedRoute>
        <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading...</h2>
              <p className="text-gray-600">Please wait...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    }>
      <NewTripContent />
    </Suspense>
  );
} 