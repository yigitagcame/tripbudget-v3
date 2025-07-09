'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TripDetailsSidebar from '@/components/chat/TripDetailsSidebar';
import TripPlanStack from '@/components/chat/TripPlanStack';
import ChatWindow from '@/components/chat/ChatWindow';
import { sendChatMessage, type ChatMessage, type TripDetails, type Card } from '@/lib/chat-api';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ChatPage() {
  const [tripDetails, setTripDetails] = useState<TripDetails>({
    from: '',
    to: '',
    departDate: '',
    returnDate: '',
    passengers: 0
  });

  const [tripPlan, setTripPlan] = useState<any[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      type: 'ai',
      content: "Hi! I'm your AI travel assistant. I can help you plan your perfect trip! Tell me where you'd like to go, when you're traveling, and how many people are coming along.",
      timestamp: new Date()
    }
  ]);

  // Clean up any invalid messages on component mount
  React.useEffect(() => {
    setMessages(prev => prev.filter(msg => 
      msg && msg.content && typeof msg.content === 'string' && msg.content.trim() !== ''
    ));
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (message: string) => {
    // Validate message
    if (!message || typeof message !== 'string' || message.trim() === '') {
      console.error('Invalid message:', message);
      return;
    }

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now(),
      type: 'user',
      content: message.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);

    // Set loading state
    setIsLoading(true);

    try {
      // Clean conversation history to remove any messages with null/undefined content
      const cleanConversationHistory = messages.filter(msg => 
        msg && msg.content && typeof msg.content === 'string' && msg.content.trim() !== ''
      );

      // Add the current user message to the conversation history for the API
      const conversationHistoryWithCurrentMessage = [...cleanConversationHistory, userMessage];

      console.log('ChatPage - Sending conversation history:', conversationHistoryWithCurrentMessage);

      // Send message to backend API
      const aiResponse = await sendChatMessage({
        message,
        conversationHistory: conversationHistoryWithCurrentMessage
      });
      
      // Validate AI response before adding to messages
      if (aiResponse && aiResponse.content && typeof aiResponse.content === 'string') {
        // Update trip details from AI response
        if (aiResponse.tripContext) {
          console.log('ChatPage - Updating trip details from AI response:', aiResponse.tripContext);
          setTripDetails(aiResponse.tripContext);
        } else {
          console.log('ChatPage - No tripContext in AI response');
        }
        
        setMessages(prev => [...prev, aiResponse]);
      } else {
        console.error('Invalid AI response:', aiResponse);
        throw new Error('Invalid response from AI');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: "I'm sorry, I encountered an error while processing your message. Please try again.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <ProtectedRoute>
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
    </ProtectedRoute>
  );
} 