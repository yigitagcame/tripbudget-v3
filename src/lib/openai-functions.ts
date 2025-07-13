import { searchFlights } from './tequila-api';
import { convertCityToAirportCode } from './validation';

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