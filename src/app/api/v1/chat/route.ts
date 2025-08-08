import { NextRequest, NextResponse } from 'next/server';
import { loadMockData, simulateDelay, getRandomItem } from '@/lib/utils/mock-data';

export async function POST(request: NextRequest) {
  try {
    await simulateDelay();
    
    const body = await request.json();
    
    // Extract user ID from request (this would typically come from authentication)
    const userId = body.userId || 'anonymous';
    
    if (!body.message || typeof body.message !== 'string' || body.message.trim() === '') {
      return NextResponse.json(
        { error: 'Message is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    // Validate tripId is provided
    if (!body.tripId) {
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
      tripId: body.tripId,
      timestamp: new Date()
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          type: 'server',
          message: 'Internal server error',
          status: 500,
          code: 'INTERNAL_SERVER_ERROR'
        }
      },
      { status: 500 }
    );
  }
} 