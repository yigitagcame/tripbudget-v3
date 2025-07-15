'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { tripService } from '@/lib/trip-service';
import ProtectedRoute from '@/components/ProtectedRoute';

function ChatPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const initialMessage = searchParams.get('message');

  useEffect(() => {
    const findOrCreateTrip = async () => {
      if (!user) return;

      try {
        // Find an existing empty trip or create a new one
        const tripId = await tripService.findOrCreateEmptyTrip(user.id);
        
        if (tripId) {
          // Redirect to the trip's chat page with the initial message if provided
          const url = initialMessage 
            ? `/chat/${tripId}?message=${encodeURIComponent(initialMessage)}`
            : `/chat/${tripId}`;
          router.push(url);
        } else {
          console.error('Failed to find or create trip');
          // Handle error - could show an error message
        }
      } catch (error) {
        console.error('Error finding or creating trip:', error);
        // Handle error - could show an error message
      }
    };

    findOrCreateTrip();
  }, [user, router, initialMessage]);

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Finding your trip...</p>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={
        <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }>
        <ChatPageContent />
      </Suspense>
    </ProtectedRoute>
  );
} 