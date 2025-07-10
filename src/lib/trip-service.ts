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

export const tripService = {
  // Create trip on first message
  async createTrip(userId: string): Promise<string | null> {
    const tripId = generateTripId();
    
    const { error } = await supabase
      .from('trips')
      .insert({ 
        trip_id: tripId,
        user_id: userId 
      });

    return error ? null : tripId;
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
    const { data } = await supabase
      .from('trips')
      .select('*')
      .eq('trip_id', tripId)
      .single();
    
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
  }
}; 