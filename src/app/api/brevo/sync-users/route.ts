import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { getBrevoUserService } from '@/lib/brevo-user-service';

export async function POST(request: NextRequest) {
  try {
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

    // TODO: Add admin role check here
    // For now, we'll allow any authenticated user to trigger sync
    // In production, you should check if the user has admin privileges

    const body = await request.json();
    const { batchSize, delayMs, resumeFrom } = body;

    // Validate parameters
    const config = {
      batchSize: batchSize || parseInt(process.env.BREVO_SYNC_BATCH_SIZE || '50'),
      delayMs: delayMs || parseInt(process.env.BREVO_SYNC_DELAY_MS || '1000'),
      maxRetries: 3,
      resumeFrom: resumeFrom || 0
    };

    // Start sync process (this would typically be done in a background job)
    // For now, we'll return a success response
    console.log('Sync request received:', config);

    return NextResponse.json({
      success: true,
      message: 'User sync process initiated',
      config
    });

  } catch (error: any) {
    console.error('Error initiating user sync:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
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

    // Get sync progress
    const brevoUserService = getBrevoUserService();
    const progress = await brevoUserService.getSyncProgress();

    return NextResponse.json({
      success: true,
      progress
    });

  } catch (error: any) {
    console.error('Error getting sync progress:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 