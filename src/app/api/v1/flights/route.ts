import { NextRequest, NextResponse } from 'next/server';
import { loadMockData, simulateDelay, getRandomItems } from '@/lib/utils/mock-data';

export async function GET(request: NextRequest) {
  try {
    await simulateDelay();
    
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'search':
        return await handleFlightSearch(request);
      case 'popular-routes':
        return await handlePopularRoutes();
      case 'airports':
        const query = searchParams.get('query');
        if (!query) {
          return NextResponse.json(
            {
              success: false,
              error: {
                type: 'validation',
                message: 'Query parameter is required for airport search',
                status: 400,
                code: 'MISSING_QUERY'
              }
            },
            { status: 400 }
          );
        }
        return await handleAirportSearch(query);
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
    console.error('Flights API error:', error);
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

async function handleFlightSearch(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const searchRequest = {
    origin: searchParams.get('origin') || '',
    destination: searchParams.get('destination') || '',
    departureDate: searchParams.get('departureDate') || '',
    returnDate: searchParams.get('returnDate') || undefined,
    passengers: parseInt(searchParams.get('passengers') || '1'),
    currency: searchParams.get('currency') || 'USD',
    maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined,
    cabinClass: searchParams.get('cabinClass') || undefined
  };

  const mockData = loadMockData('flights.json');
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

  // Filter flights based on search criteria
  let filteredFlights = mockData.search_results;
  
  if (searchRequest.origin) {
    filteredFlights = filteredFlights.filter((flight: any) => 
      flight.origin.toLowerCase().includes(searchRequest.origin.toLowerCase())
    );
  }
  
  if (searchRequest.destination) {
    filteredFlights = filteredFlights.filter((flight: any) => 
      flight.destination.toLowerCase().includes(searchRequest.destination.toLowerCase())
    );
  }

  // Limit results to 3 flights
  const results = getRandomItems(filteredFlights, 3);

  return NextResponse.json({
    success: true,
    data: results
  });
}

async function handlePopularRoutes() {
  const mockData = loadMockData('flights.json');
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
    data: mockData.popular_routes
  });
}

async function handleAirportSearch(query: string) {
  const mockData = loadMockData('flights.json');
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

  // Filter airports based on query
  const filteredAirports = mockData.airports.filter((airport: any) => 
    airport.name.toLowerCase().includes(query.toLowerCase()) ||
    airport.code.toLowerCase().includes(query.toLowerCase()) ||
    airport.city.toLowerCase().includes(query.toLowerCase())
  );

  return NextResponse.json({
    success: true,
    data: filteredAirports
  });
} 