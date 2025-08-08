import { NextRequest, NextResponse } from 'next/server';
import { simulateDelay } from '@/lib/utils/mock-data';

export async function POST(request: NextRequest) {
  try {
    await simulateDelay();
    
    const body = await request.json();
    const { batchSize, delayMs, resumeFrom } = body;

    // Validate parameters
    const config = {
      batchSize: batchSize || 50,
      delayMs: delayMs || 1000,
      maxRetries: 3,
      resumeFrom: resumeFrom || 0
    };

    // Mock sync process initiation
    console.log('Mock sync request received:', config);

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
    await simulateDelay();
    
    // Mock sync progress
    const progress = {
      totalUsers: 150,
      syncedUsers: 120,
      failedUsers: 5,
      remainingUsers: 25,
      syncStatus: 'in_progress',
      lastSyncTime: new Date().toISOString(),
      estimatedCompletion: new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 minutes from now
    };

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