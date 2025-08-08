import { NextRequest, NextResponse } from 'next/server';
import { loadMockData, simulateDelay, getRandomItem } from '@/lib/utils/mock-data';

export async function POST(request: NextRequest) {
  try {
    await simulateDelay();
    
    const body = await request.json();
    const { message, tripId } = body;

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
      message: chatResponse.message,
      cards: chatResponse.suggestions || [],
      followUpMessage: chatResponse.followUpMessage,
      tripContext: chatResponse.tripContext,
      intent: chatResponse.intent || 'general_inquiry',
      functionToCall: chatResponse.functionToCall || null,
      model: "gemini-2.5-flash"
    };

    console.log('Gemini API - Final response tripContext:', response.tripContext);

    return NextResponse.json(response);

  } catch (error) {
    console.error('Gemini API error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 