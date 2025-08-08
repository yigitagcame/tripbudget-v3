import { BaseService, ServiceResponse } from './base-service';
import { searchFlights } from '../flight/tequila-api';
import { transformFlightResultsToCards } from '../flight/flight-transformer';
import { validateFlightSearchParams } from '../../utils/validation';

export interface FlightSearchRequest {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  currency?: string;
  maxPrice?: number;
  cabinClass?: string;
}

export interface FlightSearchResult {
  id: string;
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  currency: string;
  stops: number;
  cabinClass: string;
}

export interface FlightSearchResponse {
  flights: FlightSearchResult[];
  totalCount: number;
  currency: string;
  searchParams: FlightSearchRequest;
}

export class FlightService extends BaseService {
  async searchFlights(request: FlightSearchRequest): Promise<ServiceResponse<FlightSearchResponse>> {
    try {
      // Validate required fields
      const validationError = this.validateRequiredFields(request, [
        'origin', 
        'destination', 
        'departureDate', 
        'passengers'
      ]);
      if (validationError) {
        return this.createErrorResponse(
          'validation',
          validationError.message,
          validationError.status,
          validationError.code,
          validationError.details
        );
      }

      // Validate flight search parameters
      const validationErrors = validateFlightSearchParams(request);
      if (validationErrors.length > 0) {
        return this.createErrorResponse(
          'validation',
          validationErrors.join(', '),
          400,
          'INVALID_FLIGHT_PARAMS',
          { errors: validationErrors }
        );
      }

      // Perform flight search
      const tequilaParams = {
        fly_from: request.origin,
        fly_to: request.destination,
        date_from: request.departureDate,
        date_to: request.departureDate, // Use same date for single day search
        return_from: request.returnDate,
        return_to: request.returnDate,
        adults: request.passengers,
        curr: request.currency || 'USD',
        selected_cabins: request.cabinClass,
        limit: 50
      };
      
      const searchResults = await searchFlights(tequilaParams);

      if (!searchResults.data || searchResults.data.length === 0) {
        return this.createSuccessResponse({
          flights: [],
          totalCount: 0,
          currency: request.currency || 'USD',
          searchParams: request
        }, 'No flights found for the specified criteria');
      }

      // Transform results to cards format
      const cards = transformFlightResultsToCards(searchResults.data);

      // Transform to FlightSearchResult format
      const flights: FlightSearchResult[] = searchResults.data.map((flight: any) => ({
        id: flight.id,
        airline: flight.airlines?.join(', ') || 'Unknown',
        flightNumber: flight.route?.[0]?.flight_no?.toString() || 'Unknown',
        origin: flight.flyFrom,
        destination: flight.flyTo,
        departureTime: flight.local_departure,
        arrivalTime: flight.local_arrival,
        duration: `${Math.round(flight.duration.total / 60)}h ${flight.duration.total % 60}m`,
        price: flight.price,
        currency: searchResults.currency,
        stops: flight.route?.length - 1 || 0,
        cabinClass: request.cabinClass || 'Economy'
      }));

      return this.createSuccessResponse({
        flights,
        totalCount: flights.length,
        currency: request.currency || 'USD',
        searchParams: request
      });
    } catch (error) {
      return this.handleServiceError(error, 'searchFlights');
    }
  }

  async getFlightDetails(flightId: string): Promise<ServiceResponse<FlightSearchResult>> {
    try {
      const validationError = this.validateRequiredFields({ flightId }, ['flightId']);
      if (validationError) {
        return this.createErrorResponse(
          'validation',
          validationError.message,
          validationError.status,
          validationError.code,
          validationError.details
        );
      }

      // This would typically call a different API endpoint to get detailed flight information
      // For now, we'll return an error indicating this feature is not implemented
      return this.createErrorResponse(
        'client',
        'Flight details endpoint not implemented',
        501,
        'NOT_IMPLEMENTED'
      );
    } catch (error) {
      return this.handleServiceError(error, 'getFlightDetails');
    }
  }

  async getPopularRoutes(): Promise<ServiceResponse<string[]>> {
    try {
      // This would typically return popular flight routes
      // For now, we'll return a static list
      const popularRoutes = [
        'New York - London',
        'Los Angeles - Tokyo',
        'Paris - Rome',
        'London - Paris',
        'New York - Los Angeles',
        'Tokyo - Seoul',
        'London - Amsterdam',
        'Paris - Barcelona'
      ];

      return this.createSuccessResponse(popularRoutes);
    } catch (error) {
      return this.handleServiceError(error, 'getPopularRoutes');
    }
  }

  async getAirports(query: string): Promise<ServiceResponse<any[]>> {
    try {
      const validationError = this.validateRequiredFields({ query }, ['query']);
      if (validationError) {
        return this.createErrorResponse(
          'validation',
          validationError.message,
          validationError.status,
          validationError.code,
          validationError.details
        );
      }

      if (query.length < 2) {
        return this.createErrorResponse(
          'validation',
          'Query must be at least 2 characters long',
          400,
          'QUERY_TOO_SHORT'
        );
      }

      // This would typically call an airport search API
      // For now, we'll return a mock response
      const airports = [
        { code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York' },
        { code: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles' },
        { code: 'LHR', name: 'London Heathrow Airport', city: 'London' },
        { code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris' }
      ].filter(airport => 
        airport.name.toLowerCase().includes(query.toLowerCase()) ||
        airport.code.toLowerCase().includes(query.toLowerCase()) ||
        airport.city.toLowerCase().includes(query.toLowerCase())
      );

      return this.createSuccessResponse(airports);
    } catch (error) {
      return this.handleServiceError(error, 'getAirports');
    }
  }
} 