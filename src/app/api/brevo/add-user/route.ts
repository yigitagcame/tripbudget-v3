import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { getBrevoUserService, BrevoUserData, BrevoUserService } from '@/lib/brevo-user-service';

export async function POST(request: NextRequest) {
  try {
    // Validate environment configuration
    if (!BrevoUserService.validateEnvironment()) {
      return NextResponse.json(
        { error: 'Brevo configuration is incomplete' },
        { status: 500 }
      );
    }

    // Create Supabase client for server-side auth
    const supabase = createSupabaseServerClient(request);

    // Check authentication
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

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

    // Prepare user data for Brevo
    const userData: BrevoUserData = {
      email,
      firstName,
      lastName,
      userId: session.user.id,
      signupDate: new Date().toISOString(),
      provider,
      referralSource,
      initialTripContext
    };

    // Add user to Brevo list
    const brevoUserService = getBrevoUserService();
    const success = await brevoUserService.addUserToMainList(userData);

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'User successfully added to Brevo list'
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to add user to Brevo list' },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('Error adding user to Brevo list:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 