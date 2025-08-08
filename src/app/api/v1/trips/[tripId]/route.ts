import { NextRequest, NextResponse } from 'next/server';
import { loadMockData, simulateDelay } from '@/lib/utils/mock-data';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ tripId: string }> }
) {
  try {
    await simulateDelay();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const { tripId } = await context.params;

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

    // Find the specific trip
    const trip = mockData.trips.find((t: any) => t.id === tripId && t.user_id === userId);
    
    if (!trip) {
      return NextResponse.json(
        {
          success: false,
          error: {
            type: 'not_found',
            message: 'Trip not found',
            status: 404,
            code: 'TRIP_NOT_FOUND'
          }
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: trip
    });
  } catch (error) {
    console.error('Trip API error:', error);
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

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ tripId: string }> }
) {
  try {
    await simulateDelay();
    
    const body = await request.json();
    const { tripId } = await context.params;
    
    if (!body.userId) {
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

    // Find and update the trip
    const tripIndex = mockData.trips.findIndex((t: any) => t.id === tripId && t.user_id === body.userId);
    
    if (tripIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: {
            type: 'not_found',
            message: 'Trip not found',
            status: 404,
            code: 'TRIP_NOT_FOUND'
          }
        },
        { status: 404 }
      );
    }

    // Update the trip
    const updatedTrip = {
      ...mockData.trips[tripIndex],
      name: body.name || mockData.trips[tripIndex].name,
      description: body.description || mockData.trips[tripIndex].description,
      origin: body.origin || mockData.trips[tripIndex].origin,
      destination: body.destination || mockData.trips[tripIndex].destination,
      departure_date: body.departure_date || mockData.trips[tripIndex].departure_date,
      return_date: body.return_date || mockData.trips[tripIndex].return_date,
      passenger_count: body.passenger_count || mockData.trips[tripIndex].passenger_count,
      updated_at: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: updatedTrip
    });
  } catch (error) {
    console.error('Trip API error:', error);
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

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ tripId: string }> }
) {
  try {
    await simulateDelay();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const { tripId } = await context.params;

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

    // Find the trip to delete
    const trip = mockData.trips.find((t: any) => t.id === tripId && t.user_id === userId);
    
    if (!trip) {
      return NextResponse.json(
        {
          success: false,
          error: {
            type: 'not_found',
            message: 'Trip not found',
            status: 404,
            code: 'TRIP_NOT_FOUND'
          }
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Trip deleted successfully'
    });
  } catch (error) {
    console.error('Trip API error:', error);
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