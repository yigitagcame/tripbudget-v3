import { NextRequest } from 'next/server';
import { POST } from '../src/app/api/chat/route';

// Mock session for testing
const mockSession = {
  user: {
    id: 'test-user-id',
    email: 'test@example.com'
  },
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token'
};

async function testDestinationCards() {
  console.log('🧪 Testing Destination Cards\n');

  const testCases = [
    {
      name: 'Destination suggestion request',
      message: 'I want to travel somewhere warm and beautiful. Can you suggest some destinations?',
      expectedCardType: 'destination'
    },
    {
      name: 'City recommendation request',
      message: 'I\'m looking for a city to visit in Europe. What would you recommend?',
      expectedCardType: 'destination'
    },
    {
      name: 'Country suggestion request',
      message: 'I want to go to a country with good food and culture. Any suggestions?',
      expectedCardType: 'destination'
    }
  ];

  for (const testCase of testCases) {
    console.log(`📝 Testing: ${testCase.name}`);
    console.log(`   Message: "${testCase.message}"`);
    console.log(`   Expected card type: ${testCase.expectedCardType}`);

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
          console.log(`   Destination cards returned: ${responseData.cards.length}`);
          
          const destinationCards = responseData.cards.filter((card: any) => card.type === 'destination');
          console.log(`   Destination type cards: ${destinationCards.length}`);
          
          if (destinationCards.length > 0) {
            console.log(`   First destination card title: ${destinationCards[0].title}`);
            console.log(`   First destination card description: ${destinationCards[0].description}`);
            console.log(`   First destination card location: ${destinationCards[0].location || 'N/A'}`);
          }
        } else {
          console.log('   No destination cards returned');
        }
        
        console.log(`   AI message: ${responseData.content.substring(0, 100)}...`);
      } else {
        console.log(`   ❌ Chat API failed with status: ${response.status}`);
        console.log(`   Error: ${responseData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.log(`   ❌ Test failed with error: ${error}`);
    }

    console.log('   ' + '─'.repeat(50));
  }

  // Restore original function
  const originalCreateSupabaseServerClient = require('../src/lib/supabase-server').createSupabaseServerClient;
  if (originalCreateSupabaseServerClient) {
    require('../src/lib/supabase-server').createSupabaseServerClient = originalCreateSupabaseServerClient;
  }
}

// Run the test
testDestinationCards().catch(console.error); 