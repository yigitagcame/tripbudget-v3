import { NextRequest, NextResponse } from 'next/server';
import { loadMockData, simulateDelay } from '@/lib/utils/mock-data';

export async function GET(request: NextRequest) {
  try {
    await simulateDelay();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            type: 'validation',
            message: 'User ID is required',
            status: 400,
            code: 'MISSING_USER_ID'
          }
        },
        { status: 400 }
      );
    }

    const mockData = loadMockData('users.json');
    if (!mockData) {
      return NextResponse.json(
        {
          success: false,
          error: {
            type: 'server',
            message: 'Failed to load mock data',
            status: 500,
            code: 'MOCK_DATA_ERROR'
          }
        },
        { status: 500 }
      );
    }

    // Find the specific user
    const user = mockData.users.find((u: any) => u.id === userId);
    
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            type: 'not_found',
            message: 'User not found',
            status: 404,
            code: 'USER_NOT_FOUND'
          }
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Users API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          type: 'server',
          message: 'Internal server error',
          status: 500,
          code: 'INTERNAL_SERVER_ERROR'
        }
      },
      { status: 500 }
    );
  }
} 