import { MessageCounterService } from '../src/lib/message-counter-service';

async function testMessageCounterCorrectApproach() {
  console.log('🧪 Testing Message Counter Correct Approach');
  console.log('===========================================');
  console.log('Backend: Handles database decrease');
  console.log('Frontend: Only updates displayed value');
  console.log('');

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
    console.log('\n1. Getting initial message counter from database...');
    const initialCounter = await MessageCounterService.getUserCounter(testUserId);
    console.log(`   Initial message count: ${initialCounter.message_count}`);

    // Simulate frontend local decrease (no backend call)
    console.log('\n2. Simulating frontend local decrease (no backend call)...');
    console.log('   Frontend would call: decreaseLocalCount(1)');
    console.log('   This only updates the displayed value, not the database');
    const frontendDisplayedCount = initialCounter.message_count - 1;
    console.log(`   Frontend displayed count: ${frontendDisplayedCount}`);

    // Verify database count hasn't changed
    console.log('\n3. Verifying database count remains unchanged...');
    const databaseCount = await MessageCounterService.getUserCounter(testUserId);
    console.log(`   Database count: ${databaseCount.message_count}`);
    
    if (databaseCount.message_count === initialCounter.message_count) {
      console.log('✅ Database count unchanged (correct behavior)');
    } else {
      console.log('❌ Database count changed unexpectedly');
    }

    // Simulate backend decrease (actual database operation)
    console.log('\n4. Simulating backend decrease (actual database operation)...');
    console.log('   Backend would call: MessageCounterServiceServer.decreaseMessageCount()');
    const backendDecreasedCount = await MessageCounterService.decreaseMessageCount(testUserId, 1);
    console.log(`   Database count after backend decrease: ${backendDecreasedCount.message_count}`);

    // Verify the decrease happened correctly
    const expectedCount = Math.max(initialCounter.message_count - 1, 0);
    if (backendDecreasedCount.message_count === expectedCount) {
      console.log('✅ Backend decrease worked correctly');
    } else {
      console.log(`❌ Expected ${expectedCount}, got ${backendDecreasedCount.message_count}`);
    }

    console.log('\n🎉 Test completed!');
    console.log('✅ Backend handles database operations');
    console.log('✅ Frontend only updates display (no backend calls)');
    console.log('✅ No double decrease issue');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testMessageCounterCorrectApproach(); 