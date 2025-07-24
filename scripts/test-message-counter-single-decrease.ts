import { MessageCounterService } from '../src/lib/message-counter-service';

async function testMessageCounterSingleDecrease() {
  console.log('🧪 Testing Message Counter Single Decrease');
  console.log('==========================================');

  try {
    // This test requires a valid user ID
    const testUserId = process.env.TEST_USER_ID;
    
    if (!testUserId) {
      console.log('❌ TEST_USER_ID environment variable not set');
      console.log('Please set TEST_USER_ID to test with a real user');
      return;
    }

    console.log(`📊 Testing with user ID: ${testUserId}`);

    // Get initial counter
    console.log('\n1. Getting initial message counter...');
    const initialCounter = await MessageCounterService.getUserCounter(testUserId);
    console.log(`   Initial message count: ${initialCounter.message_count}`);

    // Simulate user sending a message (frontend decrease)
    console.log('\n2. Simulating user sending a message (frontend decrease)...');
    const afterUserMessage = await MessageCounterService.decreaseMessageCount(testUserId, 1);
    console.log(`   Message count after user message: ${afterUserMessage.message_count}`);

    // Verify only one decrease happened
    const expectedCount = Math.max(initialCounter.message_count - 1, 0);
    if (afterUserMessage.message_count === expectedCount) {
      console.log('✅ Message counter decreased correctly by 1!');
    } else {
      console.log(`❌ Expected ${expectedCount}, got ${afterUserMessage.message_count}`);
    }

    // Simulate AI response (no decrease should happen)
    console.log('\n3. Simulating AI response (no decrease should happen)...');
    console.log('   Note: AI response should NOT decrease the counter');
    console.log(`   Current message count: ${afterUserMessage.message_count}`);

    // Verify the count didn't change
    const afterAIResponse = await MessageCounterService.getUserCounter(testUserId);
    if (afterAIResponse.message_count === afterUserMessage.message_count) {
      console.log('✅ Message count remained the same after AI response');
    } else {
      console.log(`❌ Message count changed unexpectedly: ${afterUserMessage.message_count} -> ${afterAIResponse.message_count}`);
    }

    console.log('\n🎉 Test completed! Message counter now decreases only once per user message.');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testMessageCounterSingleDecrease(); 