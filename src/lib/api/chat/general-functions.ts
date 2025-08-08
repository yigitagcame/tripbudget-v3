import { searchFlights } from '../../api/flight/tequila-api';
import { searchDestinations, searchHotels } from '../../api/accommodation/booking-api';
import { formatDateForBookingAPI, convertSearchType, getSortParameter } from '../../api/accommodation/accommodation-transformer';
import { convertCityToAirportCode } from '../../utils/validation';

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
          description: 'Departure date in dd/mm/yyyy format. Example: "01/04/2024"'
        },
        date_to: {
          type: 'string',
          description: 'Return date in dd/mm/yyyy format. Example: "08/04/2024"'
        },
        adults: {
          type: 'number',
          description: 'Number of adult passengers (default: 1)',
          minimum: 1,
          maximum: 9
        },
        destinations: {
          type: 'array',
          items: {
            type: 'string'
          },
          description: 'List of destinations to compare (max 5)',
          minItems: 2,
          maxItems: 5
        },
        trip_duration: {
          type: 'number',
          description: 'Trip duration in days (default: 7)',
          minimum: 1,
          maximum: 30
        }
      },
      required: ['fly_from', 'date_from', 'date_to', 'destinations']
    }
  }
};

export const packageDealFunction = {
  type: 'function' as const,
  function: {
    name: 'find_package_deals',
    description: 'Find package deals combining flights and accommodation for the best value',
    parameters: {
      type: 'object',
      properties: {
        fly_from: {
          type: 'string',
          description: 'Departure location (IATA airport code, city code, or country code)'
        },
        destination: {
          type: 'string',
          description: 'Destination location (city, country, or region)'
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
          description: 'Number of adult passengers (default: 1)',
          minimum: 1,
          maximum: 9
        },
        search_type: {
          type: 'string',
          description: 'Type of package search',
          enum: ['budget', 'mid_range', 'luxury'],
          default: 'mid_range'
        }
      },
      required: ['fly_from', 'destination', 'arrival_date', 'departure_date']
    }
  }
};

export const seasonalPriceAnalysisFunction = {
  type: 'function' as const,
  function: {
    name: 'analyze_seasonal_prices',
    description: 'Analyze seasonal price variations for flights and accommodation to find the best time to travel',
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
          description: 'Start month for analysis (MM format). Example: "01" for January',
          pattern: '^(0[1-9]|1[0-2])$'
        },
        end_month: {
          type: 'string',
          description: 'End month for analysis (MM format). Example: "12" for December',
          pattern: '^(0[1-9]|1[0-2])$'
        },
        year: {
          type: 'number',
          description: 'Year for analysis (default: current year)',
          minimum: 2024,
          maximum: 2025
        },
        adults: {
          type: 'number',
          description: 'Number of adult passengers (default: 1)',
          minimum: 1,
          maximum: 9
        },
        trip_duration: {
          type: 'number',
          description: 'Trip duration in days (default: 7)',
          minimum: 1,
          maximum: 30
        }
      },
      required: ['fly_from', 'fly_to', 'start_month', 'end_month']
    }
  }
};

export async function executeCheapestDestinationSearch(args: any) {
  try {
    const results = [];
    
    for (const destination of args.destinations) {
      try {
        // Search for flights
        const flightResults = await searchFlights({
          fly_from: convertCityToAirportCode(args.fly_from),
          fly_to: convertCityToAirportCode(destination),
          date_from: args.date_from,
          date_to: args.date_to,
          adults: args.adults || 1,
          sort: 'price',
          limit: 1,
          curr: 'USD'
        });
        
        if (flightResults.data && flightResults.data.length > 0) {
          // Search for accommodation
          const accommodationResults = await searchDestinations({ query: destination });
          
          if (accommodationResults.data && accommodationResults.data.length > 0) {
            const dest = accommodationResults.data[0];
            const hotelResults = await searchHotels({
              dest_id: dest.dest_id,
              search_type: convertSearchType('budget'),
              arrival_date: formatDateForBookingAPI(args.date_from.split('/').reverse().join('-')),
              departure_date: formatDateForBookingAPI(args.date_to.split('/').reverse().join('-')),
              adults: args.adults || 1,
              room_qty: 1,
              sort_by: getSortParameter('price'),
              languagecode: 'en-us'
            });
            
            if (hotelResults.data && hotelResults.data.hotels && hotelResults.data.hotels.length > 0) {
              const flightCost = flightResults.data[0].price;
              const accommodationCost = hotelResults.data.hotels[0].property.priceBreakdown.grossPrice.value * (args.trip_duration || 7);
              const totalCost = flightCost + accommodationCost;
              
              results.push({
                destination,
                flightCost,
                accommodationCost,
                totalCost,
                dailyCost: totalCost / (args.trip_duration || 7)
              });
            }
          }
        }
      } catch (error) {
        console.error(`Error searching for ${destination}:`, error);
        continue;
      }
    }
    
    if (results.length === 0) {
      return {
        success: false,
        error: 'No results found for any of the specified destinations.'
      };
    }
    
    // Sort by total cost
    results.sort((a, b) => a.totalCost - b.totalCost);
    
    return {
      success: true,
      data: results,
      cheapest: results[0],
      search_type: 'cheapest_destination'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function executePackageDealSearch(args: any) {
  try {
    // Search for flights
    const flightResults = await searchFlights({
      fly_from: convertCityToAirportCode(args.fly_from),
      fly_to: convertCityToAirportCode(args.destination),
      date_from: args.arrival_date.split('-').reverse().join('/'),
      date_to: args.departure_date.split('-').reverse().join('/'),
      adults: args.adults || 1,
      sort: 'price',
      limit: 3,
      curr: 'USD'
    });
    
    if (!flightResults.data || flightResults.data.length === 0) {
      return {
        success: false,
        error: `No flights found from ${args.fly_from} to ${args.destination}.`
      };
    }
    
    // Search for accommodation
    const destinationResults = await searchDestinations({ query: args.destination });
    
    if (!destinationResults.data || destinationResults.data.length === 0) {
      return {
        success: false,
        error: `No accommodation found for ${args.destination}.`
      };
    }
    
    const destination = destinationResults.data[0];
    const searchType = convertSearchType(args.search_type || 'mid_range');
    
    const hotelResults = await searchHotels({
      dest_id: destination.dest_id,
      search_type: searchType,
      arrival_date: formatDateForBookingAPI(args.arrival_date),
      departure_date: formatDateForBookingAPI(args.departure_date),
      adults: args.adults || 1,
      room_qty: 1,
      sort_by: getSortParameter('popularity'),
      languagecode: 'en-us'
    });
    
    if (hotelResults.data && hotelResults.data.hotels && hotelResults.data.hotels.length > 0) {
      const flight = flightResults.data[0];
      const hotel = hotelResults.data.hotels[0];
      
      const packageDeal = {
        flight: {
          price: flight.price,
          airline: flight.airlines || 'Multiple Airlines',
          duration: flight.duration || 0,
          departure: flight.local_departure || '',
          arrival: flight.local_arrival || ''
        },
        hotel: hotel
      };
      
      return {
        success: true,
        data: [packageDeal],
        search_type: 'package_deal'
      };
    }
    
    return {
      success: false,
      error: `No accommodation found for ${args.destination} with the specified criteria.`
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
    const year = args.year || new Date().getFullYear();
    const startMonth = parseInt(args.start_month);
    const endMonth = parseInt(args.end_month);
    
    // Generate sample dates for each month
    const sampleDates = [];
    for (let month = startMonth; month <= endMonth; month++) {
      // Sample 2-3 dates per month
      for (let day = 1; day <= 28; day += 14) {
        const date = new Date(year, month - 1, day);
        if (date > new Date()) { // Only future dates
          sampleDates.push(date);
        }
      }
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
          fly_from: convertCityToAirportCode(args.fly_from),
          fly_to: convertCityToAirportCode(args.fly_to),
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
          const accommodationResults = await searchDestinations({ query: args.fly_to });
          
          if (accommodationResults.data && accommodationResults.data.length > 0) {
            const dest = accommodationResults.data[0];
            const hotelResults = await searchHotels({
              dest_id: dest.dest_id,
              search_type: convertSearchType('budget'),
              arrival_date: formatDateForBookingAPI(dateStr),
              departure_date: formatDateForBookingAPI(returnDateStr),
              adults: args.adults || 1,
              room_qty: 1,
              sort_by: getSortParameter('price'),
              languagecode: 'en-us'
            });
            
            if (hotelResults.data && hotelResults.data.hotels && hotelResults.data.hotels.length > 0) {
              const flightCost = flightResults.data[0].price;
              const accommodationCost = hotelResults.data.hotels[0].property.priceBreakdown.grossPrice.value * (args.trip_duration || 7);
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