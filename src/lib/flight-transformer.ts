import { TequilaFlight } from './tequila-api';

export function transformFlightToCard(flight: TequilaFlight) {
  const durationHours = Math.floor(flight.duration.total / 3600);
  const durationMinutes = Math.floor((flight.duration.total % 3600) / 60);
  
  // Format departure and arrival times for better readability
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Create a more descriptive title
  const title = `${flight.cityFrom} → ${flight.cityTo}`;
  
  // Create a detailed description with airline, duration, and times
  const description = `${flight.airlines.join(', ')} • ${durationHours}h ${durationMinutes}m • ${formatTime(flight.local_departure)} - ${formatTime(flight.local_arrival)}`;
  
  // Format price with proper currency
  const price = `$${flight.price.toFixed(2)}`;
  
  // Create location string
  const location = `${flight.cityFrom} to ${flight.cityTo}`;
  
  return {
    type: 'flight' as const,
    title,
    description,
    price,
    rating: 4.5, // Default rating - could be enhanced with real ratings later
    location,
    bookingUrl: flight.deep_link,
    flightDetails: {
      departure: flight.local_departure,
      arrival: flight.local_arrival,
      departureFormatted: `${formatDate(flight.local_departure)} ${formatTime(flight.local_departure)}`,
      arrivalFormatted: `${formatDate(flight.local_arrival)} ${formatTime(flight.local_arrival)}`,
      airlines: flight.airlines,
      duration: flight.duration,
      durationFormatted: `${durationHours}h ${durationMinutes}m`,
      bookingToken: flight.booking_token,
      route: flight.route
    }
  };
}

export function transformFlightResultsToCards(flightResults: any) {
  if (!flightResults.success || !flightResults.data) {
    return [];
  }
  
  // The API already returns sorted results based on search type, so we just take the first 2
  const limitedFlights = flightResults.data.slice(0, 2);
  
  return limitedFlights.map((flight: TequilaFlight) => 
    transformFlightToCard(flight)
  );
}

/**
 * Transform flight results for different display formats
 */
export function transformFlightResultsForSummary(flightResults: any) {
  if (!flightResults.success || !flightResults.data || flightResults.data.length === 0) {
    return {
      count: 0,
      priceRange: null,
      airlines: [],
      message: 'No flights found'
    };
  }
  
  const flights = flightResults.data;
  const prices = flights.map((f: TequilaFlight) => f.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  
  // Get unique airlines
  const allAirlines = flights.flatMap((f: TequilaFlight) => f.airlines);
  const uniqueAirlines = [...new Set(allAirlines)];
  
  return {
    count: flights.length,
    priceRange: minPrice === maxPrice ? `$${minPrice.toFixed(2)}` : `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`,
    airlines: uniqueAirlines,
    message: `Found ${flights.length} flights from ${minPrice === maxPrice ? `$${minPrice.toFixed(2)}` : `$${minPrice.toFixed(2)} to $${maxPrice.toFixed(2)}`}`
  };
} 