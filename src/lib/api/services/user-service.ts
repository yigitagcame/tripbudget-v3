import { BaseService, ServiceResponse } from './base-service';
import { tripServiceServer } from '../../server/trip-service-server';
import { MessageCounterServiceServer } from '../../server/message-counter-service-server';

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Trip {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  message_count: number;
}

// Interface for the raw trip data from the database
export interface TripData {
  trip_id: string;
  user_id: string;
  name?: string;
  description?: string;
  origin?: string;
  destination?: string;
  departure_date?: string;
  return_date?: string;
  passenger_count?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateTripRequest {
  userId: string;
  name: string;
  description?: string;
}

export interface UpdateTripRequest {
  tripId: string;
  userId: string;
  name?: string;
  description?: string;
}

export interface GetUserTripsRequest {
  userId: string;
}

export interface GetTripRequest {
  tripId: string;
  userId: string;
}

export interface DeleteTripRequest {
  tripId: string;
  userId: string;
}

// Helper function to convert TripData to Trip
function convertTripDataToTrip(tripData: TripData): Trip {
  return {
    id: tripData.trip_id,
    user_id: tripData.user_id,
    name: tripData.name || 'Untitled Trip',
    description: tripData.description,
    created_at: tripData.created_at,
    updated_at: tripData.updated_at,
    message_count: 0 // This will be updated separately
  };
}

export class UserService extends BaseService {
  private tripService = tripServiceServer;
  private messageCounterService = new MessageCounterServiceServer();

  async getUser(userId: string): Promise<ServiceResponse<User>> {
    try {
      const validationError = this.validateRequiredFields({ userId }, ['userId']);
      if (validationError) {
        return this.createErrorResponse(
          'validation',
          validationError.message,
          validationError.status,
          validationError.code,
          validationError.details
        );
      }

      // For now, return a mock user since we don't have a proper user lookup
      const mockUser: User = {
        id: userId,
        email: 'user@example.com',
        name: 'User',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      return this.createSuccessResponse(mockUser);
    } catch (error) {
      return this.handleServiceError(error, 'getUser');
    }
  }

  async createTrip(request: CreateTripRequest): Promise<ServiceResponse<Trip>> {
    try {
      const validationError = this.validateRequiredFields(request, ['userId', 'name']);
      if (validationError) {
        return this.createErrorResponse(
          'validation',
          validationError.message,
          validationError.status,
          validationError.code,
          validationError.details
        );
      }

      const tripData = await this.tripService.createTrip({
        user_id: request.userId,
        name: request.name,
        description: request.description
      });

      if (!tripData) {
        return this.createErrorResponse(
          'server',
          'Failed to create trip',
          500,
          'TRIP_CREATION_FAILED'
        );
      }

      const trip = convertTripDataToTrip(tripData);
      return this.createSuccessResponse(trip, 'Trip created successfully');
    } catch (error) {
      return this.handleServiceError(error, 'createTrip');
    }
  }

  async getUserTrips(request: GetUserTripsRequest): Promise<ServiceResponse<Trip[]>> {
    try {
      const validationError = this.validateRequiredFields(request, ['userId']);
      if (validationError) {
        return this.createErrorResponse(
          'validation',
          validationError.message,
          validationError.status,
          validationError.code,
          validationError.details
        );
      }

      const tripsData = await this.tripService.getTripsByUserId(request.userId);
      const trips = tripsData.map(convertTripDataToTrip);

      return this.createSuccessResponse(trips);
    } catch (error) {
      return this.handleServiceError(error, 'getUserTrips');
    }
  }

  async getTrip(request: GetTripRequest): Promise<ServiceResponse<Trip>> {
    try {
      const validationError = this.validateRequiredFields(request, ['tripId', 'userId']);
      if (validationError) {
        return this.createErrorResponse(
          'validation',
          validationError.message,
          validationError.status,
          validationError.code,
          validationError.details
        );
      }

      const tripData = await this.tripService.getTripById(request.tripId, request.userId);

      if (!tripData) {
        return this.createErrorResponse(
          'client',
          'Trip not found',
          404,
          'TRIP_NOT_FOUND'
        );
      }

      const trip = convertTripDataToTrip(tripData);
      return this.createSuccessResponse(trip);
    } catch (error) {
      return this.handleServiceError(error, 'getTrip');
    }
  }

  async updateTrip(request: UpdateTripRequest): Promise<ServiceResponse<Trip>> {
    try {
      const validationError = this.validateRequiredFields(request, ['tripId', 'userId']);
      if (validationError) {
        return this.createErrorResponse(
          'validation',
          validationError.message,
          validationError.status,
          validationError.code,
          validationError.details
        );
      }

      // Check if trip exists and belongs to user
      const existingTripData = await this.tripService.getTripById(request.tripId, request.userId);
      if (!existingTripData) {
        return this.createErrorResponse(
          'client',
          'Trip not found',
          404,
          'TRIP_NOT_FOUND'
        );
      }

      // Prepare updates
      const updates: Partial<TripData> = {};
      if (request.name !== undefined) updates.name = request.name;
      if (request.description !== undefined) updates.description = request.description;

      const success = await this.tripService.updateTrip(request.tripId, updates);
      if (!success) {
        return this.createErrorResponse(
          'server',
          'Failed to update trip',
          500,
          'TRIP_UPDATE_FAILED'
        );
      }

      // Get updated trip data
      const updatedTripData = await this.tripService.getTripById(request.tripId, request.userId);
      if (!updatedTripData) {
        return this.createErrorResponse(
          'server',
          'Failed to retrieve updated trip',
          500,
          'TRIP_RETRIEVAL_FAILED'
        );
      }

      const updatedTrip = convertTripDataToTrip(updatedTripData);
      return this.createSuccessResponse(updatedTrip, 'Trip updated successfully');
    } catch (error) {
      return this.handleServiceError(error, 'updateTrip');
    }
  }

  async deleteTrip(request: DeleteTripRequest): Promise<ServiceResponse<boolean>> {
    try {
      const validationError = this.validateRequiredFields(request, ['tripId', 'userId']);
      if (validationError) {
        return this.createErrorResponse(
          'validation',
          validationError.message,
          validationError.status,
          validationError.code,
          validationError.details
        );
      }

      // Check if trip exists and belongs to user
      const existingTripData = await this.tripService.getTripById(request.tripId, request.userId);
      if (!existingTripData) {
        return this.createErrorResponse(
          'client',
          'Trip not found',
          404,
          'TRIP_NOT_FOUND'
        );
      }

      const success = await this.tripService.deleteTrip(request.tripId, request.userId);
      if (!success) {
        return this.createErrorResponse(
          'server',
          'Failed to delete trip',
          500,
          'TRIP_DELETION_FAILED'
        );
      }

      return this.createSuccessResponse(true, 'Trip deleted successfully');
    } catch (error) {
      return this.handleServiceError(error, 'deleteTrip');
    }
  }

  async getMessageCount(tripId: string, userId: string): Promise<ServiceResponse<number>> {
    try {
      const validationError = this.validateRequiredFields({ tripId, userId }, ['tripId', 'userId']);
      if (validationError) {
        return this.createErrorResponse(
          'validation',
          validationError.message,
          validationError.status,
          validationError.code,
          validationError.details
        );
      }

      // For now, return 0 since we don't have the message counter service implemented
      return this.createSuccessResponse(0);
    } catch (error) {
      return this.handleServiceError(error, 'getMessageCount');
    }
  }

  async addMessageCount(tripId: string, userId: string, count: number): Promise<ServiceResponse<number>> {
    try {
      const validationError = this.validateRequiredFields({ tripId, userId, count }, ['tripId', 'userId', 'count']);
      if (validationError) {
        return this.createErrorResponse(
          'validation',
          validationError.message,
          validationError.status,
          validationError.code,
          validationError.details
        );
      }

      // For now, return the count since we don't have the message counter service implemented
      return this.createSuccessResponse(count);
    } catch (error) {
      return this.handleServiceError(error, 'addMessageCount');
    }
  }
} 