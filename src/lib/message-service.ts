import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with service role key for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface Message {
  id: string;
  trip_id: string;
  user_id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  cards?: string;
  follow_up?: string;
  trip_context?: string;
}

export interface CreateMessageData {
  trip_id: string;
  user_id: string;
  type: 'user' | 'ai';
  content: string;
  cards?: any[];
  follow_up?: string;
  trip_context?: any;
}

export class MessageService {
  /**
   * Create a new message in the database
   */
  static async createMessage(data: CreateMessageData): Promise<Message | null> {
    try {
      const { data: message, error } = await supabase
        .from('messages')
        .insert({
          trip_id: data.trip_id,
          user_id: data.user_id,
          type: data.type,
          content: data.content,
          cards: data.cards ? JSON.stringify(data.cards) : null,
          follow_up: data.follow_up,
          trip_context: data.trip_context ? JSON.stringify(data.trip_context) : null
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating message:', error);
        return null;
      }

      return {
        ...message,
        timestamp: new Date(message.timestamp),
        cards: message.cards,
        trip_context: message.trip_context
      };
    } catch (error) {
      console.error('Error creating message:', error);
      return null;
    }
  }

  /**
   * Get all messages for a specific trip
   */
  static async getMessagesByTripId(tripId: string, userId: string): Promise<Message[]> {
    try {
      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .eq('trip_id', tripId)
        .eq('user_id', userId)
        .order('timestamp', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return [];
      }

      return messages.map(message => ({
        ...message,
        timestamp: new Date(message.timestamp),
        cards: message.cards,
        trip_context: message.trip_context
      }));
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }

  /**
   * Get the latest message for a trip
   */
  static async getLatestMessage(tripId: string, userId: string): Promise<Message | null> {
    try {
      const { data: message, error } = await supabase
        .from('messages')
        .select('*')
        .eq('trip_id', tripId)
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching latest message:', error);
        return null;
      }

      return {
        ...message,
        timestamp: new Date(message.timestamp),
        cards: message.cards,
        trip_context: message.trip_context
      };
    } catch (error) {
      console.error('Error fetching latest message:', error);
      return null;
    }
  }

  /**
   * Get message count for a trip
   */
  static async getMessageCount(tripId: string, userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('trip_id', tripId)
        .eq('user_id', userId);

      if (error) {
        console.error('Error counting messages:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Error counting messages:', error);
      return 0;
    }
  }

  /**
   * Delete all messages for a trip (admin function)
   */
  static async deleteMessagesByTripId(tripId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('trip_id', tripId);

      if (error) {
        console.error('Error deleting messages:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting messages:', error);
      return false;
    }
  }
} 