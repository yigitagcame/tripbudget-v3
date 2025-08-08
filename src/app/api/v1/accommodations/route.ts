import { NextRequest, NextResponse } from 'next/server';
import { loadMockData, simulateDelay, getRandomItems } from '@/lib/utils/mock-data';

export async function GET(request: NextRequest) {
  try {
    await simulateDelay();
    
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'search':
        return await handleAccommodationSearch(request);
      case 'popular-destinations':
        return await handlePopularDestinations();
      case 'amenities':
        return await handleAmenities();
      case 'destinations':
        const query = searchParams.get('query');
        if (!query) {
          return NextResponse.json(
            {
              success: false,
              error: {
                type: 'validation',
                message: 'Query parameter is required for destination search',
                status: 400,
                code: 'MISSING_QUERY'
              }
            },
            { status: 400 }
          );
        }
        return await handleDestinationSearch(query);
      default:
        return NextResponse.json(
          {
            success: false,
            error: {
              type: 'validation',
              message: 'Invalid action parameter',
              status: 400,
              code: 'INVALID_ACTION'
            }
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Accommodations API error:', error);
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

async function handleAccommodationSearch(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const searchRequest = {
    destination: searchParams.get('destination') || '',
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
    guests: parseInt(searchParams.get('guests') || '1'),
    rooms: parseInt(searchParams.get('rooms') || '1'),
    currency: searchParams.get('currency') || 'USD',
    maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined,
    amenities: searchParams.get('amenities') ? searchParams.get('amenities')!.split(',') : undefined,
    rating: searchParams.get('rating') ? parseInt(searchParams.get('rating')!) : undefined
  };

  const mockData = loadMockData('accommodations.json');
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

  // Filter accommodations based on search criteria
  let filteredAccommodations = mockData.search_results;
  
  if (searchRequest.destination) {
    filteredAccommodations = filteredAccommodations.filter((hotel: any) => 
      hotel.name.toLowerCase().includes(searchRequest.destination.toLowerCase()) ||
      hotel.location.latitude === 48.8566 // Paris coordinates as example
    );
  }

  // Limit results to 3 hotels
  const results = getRandomItems(filteredAccommodations, 3);

  return NextResponse.json({
    success: true,
    data: results
  });
}

async function handlePopularDestinations() {
  const mockData = loadMockData('accommodations.json');
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

  return NextResponse.json({
    success: true,
    data: mockData.popular_destinations
  });
}

async function handleAmenities() {
  const mockData = loadMockData('accommodations.json');
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

  return NextResponse.json({
    success: true,
    data: mockData.amenities
  });
}

async function handleDestinationSearch(query: string) {
  const mockData = loadMockData('accommodations.json');
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

  // Filter destinations based on query
  const filteredDestinations = mockData.destinations.filter((destination: any) => 
    destination.name.toLowerCase().includes(query.toLowerCase()) ||
    destination.country.toLowerCase().includes(query.toLowerCase())
  );

  return NextResponse.json({
    success: true,
    data: filteredDestinations
  });
} 