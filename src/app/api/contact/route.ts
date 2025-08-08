import { NextRequest, NextResponse } from 'next/server';
import { simulateDelay } from '@/lib/utils/mock-data';

export async function POST(request: NextRequest) {
  try {
    await simulateDelay();
    
    const { firstName, lastName, email, subject, message } = await request.json();
    
    // Validate required fields
    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Mock successful contact form submission
    console.log('Mock contact form submission:', {
      firstName,
      lastName,
      email,
      subject,
      message
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you for your message! We will get back to you soon.'
    });

  } catch (error: any) {
    console.error('Contact form error:', error);
    
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
} 