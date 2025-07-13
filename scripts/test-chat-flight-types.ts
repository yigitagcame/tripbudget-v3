import { NextRequest } from 'next/server';
import { POST } from '../src/app/api/chat/route';

async function testChatFlightTypes() {
  console.log('🧪 Testing Chat API with Flight Search Types...\n');

  // Mock session data for testing
  const mockSession = {
    user: { id: 'test-user-id', email: 'test@example.com' }
  };

  const testCases = [
    {
      name: 'Cheapest flights request',
      message: 'I need the cheapest flights from London to New York for August 1-3, 2025',
      expectedSearchType: 'cheapest'
    },
    {
      name: 'Fastest flights request',
      message: 'Show me the fastest flights from London to New York for August 1-3, 2025',
      expectedSearchType: 'fastest'
    },
    {
      name: 'Best flights request',
      message: 'I want the best flights from London to New York for August 1-3, 2025',
      expectedSearchType: 'best'
    },
    {
      name: 'Generic flights request (should default to best)',
      message: 'Find flights from London to New York for August 1-3, 2025',
      expectedSearchType: 'best'
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n📝 Testing: ${testCase.name}`);
    console.log(`   Message: "${testCase.message}"`);
    console.log(`   Expected search type: ${testCase.expectedSearchType}`);

    try {
      // Create a mock request
      const requestBody = {
        message: testCase.message,
        conversationHistory: [],
        tripId: 'test-trip-id'
      };

      const request = new NextRequest('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'sb-access-token=mock-token; sb-refresh-token=mock-refresh-token'
        },
        body: JSON.stringify(requestBody)
      });

      // Mock the Supabase client to return a valid session
      const originalCreateSupabaseServerClient = require('../src/lib/supabase-server').createSupabaseServerClient;
      require('../src/lib/supabase-server').createSupabaseServerClient = () => ({
        auth: {
          getSession: async () => ({ data: { session: mockSession }, error: null })
        }
      });

      const response = await POST(request);
      const responseData = await response.json();

      if (response.ok) {
        console.log('   ✅ Chat API response successful');
        console.log(`   Response status: ${response.status}`);
        
        if (responseData.cards && responseData.cards.length > 0) {
          console.log(`   Flight cards returned: ${responseData.cards.length}`);
          console.log(`   First card title: ${responseData.cards[0].title}`);
          console.log(`   First card price: ${responseData.cards[0].price}`);
        } else {
          console.log('   No flight cards returned');
        }
        
        console.log(`   AI message: ${responseData.content.substring(0, 100)}...`);
      } else {
        console.log(`   ❌ Chat API failed with status: ${response.status}`);
        console.log(`   Error: ${responseData.error || 'Unknown error'}`);
      }

      // Restore original function
      require('../src/lib/supabase-server').createSupabaseServerClient = originalCreateSupabaseServerClient;

    } catch (error) {
      console.log(`   ❌ Test failed with error: ${error}`);
    }
  }

  console.log('\n🎉 Chat flight types test completed!');
}

// Check environment variables
const requiredEnvVars = ['TEQUILA_API_KEY', 'TEQUILA_BASE_URL', 'OPENAI_API_KEY'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
  console.log('Please add them to your .env.local file');
  process.exit(1);
}

// Run the test
testChatFlightTypes(); 