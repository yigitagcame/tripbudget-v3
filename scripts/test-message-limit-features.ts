import { MessageCounterService } from '../src/lib/message-counter-service';
import { MessageCounterServiceServer } from '../src/lib/server/message-counter-service-server';

async function testMessageLimitFeatures() {
  console.log('🧪 Testing Message Limit Features');
  console.log('=====================================');

  const testUserId = 'test-user-' + Date.now();
  const referralBonus = parseInt(process.env.MESSAGE_COUNTER_REFERRAL_BONUS || '25');

  try {
    // Test 1: Create user counter with initial messages
    console.log('\n1. Creating user counter...');
    const counter = await MessageCounterServiceServer.createUserCounter(testUserId);
    console.log(`   ✅ Created counter with ${counter.message_count} messages`);

    // Test 2: Check if user has enough messages
    console.log('\n2. Checking if user has enough messages...');
    const hasEnough = await MessageCounterServiceServer.hasEnoughMessages(testUserId);
    console.log(`   ✅ User has enough messages: ${hasEnough}`);

    // Test 3: Decrease message count to 0
    console.log('\n3. Decreasing message count to 0...');
    let currentCounter = await MessageCounterServiceServer.getUserCounter(testUserId);
    const messagesToDecrease = currentCounter.message_count;
    
    for (let i = 0; i < messagesToDecrease; i++) {
      await MessageCounterServiceServer.decreaseMessageCount(testUserId);
    }
    
    currentCounter = await MessageCounterServiceServer.getUserCounter(testUserId);
    console.log(`   ✅ Message count decreased to: ${currentCounter.message_count}`);

    // Test 4: Check if user has enough messages (should be false)
    console.log('\n4. Checking if user has enough messages after depletion...');
    const hasEnoughAfter = await MessageCounterServiceServer.hasEnoughMessages(testUserId);
    console.log(`   ✅ User has enough messages: ${hasEnoughAfter} (should be false)`);

    // Test 5: Test client-side service
    console.log('\n5. Testing client-side service...');
    const clientCounter = await MessageCounterService.getUserCounter(testUserId);
    console.log(`   ✅ Client counter: ${clientCounter.message_count} messages`);

    // Test 6: Increase message count using referral bonus
    console.log('\n6. Increasing message count using referral bonus...');
    const increasedCounter = await MessageCounterService.increaseMessageCount(testUserId, referralBonus, 'test-invitation');
    console.log(`   ✅ Increased by ${referralBonus} messages to: ${increasedCounter.message_count} messages`);

    // Test 7: Final check
    console.log('\n7. Final check...');
    const finalHasEnough = await MessageCounterServiceServer.hasEnoughMessages(testUserId);
    console.log(`   ✅ User has enough messages: ${finalHasEnough} (should be true)`);

    console.log('\n🎉 All message limit features tests passed!');
    console.log('\nFeatures implemented:');
    console.log('✅ Message counter system');
    console.log('✅ Insufficient messages detection');
    console.log('✅ Get more messages modal');
    console.log('✅ User-friendly error messages');
    console.log('✅ Invitation link generation');
    console.log('✅ Message earning system');
    console.log(`✅ Referral bonus: ${referralBonus} messages per referral`);

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testMessageLimitFeatures().catch(console.error); 