import { NextRequest, NextResponse } from 'next/server';
import { simulateDelay } from '@/lib/utils/mock-data';

export async function POST(request: NextRequest) {
  try {
    await simulateDelay();
    
    const { referralCode } = await request.json();
    
    if (!referralCode) {
      return NextResponse.json({ error: 'Referral code required' }, { status: 400 });
    }

    // Mock referral code usage
    console.log('Mock referral code usage:', { referralCode });

    // Simulate some referral codes as already used
    if (referralCode === 'USED123' || referralCode === 'EXPIRED456') {
      return NextResponse.json(
        { error: 'This invitation link has already been used or is invalid' },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Referral bonus applied successfully!'
    });
  } catch (error) {
    console.error('Error using referral code:', error);
    
    return NextResponse.json(
      { error: 'Unable to apply referral bonus. Please try again.' },
      { status: 500 }
    );
  }
} 