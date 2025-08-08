// WARNING: This file uses the Supabase service role key and must NEVER be imported in any client-side code.
// For server-side/admin use only. Exposing the service role key to the client is a critical security risk.

import { createClient } from '@supabase/supabase-js';

export interface TripData {
  trip_id: string;
  user_id: string;
  origin?: string;
  destination?: string;
  departure_date?: string;
  return_date?: string;
  passenger_count?: number;
}

// Create a server-side Supabase client with service role key
function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing required environment variables for server-side Supabase client');
  }
  
  return createClient(supabaseUrl, supabaseServiceKey);
}

// Generate a unique trip ID
function generateTripId(): string {
  return `trip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export const tripServiceServer = {
  // Create a new trip
  async createTrip(tripData: { user_id: string; name?: string; description?: string }) {
    const tripId = generateTripId();
    console.log('TripServiceServer - Creating new trip with ID:', tripId, 'for user:', tripData.user_id);
    
    const supabaseServer = createServerClient();
    const { data, error } = await supabaseServer
      .from('trips')
      .insert({ 
        trip_id: tripId,
        user_id: tripData.user_id,
        name: tripData.name,
        description: tripData.description
      })
      .select()
      .single();

    if (error) {
      console.error('TripServiceServer - Error creating trip:', error);
      return null;
    }
    
    console.log('TripServiceServer - Successfully created trip:', tripId);
    return data;
  },

  // Get trip by ID (bypasses RLS)
  async getTrip(tripId: string) {
    console.log('TripServiceServer - Getting trip by ID:', tripId);
    
    const supabaseServer = createServerClient();
    const { data, error } = await supabaseServer
      .from('trips')
      .select('*')
      .eq('trip_id', tripId)
      .single();
    
    if (error) {
      console.error('TripServiceServer - Error getting trip:', error);
      return null;
    }
    
    console.log('TripServiceServer - Found trip:', data ? 'Yes' : 'No');
    return data;
  },

  // Get trip by ID (alias for getTrip)
  async getTripById(tripId: string, userId: string) {
    console.log('TripServiceServer - Getting trip by ID:', tripId, 'for user:', userId);
    
    const supabaseServer = createServerClient();
    const { data, error } = await supabaseServer
      .from('trips')
      .select('*')
      .eq('trip_id', tripId)
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('TripServiceServer - Error getting trip:', error);
      return null;
    }
    
    console.log('TripServiceServer - Found trip:', data ? 'Yes' : 'No');
    return data;
  },

  // Update trip details from AI (bypasses RLS)
  async updateTrip(tripId: string, updates: Partial<TripData>): Promise<boolean> {
    const supabaseServer = createServerClient();
    const { error } = await supabaseServer
      .from('trips')
      .update(updates)
      .eq('trip_id', tripId);

    return !error;
  },

  // Get user's trips (bypasses RLS)
  async getUserTrips(userId: string) {
    const supabaseServer = createServerClient();
    const { data } = await supabaseServer
      .from('trips')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    return data || [];
  },

  // Get trips by user ID (alias for getUserTrips)
  async getTripsByUserId(userId: string) {
    return this.getUserTrips(userId);
  },

  // Delete trip
  async deleteTrip(tripId: string, userId: string): Promise<boolean> {
    console.log('TripServiceServer - Deleting trip:', tripId, 'for user:', userId);
    
    const supabaseServer = createServerClient();
    const { error } = await supabaseServer
      .from('trips')
      .delete()
      .eq('trip_id', tripId)
      .eq('user_id', userId);

    if (error) {
      console.error('TripServiceServer - Error deleting trip:', error);
      return false;
    }
    
    console.log('TripServiceServer - Successfully deleted trip:', tripId);
    return true;
  }
}; 