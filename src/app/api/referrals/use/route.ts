import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { MessageCounterService } from '@/lib/message-counter-service';

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient(request);
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { referralCode } = await request.json();
    
    if (!referralCode) {
      return NextResponse.json({ error: 'Referral code required' }, { status: 400 });
    }

    // Use the referral code
    await MessageCounterService.useReferral(referralCode, session.user.id);
    
    return NextResponse.json({ 
      success: true,
      message: 'Referral bonus applied successfully!'
    });
  } catch (error) {
    console.error('Error using referral code:', error);
    
    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message.includes('Invalid or already used')) {
        return NextResponse.json(
          { error: 'This invitation link has already been used or is invalid' },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Unable to apply referral bonus. Please try again.' },
      { status: 500 }
    );
  }
} 