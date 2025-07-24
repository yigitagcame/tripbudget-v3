#!/usr/bin/env tsx

import { config } from 'dotenv';
import * as SibApiV3Sdk from '@getbrevo/brevo';

// Load environment variables
config({ path: '.env.local' });

async function testBrevoApiKey() {
  console.log('🔑 Testing Brevo API Key...\n');

  const apiKey = process.env.BREVO_API_KEY;
  
  if (!apiKey) {
    console.error('❌ BREVO_API_KEY not found in environment variables');
    return;
  }

  console.log('✅ API Key found');
  console.log('API Key length:', apiKey.length);
  console.log('API Key starts with:', apiKey.substring(0, 4) + '...');
  console.log('API Key ends with:', '...' + apiKey.substring(apiKey.length - 4));

  // Test API connection
  try {
    console.log('\n🔗 Testing API connection...');
    
    const apiInstance = new SibApiV3Sdk.ContactsApi();
    apiInstance.setApiKey(SibApiV3Sdk.ContactsApiApiKeys.apiKey, apiKey);

    // Try to get contacts list to test API connection
    const lists = await apiInstance.getLists();
    console.log('✅ API connection successful!');
    console.log('Available lists:', lists.body.lists?.length || 0);
    
    // Show available list IDs
    if (lists.body.lists) {
      console.log('\n📋 Available Lists:');
      lists.body.lists.forEach((list: any) => {
        console.log(`   ID: ${list.id}, Name: ${list.name}`);
      });
    }

  } catch (error: any) {
    console.error('❌ API connection failed:', error.message);
    
    if (error.response?.body) {
      console.error('Error details:', error.response.body);
    }
  }
}

// Run the test
testBrevoApiKey().catch(console.error); 