// WARNING: This file uses the Supabase service role key and must NEVER be imported in any client-side code.
// For server-side/admin use only. Exposing the service role key to the client is a critical security risk.

import { createClient } from '@supabase/supabase-js';
import { generateTripId } from '../trip-utils';

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

export const tripServiceServer = {
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
  }
}; 