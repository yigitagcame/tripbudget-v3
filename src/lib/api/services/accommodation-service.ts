import { BaseService, ServiceResponse } from './base-service';
import { searchAccommodations } from '../accommodation/booking-api';
import { transformAccommodationResultsToCards } from '../accommodation/accommodation-transformer';
import { validateAccommodationSearchParams } from '../../utils/validation';

export interface AccommodationSearchRequest {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
  currency?: string;
  maxPrice?: number;
  amenities?: string[];
  rating?: number;
}

export interface AccommodationSearchResult {
  id: string;
  name: string;
  location: string;
  rating: number;
  price: number;
  currency: string;
  amenities: string[];
  imageUrl?: string;
  bookingUrl?: string;
  description: string;
}

export interface AccommodationSearchResponse {
  accommodations: AccommodationSearchResult[];
  totalCount: number;
  currency: string;
  searchParams: AccommodationSearchRequest;
}

export class AccommodationService extends BaseService {
  async searchAccommodations(request: AccommodationSearchRequest): Promise<ServiceResponse<AccommodationSearchResponse>> {
    try {
      // Validate required fields
      const validationError = this.validateRequiredFields(request, [
        'destination', 
        'checkIn', 
        'checkOut', 
        'guests',
        'rooms'
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

      // Validate accommodation search parameters
      const validationErrors = validateAccommodationSearchParams(request);
      if (validationErrors.length > 0) {
        return this.createErrorResponse(
          'validation',
          validationErrors.join(', '),
          400,
          'INVALID_ACCOMMODATION_PARAMS',
          { errors: validationErrors }
        );
      }

      // Perform accommodation search
      const searchResults = await searchAccommodations(request);

      if (!searchResults || searchResults.length === 0) {
        return this.createSuccessResponse({
          accommodations: [],
          totalCount: 0,
          currency: request.currency || 'USD',
          searchParams: request
        }, 'No accommodations found for the specified criteria');
      }

      // Transform results to cards format
      const cards = transformAccommodationResultsToCards(searchResults);

      // Transform to AccommodationSearchResult format
      const accommodations: AccommodationSearchResult[] = searchResults.map((hotel: any) => ({
        id: hotel.id,
        name: hotel.name,
        location: hotel.location,
        rating: hotel.rating,
        price: hotel.price,
        currency: hotel.currency,
        amenities: hotel.amenities || [],
        imageUrl: hotel.image_url,
        bookingUrl: hotel.booking_url,
        description: hotel.description
      }));

      return this.createSuccessResponse({
        accommodations,
        totalCount: accommodations.length,
        currency: request.currency || 'USD',
        searchParams: request
      });
    } catch (error) {
      return this.handleServiceError(error, 'searchAccommodations');
    }
  }

  async getAccommodationDetails(accommodationId: string): Promise<ServiceResponse<AccommodationSearchResult>> {
    try {
      const validationError = this.validateRequiredFields({ accommodationId }, ['accommodationId']);
      if (validationError) {
        return this.createErrorResponse(
          'validation',
          validationError.message,
          validationError.status,
          validationError.code,
          validationError.details
        );
      }

      // This would typically call a different API endpoint to get detailed accommodation information
      // For now, we'll return an error indicating this feature is not implemented
      return this.createErrorResponse(
        'client',
        'Accommodation details endpoint not implemented',
        501,
        'NOT_IMPLEMENTED'
      );
    } catch (error) {
      return this.handleServiceError(error, 'getAccommodationDetails');
    }
  }

  async getPopularDestinations(): Promise<ServiceResponse<string[]>> {
    try {
      // This would typically return popular accommodation destinations
      // For now, we'll return a static list
      const popularDestinations = [
        'New York',
        'London',
        'Paris',
        'Tokyo',
        'Los Angeles',
        'Rome',
        'Barcelona',
        'Amsterdam',
        'Berlin',
        'Madrid'
      ];

      return this.createSuccessResponse(popularDestinations);
    } catch (error) {
      return this.handleServiceError(error, 'getPopularDestinations');
    }
  }

  async getAmenities(): Promise<ServiceResponse<string[]>> {
    try {
      // This would typically return available amenities
      const amenities = [
        'WiFi',
        'Pool',
        'Gym',
        'Spa',
        'Restaurant',
        'Bar',
        'Parking',
        'Air Conditioning',
        'Kitchen',
        'Balcony',
        'Ocean View',
        'Mountain View',
        'City View',
        'Pet Friendly',
        'Family Friendly',
        'Business Center',
        'Conference Room',
        'Shuttle Service',
        'Airport Transfer',
        'Concierge'
      ];

      return this.createSuccessResponse(amenities);
    } catch (error) {
      return this.handleServiceError(error, 'getAmenities');
    }
  }

  async searchDestinations(query: string): Promise<ServiceResponse<any[]>> {
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

      // This would typically call a destination search API
      // For now, we'll return a mock response
      const destinations = [
        { name: 'New York', country: 'United States', type: 'city' },
        { name: 'London', country: 'United Kingdom', type: 'city' },
        { name: 'Paris', country: 'France', type: 'city' },
        { name: 'Tokyo', country: 'Japan', type: 'city' },
        { name: 'Los Angeles', country: 'United States', type: 'city' },
        { name: 'Rome', country: 'Italy', type: 'city' },
        { name: 'Barcelona', country: 'Spain', type: 'city' },
        { name: 'Amsterdam', country: 'Netherlands', type: 'city' }
      ].filter(destination => 
        destination.name.toLowerCase().includes(query.toLowerCase()) ||
        destination.country.toLowerCase().includes(query.toLowerCase())
      );

      return this.createSuccessResponse(destinations);
    } catch (error) {
      return this.handleServiceError(error, 'searchDestinations');
    }
  }
} 