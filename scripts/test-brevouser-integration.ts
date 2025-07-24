#!/usr/bin/env tsx

import { config } from 'dotenv';
import { getBrevoUserService, BrevoUserService } from '../src/lib/brevo-user-service';

// Load environment variables
config({ path: '.env.local' });

async function testBrevoUserIntegration() {
  console.log('🧪 Testing Brevo User Integration...\n');

  // Test 1: Environment validation
  console.log('1. Testing environment validation...');
  const envValid = BrevoUserService.validateEnvironment();
  if (envValid) {
    console.log('✅ Environment variables are properly configured');
  } else {
    console.log('❌ Environment validation failed');
    console.log('Required variables: BREVO_API_KEY, BREVO_USER_LIST_ID, BREVO_UPDATE_EXISTING_CONTACTS');
    return;
  }

  // Get service instance
  const brevoUserService = getBrevoUserService();

  // Test 2: Test user data
  const testUserData = {
    email: 'test-user@example.com',
    firstName: 'Test',
    lastName: 'User',
    userId: 'test-user-id-123',
    signupDate: new Date().toISOString(),
    provider: 'google',
    referralSource: 'test-referral',
    initialTripContext: 'Test trip to Paris'
  };

  console.log('\n2. Testing user addition to Brevo list...');
  console.log('Test user data:', testUserData);
  
  try {
    const success = await brevoUserService.addUserToMainList(testUserData);
    if (success) {
      console.log('✅ User successfully added to Brevo list');
    } else {
      console.log('❌ Failed to add user to Brevo list');
    }
  } catch (error) {
    console.log('❌ Error adding user to Brevo list:', error);
  }

  // Test 3: Check if user exists in list
  console.log('\n3. Testing user existence check...');
  try {
    const exists = await brevoUserService.isUserInList(testUserData.email);
    console.log(`User ${testUserData.email} exists in list: ${exists}`);
  } catch (error) {
    console.log('❌ Error checking user existence:', error);
  }

  // Test 4: Test user data update
  console.log('\n4. Testing user data update...');
  try {
    const updateSuccess = await brevoUserService.updateUserData(testUserData.email, {
      firstName: 'Updated',
      lastName: 'Name',
      referralSource: 'updated-referral'
    });
    
    if (updateSuccess) {
      console.log('✅ User data successfully updated');
    } else {
      console.log('❌ Failed to update user data');
    }
  } catch (error) {
    console.log('❌ Error updating user data:', error);
  }

  // Test 5: Test with invalid email
  console.log('\n5. Testing with invalid email...');
  try {
    const invalidSuccess = await brevoUserService.addUserToMainList({
      ...testUserData,
      email: 'invalid-email'
    });
    console.log('Invalid email test result:', invalidSuccess);
  } catch (error) {
    console.log('❌ Error with invalid email test:', error);
  }

  console.log('\n🎉 Brevo User Integration test completed!');
}

// Run the test
testBrevoUserIntegration().catch(console.error); 