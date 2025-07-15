import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export interface MessageCounter {
  id: string;
  user_id: string;
  message_count: number;
  created_at: string;
  updated_at: string;
}

export class MessageCounterServiceServer {
  // Server-side version that bypasses RLS
  static async getUserCounter(userId: string): Promise<MessageCounter> {
    const { data, error } = await supabase
      .from('user_message_counters')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code === 'PGRST116') {
      return this.createUserCounter(userId);
    }

    if (error) throw error;
    return data;
  }

  static async createUserCounter(userId: string): Promise<MessageCounter> {
    const initialCount = parseInt(process.env.MESSAGE_COUNTER_INITIAL_COUNT || '50');
    
    const { data, error } = await supabase
      .from('user_message_counters')
      .insert({
        user_id: userId,
        message_count: initialCount
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async decreaseMessageCount(userId: string, amount: number = 1): Promise<MessageCounter> {
    // First get current count
    const { data: currentCounter, error: fetchError } = await supabase
      .from('user_message_counters')
      .select('message_count')
      .eq('user_id', userId)
      .single();

    if (fetchError) throw fetchError;

    const newCount = Math.max((currentCounter.message_count || 0) - amount, 0);

    const { data, error } = await supabase
      .from('user_message_counters')
      .update({
        message_count: newCount,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async hasEnoughMessages(userId: string, required: number = 1): Promise<boolean> {
    const counter = await this.getUserCounter(userId);
    return counter.message_count >= required;
  }

  // Use referral code (server-side version)
  static async useReferral(referralCode: string, refereeUserId: string): Promise<boolean> {
    const { data: referral, error: referralError } = await supabase
      .from('user_referrals')
      .select('*')
      .eq('referral_code', referralCode)
      .eq('is_used', false)
      .single();

    if (referralError || !referral) {
      throw new Error('Invalid or already used referral code');
    }

    // Mark referral as used
    const { error: updateError } = await supabase
      .from('user_referrals')
      .update({
        is_used: true,
        used_at: new Date().toISOString()
      })
      .eq('id', referral.id);

    if (updateError) throw updateError;

    // Give bonus to both referrer and referee
    const referralBonus = parseInt(process.env.MESSAGE_COUNTER_REFERRAL_BONUS || '25');
    
    await this.increaseMessageCount(referral.referrer_id, referralBonus, 'referral_sent');
    await this.increaseMessageCount(refereeUserId, referralBonus, 'referral_used');

    return true;
  }

  // Increase message count (server-side version)
  static async increaseMessageCount(userId: string, amount: number, reason: string): Promise<MessageCounter> {
    // First get current count
    const { data: currentCounter, error: fetchError } = await supabase
      .from('user_message_counters')
      .select('message_count')
      .eq('user_id', userId)
      .single();

    if (fetchError) throw fetchError;

    const newCount = (currentCounter.message_count || 0) + amount;

    const { data, error } = await supabase
      .from('user_message_counters')
      .update({
        message_count: newCount,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    
    // Log the earning action (optional)
    console.log(`User ${userId} earned ${amount} messages for: ${reason}`);
    
    return data;
  }
} 