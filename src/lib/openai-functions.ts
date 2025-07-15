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
  if (args.date_from) args.date_from = ensureFutureDate(args.date_from, 'dd/mm/yyyy');
  if (args.date_to) args.date_to = ensureFutureDate(args.date_to, 'dd/mm/yyyy');
  if (args.return_from) args.return_from = ensureFutureDate(args.return_from, 'dd/mm/yyyy');
  if (args.return_to) args.return_to = ensureFutureDate(args.return_to, 'dd/mm/yyyy');
  
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

// Utility to ensure date is not in the past (returns string in same format)
function ensureFutureDate(dateStr: string, format: 'dd/mm/yyyy' | 'yyyy-mm-dd'): string {
  if (!dateStr) return dateStr;
  let date: Date;
  if (format === 'dd/mm/yyyy') {
    const [day, month, year] = dateStr.split('/').map(Number);
    date = new Date(year, month - 1, day);
  } else {
    // yyyy-mm-dd
    const [year, month, day] = dateStr.split('-').map(Number);
    date = new Date(year, month - 1, day);
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date < today) {
    // Set to today
    date = today;
  }
  if (format === 'dd/mm/yyyy') {
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  } else {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
}

// Creative API Function Definitions

export const cheapestDestinationFunction = {
  type: 'function' as const,
  function: {
    name: 'find_cheapest_destination',
    description: 'Find the cheapest destination by comparing total costs (flight + accommodation) across multiple locations',
    parameters: {
      type: 'object',
      properties: {
        fly_from: {
          type: 'string',
          description: 'Departure location (IATA airport code, city code, or country code)'
        },
        date_from: {
          type: 'string',
          description: 'Departure date range start in dd/mm/yyyy format'
        },
        date_to: {
          type: 'string',
          description: 'Departure date range end in dd/mm/yyyy format'
        },
        return_from: {
          type: 'string',
          description: 'Return flight departure date in dd/mm/yyyy format'
        },
        return_to: {
          type: 'string',
          description: 'Return flight departure date end in dd/mm/yyyy format'
        },
        adults: {
          type: 'number',
          description: 'Number of adult passengers (default: 1)',
          minimum: 1,
          maximum: 9,
          default: 1
        },
        duration: {
          type: 'number',
          description: 'Trip duration in days (default: 7)',
          minimum: 1,
          maximum: 30,
          default: 7
        },
        budget: {
          type: 'number',
          description: 'Maximum total budget (optional)',
          minimum: 100
        },
        destinations: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of potential destinations to compare (optional, will use defaults if not provided)',
          default: ['Paris', 'Barcelona', 'Rome', 'Amsterdam', 'Prague', 'Budapest']
        }
      },
      required: ['fly_from', 'date_from', 'date_to']
    }
  }
};

export const packageDealFunction = {
  type: 'function' as const,
  function: {
    name: 'find_package_deal',
    description: 'Find the best combination of flight and accommodation for a given destination and budget',
    parameters: {
      type: 'object',
      properties: {
        fly_from: {
          type: 'string',
          description: 'Departure location (IATA airport code, city code, or country code)'
        },
        destination: {
          type: 'string',
          description: 'Destination name (city, district, landmark, etc.)'
        },
        arrival_date: {
          type: 'string',
          description: 'Check-in date in YYYY-MM-DD format'
        },
        departure_date: {
          type: 'string',
          description: 'Check-out date in YYYY-MM-DD format'
        },
        adults: {
          type: 'number',
          description: 'Number of adult guests (default: 1)',
          minimum: 1,
          maximum: 30,
          default: 1
        },
        budget: {
          type: 'number',
          description: 'Total budget for flight + accommodation (optional)',
          minimum: 100
        },
        flight_priority: {
          type: 'string',
          description: 'Priority for flight selection',
          enum: ['price', 'duration', 'quality'],
          default: 'price'
        },
        accommodation_priority: {
          type: 'string',
          description: 'Priority for accommodation selection',
          enum: ['price', 'quality', 'location'],
          default: 'price'
        }
      },
      required: ['fly_from', 'destination', 'arrival_date', 'departure_date']
    }
  }
};

export const seasonalPriceFunction = {
  type: 'function' as const,
  function: {
    name: 'analyze_seasonal_prices',
    description: 'Analyze flight and accommodation prices across different dates to find the best time to travel',
    parameters: {
      type: 'object',
      properties: {
        fly_from: {
          type: 'string',
          description: 'Departure location (IATA airport code, city code, or country code)'
        },
        fly_to: {
          type: 'string',
          description: 'Destination location (IATA airport code, city code, or country code)'
        },
        start_month: {
          type: 'string',
          description: 'Start month to analyze in YYYY-MM format (e.g., "2024-06")'
        },
        end_month: {
          type: 'string',
          description: 'End month to analyze in YYYY-MM format (e.g., "2024-12")'
        },
        trip_duration: {
          type: 'number',
          description: 'Trip duration in days (default: 7)',
          minimum: 1,
          maximum: 30,
          default: 7
        },
        adults: {
          type: 'number',
          description: 'Number of adult passengers (default: 1)',
          minimum: 1,
          maximum: 9,
          default: 1
        }
      },
      required: ['fly_from', 'fly_to', 'start_month', 'end_month']
    }
  }
};

// Creative API Execution Functions

export async function executeCheapestDestinationSearch(args: any) {
  if (args.date_from) args.date_from = ensureFutureDate(args.date_from, 'dd/mm/yyyy');
  if (args.date_to) args.date_to = ensureFutureDate(args.date_to, 'dd/mm/yyyy');
  if (args.return_from) args.return_from = ensureFutureDate(args.return_from, 'dd/mm/yyyy');
  if (args.return_to) args.return_to = ensureFutureDate(args.return_to, 'dd/mm/yyyy');
  try {
    const results = [];
    const destinations = args.destinations || ['Paris', 'Barcelona', 'Rome', 'Amsterdam', 'Prague', 'Budapest'];
    
    console.log(`Searching for cheapest destination from ${args.fly_from} to ${destinations.length} destinations`);
    
    // Search each destination
    for (const destination of destinations) {
      try {
        // Step 1: Search for flights
        const flightResults = await searchFlights({
          fly_from: args.fly_from,
          fly_to: destination,
          date_from: args.date_from,
          date_to: args.date_to,
          return_from: args.return_from,
          return_to: args.return_to,
          adults: args.adults || 1,
          sort: 'price',
          limit: 1,
          curr: 'USD'
        });
        
        if (!flightResults.data || flightResults.data.length === 0) {
          console.log(`No flights found for ${destination}`);
          continue;
        }
        
        // Step 2: Search for accommodation
        const accommodationResults = await executeAccommodationSearch({
          destination: destination,
          arrival_date: args.date_from.split('/').reverse().join('-'), // Convert dd/mm/yyyy to yyyy-mm-dd
          departure_date: args.return_from ? args.return_from.split('/').reverse().join('-') : 
                         new Date(new Date(args.date_from.split('/').reverse().join('-')).getTime() + (args.duration || 7) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          adults: args.adults || 1,
          search_type: 'budget'
        });
        
        if (accommodationResults.success && accommodationResults.data && accommodationResults.data.length > 0) {
          const flightCost = flightResults.data[0].price;
          const accommodationCost = accommodationResults.data[0].property.priceBreakdown.grossPrice.value * (args.duration || 7);
          const totalCost = flightCost + accommodationCost;
          
          // Check budget constraint if provided
          if (args.budget && totalCost > args.budget) {
            continue;
          }
          
          results.push({
            destination,
            flight: {
              price: flightCost,
              airline: flightResults.data[0].airlines.join(', '),
              duration: flightResults.data[0].duration.total,
              departure: flightResults.data[0].local_departure,
              arrival: flightResults.data[0].local_arrival
            },
            accommodation: {
              name: accommodationResults.data[0].property.name,
              price: accommodationResults.data[0].property.priceBreakdown.grossPrice.value,
              rating: accommodationResults.data[0].property.reviewScore,
              total_cost: accommodationCost
            },
            totalCost,
            dailyCost: totalCost / (args.duration || 7)
          });
        }
      } catch (error) {
        console.error(`Error searching for ${destination}:`, error);
        continue;
      }
    }
    
    // Sort by total cost and return top 3
    results.sort((a, b) => a.totalCost - b.totalCost);
    const topResults = results.slice(0, 3);
    
    return {
      success: true,
      data: topResults,
      search_type: 'cheapest_destination',
      total_searched: destinations.length,
      found_results: results.length
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function executePackageDealSearch(args: any) {
  if (args.arrival_date) args.arrival_date = ensureFutureDate(args.arrival_date, 'yyyy-mm-dd');
  if (args.departure_date) args.departure_date = ensureFutureDate(args.departure_date, 'yyyy-mm-dd');
  try {
    // Step 1: Search for flights
    const flightResults = await searchFlights({
      fly_from: args.fly_from,
      fly_to: args.destination,
      date_from: args.arrival_date.split('-').reverse().join('/'), // Convert yyyy-mm-dd to dd/mm/yyyy
      date_to: args.arrival_date.split('-').reverse().join('/'),
      return_from: args.departure_date.split('-').reverse().join('/'),
      return_to: args.departure_date.split('-').reverse().join('/'),
      adults: args.adults || 1,
      sort: args.flight_priority || 'price',
      limit: 3,
      curr: 'USD'
    });
    
    if (!flightResults.data || flightResults.data.length === 0) {
      return {
        success: false,
        error: `No flights found to ${args.destination}`
      };
    }
    
    // Step 2: Search for accommodation
    const accommodationResults = await executeAccommodationSearch({
      destination: args.destination,
      arrival_date: args.arrival_date,
      departure_date: args.departure_date,
      adults: args.adults || 1,
      search_type: args.accommodation_priority === 'quality' ? 'luxury' : 
                   args.accommodation_priority === 'location' ? 'best' : 'budget'
    });
    
    if (!accommodationResults.success || !accommodationResults.data || accommodationResults.data.length === 0) {
      return {
        success: false,
        error: `No accommodation found in ${args.destination}`
      };
    }
    
    // Step 3: Combine and rank packages
    const packages = [];
    const tripDuration = Math.ceil((new Date(args.departure_date).getTime() - new Date(args.arrival_date).getTime()) / (1000 * 60 * 60 * 24));
    
    for (const flight of flightResults.data.slice(0, 2)) { // Top 2 flights
      for (const accommodation of accommodationResults.data.slice(0, 2)) { // Top 2 accommodations
        const flightCost = flight.price;
        const accommodationCost = accommodation.property.priceBreakdown.grossPrice.value * tripDuration;
        const totalCost = flightCost + accommodationCost;
        
        // Check budget constraint if provided
        if (args.budget && totalCost > args.budget) {
          continue;
        }
        
        packages.push({
          flight: {
            price: flightCost,
            airline: flight.airlines.join(', '),
            duration: flight.duration.total,
            departure: flight.local_departure,
            arrival: flight.local_arrival
          },
          accommodation: {
            name: accommodation.property.name,
            price: accommodation.property.priceBreakdown.grossPrice.value,
            rating: accommodation.property.reviewScore,
            total_cost: accommodationCost
          },
          totalCost,
          dailyCost: totalCost / tripDuration
        });
      }
    }
    
    // Sort by total cost
    packages.sort((a, b) => a.totalCost - b.totalCost);
    
    return {
      success: true,
      data: packages.slice(0, 3), // Return top 3 packages
      search_type: 'package_deal',
      destination: args.destination
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function executeSeasonalPriceAnalysis(args: any) {
  try {
    const results = [];
    const startDate = new Date(args.start_month + '-01');
    const endDate = new Date(args.end_month + '-01');
    
    // Generate sample dates for each month
    const sampleDates = [];
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      // Add 2 sample dates per month (beginning and middle)
      const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const monthMiddle = new Date(currentDate.getFullYear(), currentDate.getMonth(), 15);
      
      sampleDates.push(monthStart);
      sampleDates.push(monthMiddle);
      
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    console.log(`Analyzing prices for ${sampleDates.length} sample dates`);
    
    // Analyze each sample date
    for (const sampleDate of sampleDates) {
      try {
        const dateStr = sampleDate.toISOString().split('T')[0];
        const returnDate = new Date(sampleDate.getTime() + (args.trip_duration || 7) * 24 * 60 * 60 * 1000);
        const returnDateStr = returnDate.toISOString().split('T')[0];
        
        // Search for flights
        const flightResults = await searchFlights({
          fly_from: args.fly_from,
          fly_to: args.fly_to,
          date_from: dateStr.split('-').reverse().join('/'),
          date_to: dateStr.split('-').reverse().join('/'),
          return_from: returnDateStr.split('-').reverse().join('/'),
          return_to: returnDateStr.split('-').reverse().join('/'),
          adults: args.adults || 1,
          sort: 'price',
          limit: 1,
          curr: 'USD'
        });
        
        if (flightResults.data && flightResults.data.length > 0) {
          // Search for accommodation
          const accommodationResults = await executeAccommodationSearch({
            destination: args.fly_to,
            arrival_date: dateStr,
            departure_date: returnDateStr,
            adults: args.adults || 1,
            search_type: 'budget'
          });
          
          if (accommodationResults.success && accommodationResults.data && accommodationResults.data.length > 0) {
            const flightCost = flightResults.data[0].price;
            const accommodationCost = accommodationResults.data[0].property.priceBreakdown.grossPrice.value * (args.trip_duration || 7);
            const totalCost = flightCost + accommodationCost;
            
            results.push({
              date: dateStr,
              month: new Date(dateStr).toLocaleString('default', { month: 'long', year: 'numeric' }),
              flightCost,
              accommodationCost,
              totalCost,
              dailyCost: totalCost / (args.trip_duration || 7)
            });
          }
        }
      } catch (error) {
        console.error(`Error analyzing date ${sampleDate.toISOString().split('T')[0]}:`, error);
        continue;
      }
    }
    
    // Group by month and find averages
    const monthlyAverages: any = {};
    results.forEach(result => {
      if (!monthlyAverages[result.month]) {
        monthlyAverages[result.month] = [];
      }
      monthlyAverages[result.month].push(result);
    });
    
    const monthlySummary = Object.entries(monthlyAverages).map(([month, data]: [string, any]) => {
      const avgTotalCost = data.reduce((sum: number, item: any) => sum + item.totalCost, 0) / data.length;
      const minTotalCost = Math.min(...data.map((item: any) => item.totalCost));
      const maxTotalCost = Math.max(...data.map((item: any) => item.totalCost));
      
      return {
        month,
        averageCost: Math.round(avgTotalCost),
        minCost: Math.round(minTotalCost),
        maxCost: Math.round(maxTotalCost),
        sampleCount: data.length
      };
    });
    
    // Find best and worst months
    monthlySummary.sort((a, b) => a.averageCost - b.averageCost);
    const bestMonth = monthlySummary[0];
    const worstMonth = monthlySummary[monthlySummary.length - 1];
    
    return {
      success: true,
      data: {
        monthlySummary,
        bestMonth,
        worstMonth,
        allResults: results
      },
      search_type: 'seasonal_analysis'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
} 