// Accommodation-related type definitions

export interface AccommodationSearchParams {
  destination: string;
  checkIn: string;
  checkOut: string;
  adults?: number;
  children?: number;
  rooms?: number;
  currency?: string;
  limit?: number;
  sort?: 'price' | 'rating' | 'distance' | 'popularity';
  filters?: {
    priceRange?: {
      min: number;
      max: number;
    };
    rating?: number;
    amenities?: string[];
    propertyType?: string[];
  };
}

export interface AccommodationResult {
  id: string;
  name: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  rating: {
    overall: number;
    cleanliness: number;
    comfort: number;
    location: number;
    facilities: number;
    staff: number;
    valueForMoney: number;
    totalReviews: number;
  };
  price: {
    current: number;
    original?: number;
    currency: string;
    perNight: boolean;
  };
  amenities: string[];
  propertyType: string;
  images: {
    url: string;
    alt: string;
    caption?: string;
  }[];
  availability: {
    available: boolean;
    roomsAvailable: number;
  };
  bookingUrl: string;
  provider: string;
  lastUpdated: string;
}

export interface AccommodationSearchResponse {
  success: boolean;
  data: AccommodationResult[];
  totalResults: number;
  searchParams: AccommodationSearchParams;
  currency: string;
  searchId: string;
}

export interface DestinationSearchParams {
  query: string;
  limit?: number;
  type?: 'city' | 'region' | 'country';
}

export interface DestinationResult {
  id: string;
  name: string;
  type: 'city' | 'region' | 'country';
  country: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  timezone: string;
  currency: string;
  language: string;
  population?: number;
  description?: string;
  images?: {
    url: string;
    alt: string;
  }[];
}

export interface DestinationSearchResponse {
  success: boolean;
  data: DestinationResult[];
  totalResults: number;
  searchParams: DestinationSearchParams;
}

export interface HotelSearchParams {
  destinationId: string;
  checkIn: string;
  checkOut: string;
  adults?: number;
  children?: number;
  rooms?: number;
  currency?: string;
  limit?: number;
  sort?: 'price' | 'rating' | 'distance' | 'popularity';
  filters?: {
    priceRange?: {
      min: number;
      max: number;
    };
    rating?: number;
    amenities?: string[];
    propertyType?: string[];
    starRating?: number[];
  };
}

export interface HotelResult {
  id: string;
  name: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  rating: {
    overall: number;
    cleanliness: number;
    comfort: number;
    location: number;
    facilities: number;
    staff: number;
    valueForMoney: number;
    totalReviews: number;
  };
  price: {
    current: number;
    original?: number;
    currency: string;
    perNight: boolean;
    taxes?: number;
    fees?: number;
  };
  amenities: string[];
  propertyType: string;
  starRating?: number;
  images: {
    url: string;
    alt: string;
    caption?: string;
  }[];
  availability: {
    available: boolean;
    roomsAvailable: number;
    roomTypes: RoomType[];
  };
  bookingUrl: string;
  provider: string;
  lastUpdated: string;
}

export interface RoomType {
  id: string;
  name: string;
  description: string;
  capacity: {
    adults: number;
    children: number;
    total: number;
  };
  price: {
    current: number;
    original?: number;
    currency: string;
    perNight: boolean;
  };
  amenities: string[];
  images?: {
    url: string;
    alt: string;
  }[];
  available: boolean;
  quantity: number;
}

export interface HotelSearchResponse {
  success: boolean;
  data: HotelResult[];
  totalResults: number;
  searchParams: HotelSearchParams;
  currency: string;
  searchId: string;
}

export interface AccommodationFunctionCall {
  name: 'search_accommodation';
  parameters: AccommodationSearchParams;
}

export interface AccommodationSearchError {
  error: string;
  details?: any;
}

// Accommodation search function definition for OpenAI
export const accommodationSearchFunction = {
  type: 'function' as const,
  function: {
    name: 'search_accommodation',
    description: 'Search for accommodation options using the Booking.com API',
    parameters: {
      type: 'object',
      properties: {
        destination: {
          type: 'string',
          description: 'Destination name (city, region, or country). Examples: "London", "Paris", "New York"'
        },
        checkIn: {
          type: 'string',
          description: 'Check-in date in yyyy-mm-dd format. Example: "2024-04-01"'
        },
        checkOut: {
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
          description: 'Number of rooms (default: 1)',
          minimum: 1,
          maximum: 30
        },
        currency: {
          type: 'string',
          description: 'Currency for pricing. Default: USD',
          default: 'USD'
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results (max 50)',
          minimum: 1,
          maximum: 50,
          default: 5
        },
        sort: {
          type: 'string',
          description: 'Sort results by',
          enum: ['price', 'rating', 'distance', 'popularity'],
          default: 'price'
        }
      },
      required: ['destination', 'checkIn', 'checkOut']
    }
  }
} as const; 