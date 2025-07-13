import { sendChatMessage } from '../src/lib/chat-api';

async function testTripContextPreservation() {
  console.log('Testing trip context preservation...');
  
  try {
    // Simulate a conversation where trip details are established
    const conversationHistory = [
      {
        id: 1,
        type: 'ai' as const,
        content: "Hi! I'm your AI travel assistant. I can help you plan your perfect trip! Tell me where you'd like to go, when you're traveling, and how many people are coming along.",
        timestamp: new Date()
      },
      {
        id: 2,
        type: 'user' as const,
        content: "I want to go to Paris in March for 2 people",
        timestamp: new Date()
      },
      {
        id: 3,
        type: 'ai' as const,
        content: "That sounds like a fantastic idea! Paris in March is absolutely magical! The weather is starting to warm up and the crowds are smaller than peak season.",
        timestamp: new Date(),
        tripContext: {
          from: '',
          to: 'Paris',
          departDate: '2024-03-15',
          returnDate: '2024-03-22',
          passengers: 2
        }
      }
    ];

    console.log('Sending follow-up message to test context preservation...');
    
    // Send a follow-up message that should preserve the existing context
    const response = await sendChatMessage({
      message: "What about hotels in Paris?",
      conversationHistory: conversationHistory,
      tripId: 'test-trip-123' // This would be a real trip ID in practice
    });

    console.log('Response received:');
    console.log('- Message:', response.content);
    console.log('- Trip Context:', response.tripContext);
    console.log('- Follow Up:', response.followUp);

    // Check if trip context was preserved
    const contextPreserved = response.tripContext && 
      response.tripContext.to === 'Paris' && 
      response.tripContext.passengers === 2;

    if (contextPreserved) {
      console.log('✅ Trip context was preserved correctly!');
    } else {
      console.log('❌ Trip context was not preserved correctly');
      console.log('Expected: to=Paris, passengers=2');
      console.log('Actual:', response.tripContext);
    }

    return contextPreserved;

  } catch (error) {
    console.error('Error testing trip context preservation:', error);
    return false;
  }
}

// Run the test
testTripContextPreservation().then(success => {
  if (success) {
    console.log('\n🎉 Trip context preservation test passed!');
    process.exit(0);
  } else {
    console.log('\n❌ Trip context preservation test failed!');
    process.exit(1);
  }
}); 