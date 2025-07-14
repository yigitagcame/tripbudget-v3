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
  type: 'flight' | 'hotel' | 'restaurant' | 'activity' | 'transport' | 'place';
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
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Convert timestamp string back to Date object
    return {
      ...data,
      timestamp: new Date(data.timestamp)
    };
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
}

 