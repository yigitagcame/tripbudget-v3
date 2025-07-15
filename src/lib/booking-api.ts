interface BookingDestinationSearchParams {
  query: string;
}

interface BookingHotelSearchParams {
  dest_id: string;
  search_type: string;
  arrival_date: string;
  departure_date: string;
  adults?: number;
  children_age?: string;
  room_qty?: number;
  page_number?: number;
  price_min?: number;
  price_max?: number;
  sort_by?: string;
  currency_code?: string;
  languagecode?: string;
  units?: string;
  temperature_unit?: string;
  location?: string;
}

export interface BookingDestination {
  dest_type: string;
  cc1: string;
  city_name: string;
  label: string;
  longitude: number;
  latitude: number;
  type: string;
  region: string;
  city_ufi: number;
  name: string;
  roundtrip: string;
  country: string;
  image_url: string;
  dest_id: string;
  nr_hotels: number;
  lc: string;
  hotels: number;
}

export interface BookingDestinationResponse {
  status: boolean;
  message: string;
  timestamp: number;
  data: BookingDestination[];
}

export interface BookingHotel {
  accessibilityLabel: string;
  property: {
    reviewScoreWord: string;
    accuratePropertyClass: number;
    reviewCount: number;
    ufi: number;
    isPreferred: boolean;
    isFirstPage: boolean;
    checkin: {
      untilTime: string;
      fromTime: string;
    };
    qualityClass: number;
    rankingPosition: number;
    reviewScore: number;
    countryCode: string;
    propertyClass: number;
    photoUrls: string[];
    checkoutDate: string;
    position: number;
    latitude: number;
    checkout: {
      fromTime: string;
      untilTime: string;
    };
    priceBreakdown: {
      benefitBadges: any[];
      grossPrice: {
        currency: string;
        value: number;
      };
      taxExceptions: any[];
    };
    optOutFromGalleryChanges: number;
    wishlistName: string;
    blockIds: string[];
    currency: string;
    checkinDate: string;
    id: number;
    mainPhotoId: number;
    name: string;
    longitude: number;
  };
}

export interface BookingHotelResponse {
  status: boolean;
  message: string;
  timestamp: number;
  data: {
    hotels: BookingHotel[];
    meta: Array<{
      title: string;
    }>;
  };
}

/**
 * Search for destinations using Booking.com API
 */
export async function searchDestinations(params: BookingDestinationSearchParams): Promise<BookingDestinationResponse> {
  const searchParams = new URLSearchParams();
  searchParams.append('query', params.query);
  
  const response = await fetch(`https://${process.env.RAPIDAPI_HOST}/api/v1/hotels/searchDestination?${searchParams}`, {
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY!,
      'X-RapidAPI-Host': process.env.RAPIDAPI_HOST!,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Booking API Destination Search Error Response:', errorText);
    throw new Error(`Booking API destination search error: ${response.status} ${response.statusText} - ${errorText}`);
  }
  
  return response.json();
}

/**
 * Search for hotels using Booking.com API
 */
export async function searchHotels(params: BookingHotelSearchParams): Promise<BookingHotelResponse> {
  const searchParams = new URLSearchParams();
  
  // Required parameters
  searchParams.append('dest_id', params.dest_id);
  searchParams.append('search_type', params.search_type);
  searchParams.append('arrival_date', params.arrival_date);
  searchParams.append('departure_date', params.departure_date);
  
  // Optional parameters
  if (params.adults) searchParams.append('adults', params.adults.toString());
  if (params.children_age) searchParams.append('children_age', params.children_age);
  if (params.room_qty) searchParams.append('room_qty', params.room_qty.toString());
  if (params.page_number) searchParams.append('page_number', params.page_number.toString());
  if (params.price_min) searchParams.append('price_min', params.price_min.toString());
  if (params.price_max) searchParams.append('price_max', params.price_max.toString());
  if (params.sort_by) searchParams.append('sort_by', params.sort_by);
  if (params.currency_code) searchParams.append('currency_code', params.currency_code);
  if (params.languagecode) searchParams.append('languagecode', params.languagecode);
  if (params.units) searchParams.append('units', params.units);
  if (params.temperature_unit) searchParams.append('temperature_unit', params.temperature_unit);
  if (params.location) searchParams.append('location', params.location);
  
  const response = await fetch(`https://${process.env.RAPIDAPI_HOST}/api/v1/hotels/searchHotels?${searchParams}`, {
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY!,
      'X-RapidAPI-Host': process.env.RAPIDAPI_HOST!,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Booking API Hotel Search Error Response:', errorText);
    throw new Error(`Booking API hotel search error: ${response.status} ${response.statusText} - ${errorText}`);
  }
  
  return response.json();
} 