import { searchDestinations, searchHotels } from '../../api/accommodation/booking-api';
import { formatDateForBookingAPI, convertSearchType, getSortParameter } from '../../api/accommodation/accommodation-transformer';

export const accommodationSearchFunction = {
  type: 'function' as const,
  function: {
    name: 'search_accommodation',
    description: 'Search for available accommodation using the Booking.com API',
    parameters: {
      type: 'object',
      properties: {
        destination: {
          type: 'string',
          description: 'Destination location (city, country, or region). Examples: "London", "Paris", "New York"'
        },
        arrival_date: {
          type: 'string',
          description: 'Check-in date in yyyy-mm-dd format. Example: "2024-04-01"'
        },
        departure_date: {
          type: 'string',
          description: 'Check-out date in yyyy-mm-dd format. Example: "2024-04-08"'
        },
        adults: {
          type: 'number',
          description: 'Number of adult guests (default: 1)',
          minimum: 1,
          maximum: 30
        },
        children: {
          type: 'number',
          description: 'Number of children (default: 0)',
          minimum: 0,
          maximum: 10
        },
        rooms: {
          type: 'number',
          description: 'Number of rooms needed (default: 1)',
          minimum: 1,
          maximum: 30
        },
        search_type: {
          type: 'string',
          description: 'Type of accommodation search',
          enum: ['budget', 'mid_range', 'luxury', 'best'],
          default: 'best'
        },
        sort_by: {
          type: 'string',
          description: 'Sort results by',
          enum: ['price', 'rating', 'distance', 'popularity'],
          default: 'popularity'
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results (max 20)',
          minimum: 1,
          maximum: 20,
          default: 5
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

    // Step 2: Use the first destination result to search for hotels
    const destination = destinationResults.data[0];
    const searchType = convertSearchType(args.search_type || 'best');
    const sortBy = getSortParameter(args.sort_by || 'popularity');
    
    const hotelResults = await searchHotels({
      dest_id: destination.dest_id,
      search_type: searchType,
      arrival_date: formatDateForBookingAPI(args.arrival_date),
      departure_date: formatDateForBookingAPI(args.departure_date),
      adults: args.adults || 1,
      children_age: args.children ? Array(args.children).fill(8).join(',') : undefined,
      room_qty: args.rooms || 1,
      sort_by: sortBy,
      currency_code: 'USD',
      languagecode: args.languagecode || 'en-us'
    });

    if (!hotelResults.data || !hotelResults.data.hotels || hotelResults.data.hotels.length === 0) {
      return {
        success: false,
        error: `No accommodation found for "${args.destination}" with the specified criteria. Please try different dates or search parameters.`
      };
    }

    return {
      success: true,
      data: hotelResults.data.hotels,
      search_type: args.search_type || 'best',
      destination: destination
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
} 