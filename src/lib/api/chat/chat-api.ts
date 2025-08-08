// Types for chat functionality
export interface ChatMessage {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  cards?: Card[];
  followUp?: string;
  tripContext?: TripDetails;
}

export interface TripDetails {
  from: string;
  to: string;
  departDate: string;
  returnDate: string;
  passengers: number;
}

export interface Card {
  type: 'flight' | 'hotel' | 'restaurant' | 'activity' | 'transport' | 'place' | 'destination' | 'package' | 'seasonal';
  title: string;
  description: string;
  price?: string;
  rating?: number;
  location?: string;
  image?: string;
  bookingUrl?: string;
}

export interface ChatRequest {
  message: string;
  conversationHistory: ChatMessage[];
  tripId?: string; // Add tripId to request
  currency?: string; // Add currency to request
}

export interface ChatResponse {
  id: number;
  type: 'ai';
  content: string;
  timestamp: Date;
  cards: Card[];
  followUp: string;
  tripContext: TripDetails;
  tripId?: string; // Add tripId to response
  intent?: string; // Detected user intent
  functionToCall?: string; // Function to be called (optional)
}

export interface ChatError {
  type: 'insufficient_messages' | 'rate_limit' | 'validation' | 'server_error' | 'network_error';
  message: string;
  status: number;
  messageCount?: number;
}

// Function to send a message to the chat API
export async function sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Handle specific error types
      if (response.status === 402) {
        const error: ChatError = {
          type: 'insufficient_messages',
          message: errorData.message || 'You have run out of messages. Please earn more messages to continue chatting.',
          status: 402,
          messageCount: errorData.messageCount || 0
        };
        throw error;
      }
      
      if (response.status === 429) {
        const error: ChatError = {
          type: 'rate_limit',
          message: errorData.message || 'Rate limit exceeded. Please try again later.',
          status: 429
        };
        throw error;
      }
      
      if (response.status === 400) {
        const error: ChatError = {
          type: 'validation',
          message: errorData.message || 'Invalid request. Please check your input and try again.',
          status: 400
        };
        throw error;
      }
      
      // Generic server error
      const error: ChatError = {
        type: 'server_error',
        message: errorData.message || 'Server error occurred. Please try again later.',
        status: response.status
      };
      throw error;
    }

    const data = await response.json();
    
    // Convert timestamp string back to Date object
    return {
      ...data,
      timestamp: new Date(data.timestamp)
    };
  } catch (error) {
    console.error('Error sending chat message:', error);
    
    // If it's already a ChatError, re-throw it
    if (error && typeof error === 'object' && 'type' in error) {
      throw error;
    }
    
    // Handle network errors
    const networkError: ChatError = {
      type: 'network_error',
      message: 'Network connection error. Please check your internet connection and try again.',
      status: 0
    };
    throw networkError;
  }
}

 