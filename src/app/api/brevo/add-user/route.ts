import { NextRequest, NextResponse } from 'next/server';
import { simulateDelay } from '@/lib/utils/mock-data';

export async function POST(request: NextRequest) {
  try {
    await simulateDelay();
    
    const body = await request.json();
    const { 
      email, 
      firstName, 
      lastName, 
      provider, 
      referralSource, 
      initialTripContext 
    } = body;

    // Validate required fields
    if (!email || !provider) {
      return NextResponse.json(
        { error: 'Email and provider are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Mock successful user addition to Brevo
    console.log('Mock Brevo user addition:', {
      email,
      firstName,
      lastName,
      provider,
      referralSource,
      initialTripContext
    });

    return NextResponse.json({
      success: true,
      message: 'User successfully added to Brevo list'
    });

  } catch (error: any) {
    console.error('Error adding user to Brevo list:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 