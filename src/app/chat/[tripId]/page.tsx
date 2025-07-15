'use client';

import React, { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import TripDetailsSidebar from '@/components/chat/TripDetailsSidebar';
import TripPlanStack from '@/components/chat/TripPlanStack';
import ChatWindow from '@/components/chat/ChatWindow';

import { sendChatMessage, type ChatMessage, type TripDetails, type Card, type ChatError } from '@/lib/chat-api';
import { tripService, type TripData } from '@/lib/trip-service';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { MessageServiceClient } from '@/lib/message-service-client';

interface TripPlanItem extends Card {
  id: number;
}

function ChatPageContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tripId = params.tripId as string;
  const { user } = useAuth();
  const initialMessage = searchParams.get('message');
  
  const [trip, setTrip] = useState<TripData | null>(null);
  const [loading, setLoading] = useState(true);
  const [chatHistoryLoading, setChatHistoryLoading] = useState(true);
  const [currency, setCurrency] = useState('EUR'); // Default to Euro
  const [tripDetails, setTripDetails] = useState<TripDetails>({
    from: '',
    to: '',
    departDate: '',
    returnDate: '',
    passengers: 0
  });

  const [tripPlan, setTripPlan] = useState<TripPlanItem[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [realtimeSubscription, setRealtimeSubscription] = useState<any>(null);
  const [showGetMoreMessagesModal, setShowGetMoreMessagesModal] = useState(false);
  
  // Use ref to track if initial message has been processed to prevent race conditions
  const initialMessageProcessedRef = useRef(false);

  // Load trip data and chat history on component mount
  useEffect(() => {
    if (tripId && user) {
      loadTripAndHistory();
    }
  }, [tripId, user]);

  const loadTripAndHistory = async () => {
    setLoading(true);
    setChatHistoryLoading(true);
    
    try {
      // Load trip data first
      const tripData = await tripService.getTrip(tripId);
      if (tripData && tripData.user_id === user?.id) {
        setTrip(tripData);
        // Update trip details from database
        const loadedTripDetails = {
          from: tripData.origin || '',
          to: tripData.destination || '',
          departDate: tripData.departure_date || '',
          returnDate: tripData.return_date || '',
          passengers: tripData.passenger_count || 0
        };
        console.log('ChatPage - Loaded trip details from database:', loadedTripDetails);
        setTripDetails(loadedTripDetails);
      } else {
        // Redirect if trip doesn't exist or user doesn't own it
        router.push('/trips');
        return;
      }

      // Load chat history
      const dbMessages = await MessageServiceClient.getMessagesByTripId(tripId);
      if (dbMessages && dbMessages.length > 0) {
        // Convert DB messages to ChatMessage format
        const chatMessages = dbMessages.map((msg, idx) => ({
          id: idx + 1,
          type: msg.type,
          content: msg.content,
          timestamp: new Date(msg.timestamp),
          cards: msg.cards && typeof msg.cards === 'string' && msg.cards.trim() !== '' ? JSON.parse(msg.cards) : undefined,
          followUp: msg.follow_up,
          tripContext: msg.trip_context && typeof msg.trip_context === 'string' && msg.trip_context.trim() !== '' ? JSON.parse(msg.trip_context) : undefined
        }));
        setMessages(chatMessages);
        console.log('ChatPage - Loaded chat history:', chatMessages.length, 'messages');
      } else {
        // No messages yet, set initial welcome message
        setMessages([{
          id: 1,
          type: 'ai',
          content: "Hi! I'm your AI travel assistant. I can help you plan your perfect trip! Tell me where you'd like to go, when you're traveling, and how many people are coming along.",
          timestamp: new Date()
        }]);
        console.log('ChatPage - No chat history found, set initial welcome message');
      }
    } catch (error) {
      console.error('Error loading trip and chat history:', error);
      router.push('/trips');
      return;
    } finally {
      setLoading(false);
      setChatHistoryLoading(false);
    }
  };

  // Set up realtime subscription for trip changes
  useEffect(() => {
    if (tripId && user) {
      console.log('ChatPage - Setting up realtime subscription for trip:', tripId);
      
      const subscription = tripService.subscribeToTrip(tripId, (updatedTrip) => {
        console.log('ChatPage - Realtime trip update received:', updatedTrip);
        
        if (updatedTrip) {
          // Update trip state
          setTrip(updatedTrip);
          
          // Update trip details from database
          const updatedTripDetails = {
            from: updatedTrip.origin || '',
            to: updatedTrip.destination || '',
            departDate: updatedTrip.departure_date || '',
            returnDate: updatedTrip.return_date || '',
            passengers: updatedTrip.passenger_count || 0
          };
          
          console.log('ChatPage - Updated trip details from realtime:', updatedTripDetails);
          setTripDetails(updatedTripDetails);
        } else {
          // Trip was deleted, redirect to trips page
          console.log('ChatPage - Trip was deleted, redirecting to trips page');
          router.push('/trips');
        }
      });

      setRealtimeSubscription(subscription);

      // Cleanup subscription on unmount or when tripId/user changes
      return () => {
        console.log('ChatPage - Cleaning up realtime subscription');
        tripService.unsubscribe(subscription);
      };
    }
  }, [tripId, user, router]);

  // Clean up any invalid messages on component mount
  React.useEffect(() => {
    setMessages(prev => prev.filter(msg => 
      msg && msg.content && typeof msg.content === 'string' && msg.content.trim() !== ''
    ));
  }, []);

  const handleSendMessage = useCallback(async (message: string, currency?: string) => {
    if (!message || typeof message !== 'string' || message.trim() === '') {
      console.error('Invalid message:', message);
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now(),
      type: 'user',
      content: message.trim(),
      timestamp: new Date()
    };

    // Add user message immediately and get the updated messages for API call
    let updatedMessages: ChatMessage[] = [];
    setMessages(prevMessages => {
      // Remove any empty/invalid messages
      const cleanPrev = prevMessages.filter(msg => msg && msg.content && typeof msg.content === 'string' && msg.content.trim() !== '');
      updatedMessages = [...cleanPrev, userMessage];
      console.log('ChatPage - Adding user message to state:', userMessage);
      console.log('ChatPage - Updated messages after adding user message:', updatedMessages);
      return updatedMessages;
    });

    setIsLoading(true);

    try {
      // Send message to backend API with tripId and currency
      const aiResponse = await sendChatMessage({
        message,
        conversationHistory: updatedMessages,
        tripId: tripId,
        currency: currency || 'EUR'
      });

      if (aiResponse && aiResponse.content && typeof aiResponse.content === 'string') {
        if (aiResponse.tripContext) {
          // Update trip details if AI provided new context
          const hasChanges = 
            aiResponse.tripContext.from !== tripDetails.from ||
            aiResponse.tripContext.to !== tripDetails.to ||
            aiResponse.tripContext.departDate !== tripDetails.departDate ||
            aiResponse.tripContext.returnDate !== tripDetails.returnDate ||
            aiResponse.tripContext.passengers !== tripDetails.passengers;
          if (hasChanges) {
            setTripDetails(aiResponse.tripContext);
          }
        }
        setMessages(prev => [...prev, aiResponse]);
      } else {
        throw new Error('Invalid response from AI');
      }
    } catch (error) {
      let errorMessage: ChatMessage;
      const referralBonus = parseInt(process.env.NEXT_PUBLIC_MESSAGE_COUNTER_REFERRAL_BONUS || '25');
      if (error && typeof error === 'object' && 'type' in error) {
        const chatError = error as ChatError;
        switch (chatError.type) {
          case 'insufficient_messages':
            errorMessage = {
              id: Date.now() + 1,
              type: 'ai',
              content: `I'd love to help you plan your trip, but you've run out of messages! Please get more messages to continue our conversation. You can share your invitation link with friends to earn ${referralBonus} bonus messages for each successful signup.`,
              timestamp: new Date()
            };
            break;
          case 'rate_limit':
            errorMessage = {
              id: Date.now() + 1,
              type: 'ai',
              content: "I'm receiving too many requests right now. Please wait a moment and try again.",
              timestamp: new Date()
            };
            break;
          case 'validation':
            errorMessage = {
              id: Date.now() + 1,
              type: 'ai',
              content: "I couldn't understand your request. Please try rephrasing your message.",
              timestamp: new Date()
            };
            break;
          case 'network_error':
            errorMessage = {
              id: Date.now() + 1,
              type: 'ai',
              content: "I'm having trouble connecting to my services. Please check your internet connection and try again.",
              timestamp: new Date()
            };
            break;
          default:
            errorMessage = {
              id: Date.now() + 1,
              type: 'ai',
              content: "I'm sorry, something went wrong. Please try again.",
              timestamp: new Date()
            };
        }
      } else {
        errorMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: "I'm sorry, something went wrong. Please try again.",
          timestamp: new Date()
        };
      }
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [tripId]); // Removed tripDetails from dependencies to prevent recreation

  // Handle initial message from URL parameter
  useEffect(() => {
    if (initialMessage && !initialMessageProcessedRef.current && !loading && !chatHistoryLoading) {
      console.log('ChatPage - Sending initial message from URL:', initialMessage);
      
      // Mark as processed immediately to prevent race conditions
      initialMessageProcessedRef.current = true;
      
      // Send the message immediately
      handleSendMessage(initialMessage);
      
      // Clean up the URL parameter
      const url = new URL(window.location.href);
      url.searchParams.delete('message');
      window.history.replaceState({}, '', url.toString());
    }
  }, [initialMessage, loading, chatHistoryLoading, handleSendMessage]);

  const handleRemoveFromTripPlan = (id: number) => {
    setTripPlan(prev => prev.filter(item => item.id !== id));
  };

  const handleTripDetailsChange = (newDetails: TripDetails) => {
    setTripDetails(newDetails);
  };

  const handleAddToTripPlan = (card: Card) => {
    const newItem = {
      ...card,
      id: Date.now()
    };
    setTripPlan(prev => [...prev, newItem]);
  };

  const handleGetMoreMessages = () => {
    setShowGetMoreMessagesModal(true);
  };

  if (loading || chatHistoryLoading) {
    return (
      <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your trip and chat history...</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Trip not found</p>
          <button 
            onClick={() => router.push('/trips')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            View My Trips
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full py-8">


        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
          {/* Trip Details Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3 h-full min-h-[400px] lg:min-h-0"
          >
            <TripDetailsSidebar 
              tripDetails={tripDetails}
              onTripDetailsChange={handleTripDetailsChange}
              onGetMoreMessages={handleGetMoreMessages}
            />
          </motion.div>

          {/* Chat Window */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-6 h-full min-h-[500px] lg:min-h-0"
          >
            <ChatWindow 
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              tripDetails={tripDetails}
              onAddToTripPlan={handleAddToTripPlan}
              currency={currency}
              onCurrencyChange={setCurrency}
              showGetMoreMessagesModal={showGetMoreMessagesModal}
              onOpenGetMoreMessagesModal={() => setShowGetMoreMessagesModal(true)}
              onCloseGetMoreMessagesModal={() => setShowGetMoreMessagesModal(false)}
            />
          </motion.div>

          {/* Trip Plan Stack */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3 h-full min-h-[400px] lg:min-h-0"
          >
            <TripPlanStack 
              tripPlan={tripPlan}
              onRemoveItem={handleRemoveFromTripPlan}
              onAddItem={handleAddToTripPlan}
            />
          </motion.div>
        </div>
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