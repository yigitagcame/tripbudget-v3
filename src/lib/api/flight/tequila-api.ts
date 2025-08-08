interface TequilaSearchParams {
  fly_from: string;
  fly_to?: string;
  date_from: string;
  date_to: string;
  return_from?: string;
  return_to?: string;
  adults?: number;
  children?: number;
  infants?: number;
  selected_cabins?: string;
  curr?: string;
  limit?: number;
  sort?: 'price' | 'duration' | 'quality' | 'date';
}

export interface TequilaFlight {
  id: string;
  flyFrom: string;
  flyTo: string;
  cityFrom: string;
  cityTo: string;
  local_departure: string;
  local_arrival: string;
  airlines: string[];
  duration: {
    departure: number;
    return: number;
    total: number;
  };
  price: number;
  booking_token: string;
  deep_link: string;
  route: Array<{
    id: string;
    combination_id: string;
    flyFrom: string;
    flyTo: string;
    cityFrom: string;
    cityTo: string;
    local_departure: string;
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
    equipment: string;
    vehicle_type: string;
    utc_departure: string;
    utc_arrival: string;
  }>;
}

export interface TequilaSearchResponse {
  data: TequilaFlight[];
  currency: string;
  search_id: string;
  _results: number;
}

export async function searchFlights(params: TequilaSearchParams): Promise<TequilaSearchResponse> {
  const searchParams = new URLSearchParams();
  
  // Required parameters
  searchParams.append('fly_from', params.fly_from);
  searchParams.append('date_from', params.date_from);
  searchParams.append('date_to', params.date_to);
  
  // Optional parameters
  if (params.fly_to) searchParams.append('fly_to', params.fly_to);
  if (params.return_from) searchParams.append('return_from', params.return_from);
  if (params.return_to) searchParams.append('return_to', params.return_to);
  if (params.adults) searchParams.append('adults', params.adults.toString());
  if (params.children) searchParams.append('children', params.children.toString());
  if (params.infants) searchParams.append('infants', params.infants.toString());
  if (params.selected_cabins) searchParams.append('selected_cabins', params.selected_cabins);
  if (params.curr) searchParams.append('curr', params.curr);
  if (params.limit) searchParams.append('limit', params.limit.toString());
  if (params.sort) searchParams.append('sort', params.sort);
  
  const response = await fetch(`${process.env.TEQUILA_BASE_URL}/search?${searchParams}`, {
    headers: {
      'apikey': process.env.TEQUILA_API_KEY!,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Tequila API Error Response:', errorText);
    throw new Error(`Tequila API error: ${response.status} ${response.statusText} - ${errorText}`);
  }
  
  return response.json();
} 