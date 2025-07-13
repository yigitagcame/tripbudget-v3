import { searchFlights } from './tequila-api';
import { searchDestinations, searchHotels } from './booking-api';
import { convertCityToAirportCode } from './validation';
import { formatDateForBookingAPI, convertSearchType, getSortParameter } from './accommodation-transformer';

export const flightSearchFunction = {
  type: 'function' as const,
  function: {
    name: 'search_flights',
    description: 'Search for available flights using the Tequila Flight API',
    parameters: {
      type: 'object',
      properties: {
        fly_from: {
          type: 'string',
          description: 'Departure location (IATA airport code, city code, or country code). Examples: "LON", "LHR", "UK", "city:LON", "airport:LHR"'
        },
        fly_to: {
          type: 'string',
          description: 'Destination location (IATA airport code, city code, or country code). Examples: "NYC", "JFK", "US"'
        },
        date_from: {
          type: 'string',
          description: 'Departure date range start in dd/mm/yyyy format. Example: "01/04/2024"'
        },
        date_to: {
          type: 'string',
          description: 'Departure date range end in dd/mm/yyyy format. Example: "03/04/2024"'
        },
        return_from: {
          type: 'string',
          description: 'Return flight departure date in dd/mm/yyyy format. Example: "08/04/2024"'
        },
        return_to: {
          type: 'string',
          description: 'Return flight departure date end in dd/mm/yyyy format. Example: "10/04/2024"'
        },
        adults: {
          type: 'number',
          description: 'Number of adult passengers (default: 1)',
          minimum: 1,
          maximum: 9
        },
        children: {
          type: 'number',
          description: 'Number of child passengers (default: 0)',
          minimum: 0,
          maximum: 9
        },
        infants: {
          type: 'number',
          description: 'Number of infant passengers (default: 0)',
          minimum: 0,
          maximum: 9
        },
        selected_cabins: {
          type: 'string',
          description: 'Preferred cabin class. M=economy, W=economy premium, C=business, F=first class',
          enum: ['M', 'W', 'C', 'F']
        },
        curr: {
          type: 'string',
          description: 'Currency for pricing. Default: USD',
          default: 'USD'
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results (max 1000)',
          minimum: 1,
          maximum: 1000,
          default: 2
        },
        sort: {
          type: 'string',
          description: 'Sort results by',
          enum: ['price', 'duration', 'quality', 'date'],
          default: 'price'
        },
        search_type: {
          type: 'string',
          description: 'Type of flight search to perform',
          enum: ['cheapest', 'fastest', 'best'],
          default: 'best'
        }
      },
      required: ['fly_from', 'date_from', 'date_to']
    }
  }
}

export async function executeAccommodationSearch(args: any) {
  try {
    // Step 1: Search for destination
    const destinationResults = await searchDestinations({ query: args.destination });
    
    if (!destinationResults.data || destinationResults.data.length === 0) {
      return {
        success: false,
        error: `No destinations found for "${args.destination}". Please try a different location.`
      };
    }
    
    // Use the first destination result
    const destination = destinationResults.data[0];
    
    // Step 2: Search for hotels
    const formattedArrival = formatDateForBookingAPI(args.arrival_date);
    const formattedDeparture = formatDateForBookingAPI(args.departure_date);
    const hotelSearchParams: any = {
      dest_id: destination.dest_id,
      search_type: convertSearchType(destination.type),
      arrival_date: formattedArrival,
      departure_date: formattedDeparture,
      adults: args.adults || 1,
      children_age: args.children_age || undefined,
      room_qty: args.room_qty || 1,
      page_number: 1,
      sort_by: getSortParameter(args.search_type || 'best'),
      currency_code: args.currency_code || 'USD',
      languagecode: args.languagecode || 'en-us'
    };
    
    // Add price filters for budget search
    if (args.search_type === 'budget') {
      hotelSearchParams.price_max = 200; // Budget limit
    }
    
    const hotelResults = await searchHotels(hotelSearchParams);
    
    if (!hotelResults.data?.hotels || hotelResults.data.hotels.length === 0) {
      return {
        success: false,
        error: `No hotels found for "${args.destination}" on the specified dates. Please try different dates or location.`
      };
    }
    
    return {
      success: true,
      data: hotelResults.data.hotels,
      destination: destination,
      search_type: args.search_type || 'best'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

export const accommodationSearchFunction = {
  type: 'function' as const,
  function: {
    name: 'search_accommodation',
    description: 'Search for hotel accommodations using the Booking.com API',
    parameters: {
      type: 'object',
      properties: {
        destination: {
          type: 'string',
          description: 'Destination name (city, district, landmark, etc.). Example: "New York", "Manhattan", "Times Square"'
        },
        arrival_date: {
          type: 'string',
          description: 'Check-in date in YYYY-MM-DD format. Example: "2024-04-01"'
        },
        departure_date: {
          type: 'string',
          description: 'Check-out date in YYYY-MM-DD format. Example: "2024-04-05"'
        },
        adults: {
          type: 'number',
          description: 'Number of adult guests (default: 1)',
          minimum: 1,
          maximum: 30
        },
        children_age: {
          type: 'string',
          description: 'Children ages as comma-separated string. Example: "5,12" for a 5-year-old and 12-year-old',
          default: ''
        },
        room_qty: {
          type: 'number',
          description: 'Number of rooms (default: 1)',
          minimum: 1,
          maximum: 30,
          default: 1
        },
        search_type: {
          type: 'string',
          description: 'Type of accommodation search to perform',
          enum: ['budget', 'luxury', 'best'],
          default: 'best'
        },
        currency_code: {
          type: 'string',
          description: 'Currency for pricing. Default: USD',
          default: 'USD'
        },
        languagecode: {
          type: 'string',
          description: 'Language code. Default: en-us',
          default: 'en-us'
        }
      },
      required: ['destination', 'arrival_date', 'departure_date']
    }
  }
};

export async function executeFlightSearch(args: any) {
  // Convert city names to airport codes for fly_from and fly_to
  if (args.fly_from) args.fly_from = convertCityToAirportCode(args.fly_from);
  if (args.fly_to) args.fly_to = convertCityToAirportCode(args.fly_to);
  
  // Set default search type if not provided
  if (!args.search_type) {
    args.search_type = 'best';
  }
  
  // Configure search parameters based on search type
  switch (args.search_type) {
    case 'cheapest':
      args.sort = 'price';
      args.limit = 2;
      break;
    case 'fastest':
      args.sort = 'duration';
      args.limit = 2;
      break;
    case 'best':
    default:
      args.sort = 'quality';
      args.limit = 2;
      break;
  }
  
  try {
    const result = await searchFlights(args);
    return {
      success: true,
      data: result.data,
      currency: result.currency,
      search_id: result.search_id,
      search_type: args.search_type
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
} 