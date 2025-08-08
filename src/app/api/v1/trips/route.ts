import { NextRequest, NextResponse } from 'next/server';
import { loadMockData, simulateDelay } from '@/lib/utils/mock-data';

export async function GET(request: NextRequest) {
  try {
    await simulateDelay();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            type: 'validation',
            message: 'User ID is required',
            status: 400,
            code: 'MISSING_USER_ID'
          }
        },
        { status: 400 }
      );
    }

    const mockData = loadMockData('trips.json');
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

    // Filter trips by user ID
    const userTrips = mockData.trips.filter((trip: any) => trip.user_id === userId);

    return NextResponse.json({
      success: true,
      data: userTrips
    });
  } catch (error) {
    console.error('Trips API error:', error);
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

export async function POST(request: NextRequest) {
  try {
    await simulateDelay();
    
    const body = await request.json();
    
    if (!body.userId || !body.name) {
      return NextResponse.json(
        {
          success: false,
          error: {
            type: 'validation',
            message: 'User ID and trip name are required',
            status: 400,
            code: 'MISSING_REQUIRED_FIELDS'
          }
        },
        { status: 400 }
      );
    }

    // Create a new trip with mock data
    const newTrip = {
      id: `trip-${Date.now()}`,
      user_id: body.userId,
      name: body.name,
      description: body.description || '',
      origin: body.origin || '',
      destination: body.destination || '',
      departure_date: body.departure_date || '',
      return_date: body.return_date || '',
      passenger_count: body.passenger_count || 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: newTrip
    });
  } catch (error) {
    console.error('Trips API error:', error);
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