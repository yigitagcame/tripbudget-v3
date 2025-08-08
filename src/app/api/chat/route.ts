import { NextRequest, NextResponse } from 'next/server';
import { loadMockData, simulateDelay, getRandomItem } from '@/lib/utils/mock-data';

export async function POST(request: NextRequest) {
  try {
    await simulateDelay();
    
    const body = await request.json();
    const { message, conversationHistory = [], tripId, currency = 'EUR' } = body;

    console.log('API - Received message:', message);
    console.log('API - Received conversation history length:', conversationHistory.length);
    console.log('API - Received tripId:', tripId);
    console.log('API - Received currency:', currency);

    // Validate conversation history is an array
    if (!Array.isArray(conversationHistory)) {
      return NextResponse.json(
        { error: 'Conversation history must be an array' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json(
        { error: 'Message is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    // Validate tripId is provided
    if (!tripId) {
      return NextResponse.json(
        { error: 'Trip ID is required' },
        { status: 400 }
      );
    }

    const mockData = loadMockData('chat.json');
    if (!mockData) {
      return NextResponse.json(
        {
          success: false,
          error: {
            type: 'server',
            message: 'Failed to load mock data',
            status: 500,
            code: 'MOCK_DATA_ERROR'
          }
        },
        { status: 500 }
      );
    }

    // Get a random chat response
    const chatResponse = getRandomItem(mockData.responses);
    
    // Create the response object
    const response = {
      id: Date.now(),
      type: 'ai' as const,
      content: chatResponse.message,
      cards: chatResponse.suggestions || [],
      followUp: chatResponse.followUpMessage,
      tripContext: chatResponse.tripContext,
      tripId: tripId,
      timestamp: new Date()
    };

    console.log('API - Final response tripContext:', response.tripContext);

    return NextResponse.json(response);

  } catch (error) {
    console.error('Chat API error:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('Invalid value for \'content\'')) {
        return NextResponse.json(
          { error: 'Invalid message content detected. Please try again.' },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 