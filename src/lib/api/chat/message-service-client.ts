import { supabase } from '../../config/supabase';

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

export class MessageServiceClient {
  /**
   * Get all messages for a specific trip (client-side)
   */
  static async getMessagesByTripId(tripId: string): Promise<Message[]> {
    try {
      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .eq('trip_id', tripId)
        .order('timestamp', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return [];
      }

      return messages.map(message => ({
        ...message,
        timestamp: new Date(message.timestamp),
        cards: message.cards ? JSON.parse(message.cards) : undefined,
        trip_context: message.trip_context ? JSON.parse(message.trip_context) : undefined
      }));
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }

  /**
   * Subscribe to real-time message updates for a trip
   */
  static subscribeToMessages(tripId: string, callback: (message: Message) => void) {
    return supabase
      .channel(`messages_${tripId}`)
      .on(
        'postgres_changes' as any,
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `trip_id=eq.${tripId}`
        },
        (payload) => {
          const message = payload.new as Message;
          callback({
            ...message,
            timestamp: new Date(message.timestamp),
            cards: message.cards ? JSON.parse(message.cards) : undefined,
            trip_context: message.trip_context ? JSON.parse(message.trip_context) : undefined
          });
        }
      )
      .subscribe();
  }

  /**
   * Unsubscribe from real-time message updates
   */
  static unsubscribeFromMessages(tripId: string) {
    supabase.channel(`messages_${tripId}`).unsubscribe();
  }
} 