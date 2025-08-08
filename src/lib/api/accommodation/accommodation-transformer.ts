import { BookingHotel } from './booking-api';

export interface AccommodationCard {
  type: 'hotel';
  title: string;
  description: string;
  price: string;
  rating: number;
  location: string;
  image: string;
  bookingUrl: string;
  starRating: number;
  reviewCount: number;
  checkinTime: string;
  checkoutTime: string;
}

/**
 * Transform Booking.com hotel search results into card format
 */
export function transformAccommodationResultsToCards(hotels: BookingHotel[]): AccommodationCard[] {
  return hotels.map(hotel => {
    const property = hotel.property;
    
    // Extract price information
    const price = property.priceBreakdown?.grossPrice;
    const priceString = price ? `${price.currency} ${price.value.toFixed(0)}` : 'Price not available';
    
    // Extract rating (convert from 0-10 scale to 0-5 scale)
    const rating = property.reviewScore ? property.reviewScore / 2 : 0;
    
    // Extract star rating
    const starRating = property.propertyClass || 0;
    
    // Extract check-in/check-out times
    const checkinTime = property.checkin?.fromTime || 'Not specified';
    const checkoutTime = property.checkout?.untilTime || 'Not specified';
    
    // Extract location from accessibility label
    const locationMatch = hotel.accessibilityLabel.match(/•\s*([^•]+?)\s*•/);
    const location = locationMatch ? locationMatch[1].trim() : 'Location not specified';
    
    // Extract hotel image
    const image = property.photoUrls?.[0] || '';
    
    // Generate booking URL (placeholder for now)
    const bookingUrl = `https://www.booking.com/hotel/${property.countryCode}/${property.id}.html`;
    
    // Create description from accessibility label
    const description = hotel.accessibilityLabel
      .replace(/•\s*[^•]+?\s*•/g, '') // Remove location info
      .replace(/\d+\s*(?:INR|USD|EUR|GBP)\s*.*$/, '') // Remove price info
      .replace(/\d+\s*out of \d+\s*stars\./, '') // Remove star info
      .replace(/\d+\.\d+\s*[A-Za-z]+\s*\d+\s*reviews\./, '') // Remove rating info
      .trim();
    
    return {
      type: 'hotel',
      title: property.name,
      description: description || 'Hotel accommodation',
      price: priceString,
      rating,
      location,
      image,
      bookingUrl,
      starRating,
      reviewCount: property.reviewCount || 0,
      checkinTime,
      checkoutTime
    };
  });
}

/**
 * Format date from YYYY-MM-DD to YYYY-MM-DD for Booking.com API
 * (No conversion needed, just validation)
 */
export function formatDateForBookingAPI(dateString: string): string {
  if (!dateString) return '';
  
  // Validate that the date is in YYYY-MM-DD format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) {
    console.error('[formatDateForBookingAPI] Invalid date format:', dateString);
    return '';
  }
  
  // Validate that it's a valid date
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    console.error('[formatDateForBookingAPI] Invalid date:', dateString);
    return '';
  }
  
  return dateString; // Return as-is since Booking.com API expects YYYY-MM-DD
}

/**
 * Convert search type to Booking.com API format
 */
export function convertSearchType(searchType: string): string {
  switch (searchType.toLowerCase()) {
    case 'city':
      return 'CITY';
    case 'district':
      return 'DISTRICT';
    case 'landmark':
      return 'LANDMARK';
    case 'airport':
      return 'AIRPORT';
    case 'station':
      return 'STATION';
    default:
      return 'CITY';
  }
}

/**
 * Get sort parameter based on search type
 */
export function getSortParameter(searchType: string): string {
  switch (searchType.toLowerCase()) {
    case 'budget':
      return 'price';
    case 'luxury':
      return 'review_score';
    case 'best':
    default:
      return 'popularity';
  }
} 