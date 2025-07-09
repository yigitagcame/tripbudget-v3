/**
 * Validation functions for flight search parameters
 */

export function validateFlightSearchParams(params: any): string[] {
  const errors: string[] = [];
  
  if (!params.fly_from) errors.push('Departure location is required');
  if (!params.date_from) errors.push('Departure date from is required');
  if (!params.date_to) errors.push('Departure date to is required');
  
  // Validate date format
  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (params.date_from && !dateRegex.test(params.date_from)) {
    errors.push('Date format must be dd/mm/yyyy');
  }
  if (params.date_to && !dateRegex.test(params.date_to)) {
    errors.push('Date format must be dd/mm/yyyy');
  }
  
  // Validate date logic
  if (params.date_from && params.date_to) {
    const fromDate = parseDate(params.date_from);
    const toDate = parseDate(params.date_to);
    
    if (fromDate && toDate && fromDate > toDate) {
      errors.push('Departure date from must be before or equal to departure date to');
    }
    
    // Check if dates are in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (fromDate && fromDate < today) {
      errors.push('Departure date cannot be in the past');
    }
    if (toDate && toDate < today) {
      errors.push('Departure date cannot be in the past');
    }
  }
  
  // Validate return dates if provided
  if (params.return_from || params.return_to) {
    if (!params.return_from) errors.push('Return date from is required when return date to is provided');
    if (!params.return_to) errors.push('Return date to is required when return date from is provided');
    
    if (params.return_from && !dateRegex.test(params.return_from)) {
      errors.push('Return date format must be dd/mm/yyyy');
    }
    if (params.return_to && !dateRegex.test(params.return_to)) {
      errors.push('Return date format must be dd/mm/yyyy');
    }
    
    // Validate return date logic
    if (params.return_from && params.return_to) {
      const returnFromDate = parseDate(params.return_from);
      const returnToDate = parseDate(params.return_to);
      
      if (returnFromDate && returnToDate && returnFromDate > returnToDate) {
        errors.push('Return date from must be before or equal to return date to');
      }
      
      // Check if return dates are before departure dates
      if (params.date_from && returnFromDate) {
        const departDate = parseDate(params.date_from);
        if (departDate && returnFromDate < departDate) {
          errors.push('Return date cannot be before departure date');
        }
      }
    }
  }
  
  // Validate passenger numbers
  if (params.adults && (params.adults < 1 || params.adults > 9)) {
    errors.push('Number of adults must be between 1 and 9');
  }
  if (params.children && (params.children < 0 || params.children > 9)) {
    errors.push('Number of children must be between 0 and 9');
  }
  if (params.infants && (params.infants < 0 || params.infants > 9)) {
    errors.push('Number of infants must be between 0 and 9');
  }
  
  // Validate total passengers
  const totalPassengers = (params.adults || 0) + (params.children || 0) + (params.infants || 0);
  if (totalPassengers > 9) {
    errors.push('Total number of passengers cannot exceed 9');
  }
  
  // Validate cabin class
  if (params.selected_cabins && !['M', 'W', 'C', 'F'].includes(params.selected_cabins)) {
    errors.push('Cabin class must be M (economy), W (premium economy), C (business), or F (first class)');
  }
  
  // Validate sort parameter
  if (params.sort && !['price', 'duration', 'quality', 'date'].includes(params.sort)) {
    errors.push('Sort parameter must be price, duration, quality, or date');
  }
  
  // Validate limit
  if (params.limit && (params.limit < 1 || params.limit > 1000)) {
    errors.push('Limit must be between 1 and 1000');
  }
  
  // Validate currency
  if (params.curr && typeof params.curr !== 'string') {
    errors.push('Currency must be a string');
  }
  
  return errors;
}

/**
 * Handle flight search errors and return user-friendly messages
 */
export function handleFlightSearchError(error: any): string {
  if (error.message.includes('Not recognized location')) {
    return 'I couldn\'t find that location. Please try using a different airport code or city name.';
  }
  if (error.message.includes('400')) {
    return 'There was an issue with the search parameters. Please check your dates and locations.';
  }
  if (error.message.includes('401')) {
    return 'There was an authentication error with the flight search service. Please try again later.';
  }
  if (error.message.includes('429')) {
    return 'The flight search service is currently busy. Please try again in a few minutes.';
  }
  if (error.message.includes('500')) {
    return 'The flight search service is temporarily unavailable. Please try again later.';
  }
  if (error.message.includes('No flights found')) {
    return 'No flights found for your search criteria. Please try different dates or locations.';
  }
  if (error.message.includes('NetworkError') || error.message.includes('fetch')) {
    return 'Network connection error. Please check your internet connection and try again.';
  }
  if (error.message.includes('timeout')) {
    return 'The request timed out. Please try again.';
  }
  return 'Sorry, I encountered an error while searching for flights. Please try again.';
}

/**
 * Validate and sanitize location codes
 */
export function validateLocationCode(location: string): boolean {
  if (!location || typeof location !== 'string') {
    return false;
  }
  
  // Remove whitespace
  const cleanLocation = location.trim();
  const upperLocation = cleanLocation.toUpperCase();
  
  // Check if it's a valid IATA airport code (3 letters)
  if (/^[A-Z]{3}$/.test(upperLocation)) {
    return true;
  }
  
  // Check if it's a valid country code (2 letters)
  if (/^[A-Z]{2}$/.test(upperLocation)) {
    return true;
  }
  
  // Check if it's a city code format (city:CODE), case-insensitive prefix
  if (/^city:[A-Z]{3}$/i.test(cleanLocation)) {
    return true;
  }
  
  // Check if it's an airport code format (airport:CODE), case-insensitive prefix
  if (/^airport:[A-Z]{3}$/i.test(cleanLocation)) {
    return true;
  }
  
  // Reject 4-letter codes that are all letters (not valid IATA/country/city/airport)
  if (/^[A-Za-z]{4}$/.test(cleanLocation)) {
    return false;
  }
  
  // Allow city names (letters, spaces, hyphens, apostrophes, min 2 chars, not all numbers)
  if (/^[A-Za-z\s\-']{2,50}$/.test(cleanLocation) && !/^\d+$/.test(cleanLocation)) {
    return true;
  }
  
  return false;
}

/**
 * Format date for Tequila API (dd/mm/yyyy)
 */
export function formatDateForAPI(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Parse date from various formats to Date object
 */
export function parseDate(dateString: string): Date | null {
  // Try dd/mm/yyyy format
  const ddMmYyyyMatch = dateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (ddMmYyyyMatch) {
    const [, day, month, year] = ddMmYyyyMatch;
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }
  
  // Try yyyy-mm-dd format
  const yyyyMmDdMatch = dateString.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (yyyyMmDdMatch) {
    const [, year, month, day] = yyyyMmDdMatch;
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }
  
  // Try ISO date format
  const isoDate = new Date(dateString);
  if (!isNaN(isoDate.getTime())) {
    return isoDate;
  }
  
  return null;
} 

/**
 * Convert city names to IATA airport codes. If not found, return the original string.
 */
export function convertCityToAirportCode(city: string): string {
  if (!city || typeof city !== 'string') return city;
  const map: Record<string, string> = {
    'leipzig': 'LEJ',
    'riga': 'RIX',
    'berlin': 'BER',
    'munich': 'MUC',
    'frankfurt': 'FRA',
    'hamburg': 'HAM',
    'london': 'LON',
    'paris': 'PAR',
    'new york': 'NYC',
    'tokyo': 'TYO',
    'rome': 'ROM',
    'madrid': 'MAD',
    'barcelona': 'BCN',
    'vienna': 'VIE',
    'prague': 'PRG',
    'budapest': 'BUD',
    'warsaw': 'WAW',
    'oslo': 'OSL',
    'helsinki': 'HEL',
    'copenhagen': 'CPH',
    'stockholm': 'STO',
  };
  const key = city.trim().toLowerCase();
  return map[key] || city;
} 