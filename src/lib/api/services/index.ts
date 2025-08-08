// Base service and types
export { BaseService, type ServiceResponse, type ServiceError } from './base-service';

// Service classes
export { ChatService, type ChatRequest, type ChatResponse, type ChatMessage, type TripDetails } from './chat-service';
export { UserService, type User, type Trip, type CreateTripRequest, type UpdateTripRequest, type GetUserTripsRequest, type GetTripRequest, type DeleteTripRequest } from './user-service';
export { FlightService, type FlightSearchRequest, type FlightSearchResult, type FlightSearchResponse } from './flight-service';
export { AccommodationService, type AccommodationSearchRequest, type AccommodationSearchResult, type AccommodationSearchResponse } from './accommodation-service';

// Import service classes
import { ChatService } from './chat-service';
import { UserService } from './user-service';
import { FlightService } from './flight-service';
import { AccommodationService } from './accommodation-service';

// Service instances
export const chatService = new ChatService();
export const userService = new UserService();
export const flightService = new FlightService();
export const accommodationService = new AccommodationService(); 