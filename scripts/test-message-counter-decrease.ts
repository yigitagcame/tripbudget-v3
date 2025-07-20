import { MessageCounterService } from '../src/lib/message-counter-service';

async function testMessageCounterDecrease() {
  console.log('🧪 Testing Message Counter Decrease Functionality');
  console.log('================================================');

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

    // Decrease counter by 1
    console.log('\n2. Decreasing message counter by 1...');
    const decreasedCounter = await MessageCounterService.decreaseMessageCount(testUserId, 1);
    console.log(`   New message count: ${decreasedCounter.message_count}`);

    // Verify decrease
    const expectedCount = Math.max(initialCounter.message_count - 1, 0);
    if (decreasedCounter.message_count === expectedCount) {
      console.log('✅ Message counter decreased correctly!');
    } else {
      console.log(`❌ Expected ${expectedCount}, got ${decreasedCounter.message_count}`);
    }

    // Test decreasing by 0 (should not change)
    console.log('\n3. Testing decrease by 0...');
    const unchangedCounter = await MessageCounterService.decreaseMessageCount(testUserId, 0);
    console.log(`   Message count after decrease by 0: ${unchangedCounter.message_count}`);

    if (unchangedCounter.message_count === decreasedCounter.message_count) {
      console.log('✅ Decrease by 0 works correctly (no change)');
    } else {
      console.log('❌ Decrease by 0 should not change the counter');
    }

    // Test decreasing below 0 (should not go below 0)
    console.log('\n4. Testing decrease below 0...');
    const largeDecrease = await MessageCounterService.decreaseMessageCount(testUserId, 1000);
    console.log(`   Message count after large decrease: ${largeDecrease.message_count}`);

    if (largeDecrease.message_count === 0) {
      console.log('✅ Counter correctly prevented from going below 0');
    } else {
      console.log('❌ Counter should not go below 0');
    }

    console.log('\n🎉 All tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testMessageCounterDecrease(); 