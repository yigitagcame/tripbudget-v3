import { sendChatMessage } from '../src/lib/chat-api';

async function testCurrencyIntegration() {
  console.log('🧪 Testing Currency Integration...\n');

  try {
    // Test with EUR currency
    console.log('1. Testing with EUR currency...');
    const eurResponse = await sendChatMessage({
      message: "Find me the cheapest flights from London to Paris for next month",
      conversationHistory: [],
      tripId: 'test-trip-id',
      currency: 'EUR'
    });
    
    console.log('EUR Response received:', eurResponse.content ? '✅' : '❌');
    console.log('Response preview:', eurResponse.content.substring(0, 100) + '...\n');

    // Test with USD currency
    console.log('2. Testing with USD currency...');
    const usdResponse = await sendChatMessage({
      message: "Find me the cheapest flights from New York to Los Angeles for next month",
      conversationHistory: [],
      tripId: 'test-trip-id',
      currency: 'USD'
    });
    
    console.log('USD Response received:', usdResponse.content ? '✅' : '❌');
    console.log('Response preview:', usdResponse.content.substring(0, 100) + '...\n');

    console.log('✅ Currency integration test completed successfully!');
    
  } catch (error) {
    console.error('❌ Currency integration test failed:', error);
  }
}

// Run the test
testCurrencyIntegration(); 