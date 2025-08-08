// Flight-related type definitions

export interface FlightSearchParams {
  fly_from: string;
  fly_to: string;
  date_from: string;
  date_to: string;
  return_from?: string;
  return_to?: string;
  adults?: number;
  children?: number;
  infants?: number;
  selected_cabins?: 'M' | 'W' | 'C' | 'F';
  curr?: string;
  limit?: number;
  sort?: 'price' | 'duration' | 'quality' | 'date';
  search_type?: 'cheapest' | 'fastest' | 'best';
}

export interface FlightResult {
  id: string;
  flyFrom: string;
  flyTo: string;
  cityFrom: string;
  cityTo: string;
  countryFrom: string;
  countryTo: string;
  distance: number;
  duration: {
    departure: number;
    return: number;
    total: number;
  };
  price: number;
  currency: string;
  airlines: string[];
  route: FlightRoute[];
  booking_token: string;
  deep_link: string;
  local_arrival: string;
  local_departure: string;
  utc_arrival: string;
  utc_departure: string;
  nightsInDest?: number;
  quality: number;
  popularity: number;
  is_aggregated: boolean;
  has_airport_change: boolean;
  technical_stops: number;
  price_dropdown: {
    base_price: number;
    fees: number;
    total: number;
  };
  bags_price: Record<string, number>;
  baglimit: {
    hand_width: number;
    hand_height: number;
    hand_length: number;
    hand_weight: number;
    hold_width: number;
    hold_height: number;
    hold_length: number;
    hold_dimensions_sum: number;
    hold_weight: number;
  };
  availability: {
    seats: number | null;
  };
  facilitated_booking_available: boolean;
  pnr_count: number;
  throw_away_ticketing: boolean;
  hidden_city_ticketing: boolean;
  virtual_interlining: boolean;
}

export interface FlightRoute {
  id: string;
  combination_id: string;
  flyFrom: string;
  flyTo: string;
  cityFrom: string;
  cityTo: string;
  airline: string;
  flight_no: number;
  operating_carrier: string;
  operating_flight_no: string;
  fare_basis: string;
  fare_category: string;
  fare_classes: string;
  fare_family: string;
  return: number;
  bags_recheck_required: boolean;
  vi_connection: boolean;
  guarantee: boolean;
  last_seen: string;
  refresh_timestamp: string;
  equipment: string | null;
  vehicle_type: string;
  local_arrival: string;
  utc_arrival: string;
  local_departure: string;
  utc_departure: string;
}

export interface FlightSearchResponse {
  success: boolean;
  data: FlightResult[];
  currency: string;
  currency_rate: number;
  fx_rate: number;
  data_updated: number;
  search_id: string;
  search_params: FlightSearchParams;
  all_airlines: string[];
  all_stopover_airports: string[];
  all_airports: string[];
  location_has_airport_change: boolean;
  has_airport_change: boolean;
  technical_stops: number;
  throw_away_ticketing: boolean;
  hidden_city_ticketing: boolean;
  virtual_interlining: boolean;
  facilitated_booking_available: boolean;
  pnr_count: number;
}

export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface FlightFunctionCall {
  name: 'search_flights';
  parameters: FlightSearchParams;
}

export interface FlightSearchError {
  error: string;
  details?: any;
}

// Flight search function definition for OpenAI
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
} as const; 