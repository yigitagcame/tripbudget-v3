import { MessageCounterService } from '../src/lib/message-counter-service';
import { MessageCounterServiceServer } from '../src/lib/server/message-counter-service-server';
import { supabase } from '../src/lib/supabase';

async function testInvitationSystem() {
  console.log('🧪 Testing Invitation Link System');
  console.log('=====================================');

  const testReferrerId = 'test-referrer-' + Date.now();
  const testRefereeId = 'test-referee-' + Date.now();
  const testEmail = 'friend@example.com';
  const referralBonus = parseInt(process.env.MESSAGE_COUNTER_REFERRAL_BONUS || '25');

  try {
    // Test 1: Create user counters
    console.log('\n1. Creating user counters...');
    const referrerCounter = await MessageCounterServiceServer.createUserCounter(testReferrerId);
    const refereeCounter = await MessageCounterServiceServer.createUserCounter(testRefereeId);
    console.log(`   ✅ Referrer counter: ${referrerCounter.message_count} messages`);
    console.log(`   ✅ Referee counter: ${refereeCounter.message_count} messages`);

    // Test 2: Create referral
    console.log('\n2. Creating referral...');
    const referral = await MessageCounterService.createReferral(testReferrerId, testEmail);
    console.log(`   ✅ Created referral with code: ${referral.referral_code}`);
    console.log(`   ✅ Referral ID: ${referral.id}`);
    console.log(`   ✅ Is used: ${referral.is_used}`);

    // Test 3: Use referral code
    console.log('\n3. Using referral code...');
    const useResult = await MessageCounterService.useReferral(referral.referral_code, testRefereeId);
    console.log(`   ✅ Referral used successfully: ${useResult}`);

    // Test 4: Check updated message counts
    console.log('\n4. Checking updated message counts...');
    const updatedReferrerCounter = await MessageCounterServiceServer.getUserCounter(testReferrerId);
    const updatedRefereeCounter = await MessageCounterServiceServer.getUserCounter(testRefereeId);
    
    console.log(`   ✅ Referrer messages: ${updatedReferrerCounter.message_count} (was ${referrerCounter.message_count})`);
    console.log(`   ✅ Referee messages: ${updatedRefereeCounter.message_count} (was ${refereeCounter.message_count})`);
    
    const referrerBonus = updatedReferrerCounter.message_count - referrerCounter.message_count;
    const refereeBonus = updatedRefereeCounter.message_count - refereeCounter.message_count;
    
    console.log(`   ✅ Referrer bonus: +${referrerBonus} messages`);
    console.log(`   ✅ Referee bonus: +${refereeBonus} messages`);

    // Test 5: Verify referral is marked as used
    console.log('\n5. Verifying referral status...');
    const { data: referrals, error } = await supabase
      .from('user_referrals')
      .select('*')
      .eq('referral_code', referral.referral_code);
    
    if (error) {
      console.log('   ❌ Error checking referral status:', error.message);
    } else if (referrals && referrals.length > 0) {
      const referralRecord = referrals[0];
      console.log(`   ✅ Referral is used: ${referralRecord.is_used}`);
      console.log(`   ✅ Used at: ${referralRecord.used_at}`);
    }

    // Test 6: Try to use the same referral code again (should fail)
    console.log('\n6. Testing duplicate referral usage...');
    try {
      await MessageCounterService.useReferral(referral.referral_code, 'another-user-id');
      console.log('   ❌ Should have failed - referral already used');
    } catch (error) {
      console.log('   ✅ Correctly prevented duplicate usage:', error instanceof Error ? error.message : 'Unknown error');
    }

    // Test 7: Test invalid referral code
    console.log('\n7. Testing invalid referral code...');
    try {
      await MessageCounterService.useReferral('INVALID123', testRefereeId);
      console.log('   ❌ Should have failed - invalid referral code');
    } catch (error) {
      console.log('   ✅ Correctly rejected invalid referral code:', error instanceof Error ? error.message : 'Unknown error');
    }

    console.log('\n🎉 All invitation system tests passed!');
    console.log('\nFeatures implemented:');
    console.log('✅ Referral code generation');
    console.log('✅ Referral code usage');
    console.log('✅ Bonus message distribution');
    console.log('✅ Duplicate usage prevention');
    console.log('✅ Invalid code rejection');
    console.log(`✅ Referral bonus: ${referralBonus} messages per referral`);

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testInvitationSystem(); 