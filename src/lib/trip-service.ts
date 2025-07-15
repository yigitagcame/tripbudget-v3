import { supabase } from './supabase';
import { generateTripId } from './trip-utils';

export interface TripData {
  trip_id: string;
  user_id: string;
  origin?: string;
  destination?: string;
  departure_date?: string;
  return_date?: string;
  passenger_count?: number;
}

export type TripChangeCallback = (trip: TripData) => void;

export const tripService = {
  // Find an empty trip (only has trip_id and user_id) or create a new one
  async findOrCreateEmptyTrip(userId: string): Promise<string | null> {
    console.log('TripService - Finding or creating empty trip for user:', userId);
    
    // First, try to find an existing empty trip
    const { data: emptyTrips, error: findError } = await supabase
      .from('trips')
      .select('trip_id')
      .eq('user_id', userId)
      .is('origin', null)
      .is('destination', null)
      .is('departure_date', null)
      .is('return_date', null)
      .is('passenger_count', null)
      .limit(1);
    
    if (findError) {
      console.error('TripService - Error finding empty trips:', findError);
    }
    
    if (emptyTrips && emptyTrips.length > 0) {
      console.log('TripService - Found existing empty trip:', emptyTrips[0].trip_id);
      return emptyTrips[0].trip_id;
    }
    
    // If no empty trip found, create a new one
    console.log('TripService - No empty trip found, creating new one');
    return await this.createTrip(userId);
  },

  // Create trip on first message
  async createTrip(userId: string): Promise<string | null> {
    const tripId = generateTripId();
    console.log('TripService - Creating new trip with ID:', tripId, 'for user:', userId);
    
    const { error } = await supabase
      .from('trips')
      .insert({ 
        trip_id: tripId,
        user_id: userId 
      });

    if (error) {
      console.error('TripService - Error creating trip:', error);
      return null;
    }
    
    console.log('TripService - Successfully created trip:', tripId);
    return tripId;
  },

  // Update trip details from AI
  async updateTrip(tripId: string, updates: Partial<TripData>): Promise<boolean> {
    const { error } = await supabase
      .from('trips')
      .update(updates)
      .eq('trip_id', tripId);

    return !error;
  },

  // Get trip by ID
  async getTrip(tripId: string) {
    console.log('TripService - Getting trip by ID:', tripId);
    
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('trip_id', tripId)
      .single();
    
    if (error) {
      console.error('TripService - Error getting trip:', error);
      return null;
    }
    
    console.log('TripService - Found trip:', data ? 'Yes' : 'No');
    return data;
  },

  // Get user's trips
  async getUserTrips(userId: string) {
    const { data } = await supabase
      .from('trips')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    return data || [];
  },

  // Subscribe to realtime changes for a specific trip
  subscribeToTrip(tripId: string, callback: TripChangeCallback) {
    console.log('TripService - Subscribing to realtime changes for trip:', tripId);
    
    const subscription = supabase
      .channel(`trip_${tripId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'trips',
          filter: `trip_id=eq.${tripId}`
        },
        (payload) => {
          console.log('TripService - Realtime update received for trip:', tripId, payload);
          callback(payload.new as TripData);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'trips',
          filter: `trip_id=eq.${tripId}`
        },
        (payload) => {
          console.log('TripService - Trip deleted:', tripId, payload);
          // Call callback with null to indicate trip was deleted
          callback(null as any);
        }
      )
      .subscribe();

    return subscription;
  },

  // Subscribe to realtime changes for all user's trips
  subscribeToUserTrips(userId: string, callback: TripChangeCallback) {
    console.log('TripService - Subscribing to realtime changes for user trips:', userId);
    
    const subscription = supabase
      .channel(`user_trips_${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trips',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('TripService - Realtime change received for user trips:', userId, payload);
          callback(payload.new as TripData);
        }
      )
      .subscribe();

    return subscription;
  },

  // Unsubscribe from realtime changes
  unsubscribe(subscription: any) {
    if (subscription) {
      console.log('TripService - Unsubscribing from realtime changes');
      supabase.removeChannel(subscription);
    }
  }
}; 