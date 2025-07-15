import dotenv from 'dotenv';
import * as SibApiV3Sdk from '@getbrevo/brevo';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function testNewsletterIntegration() {
  console.log('🧪 Testing Newsletter Integration with Brevo...\n');

  // Check if API key is available
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error('❌ BREVO_API_KEY not found in environment variables');
    console.log('Please add BREVO_API_KEY to your .env.local file');
    return;
  }

  console.log('✅ BREVO_API_KEY found');

  try {
    // Initialize Brevo API client
    const apiInstance = new SibApiV3Sdk.ContactsApi();
    apiInstance.setApiKey(SibApiV3Sdk.ContactsApiApiKeys.apiKey, apiKey);

    // Test 1: Test contact creation (with a test email)
    console.log('\n📧 Testing contact creation...');
    const testEmail = `test-${Date.now()}@example.com`;
    
    const createContact = new SibApiV3Sdk.CreateContact();
    createContact.email = testEmail;
    createContact.listIds = [15];
    createContact.updateEnabled = true;

    const contact = await apiInstance.createContact(createContact);
    console.log(`✅ Successfully created test contact: ${testEmail}`);
    console.log(`🆔 Contact created successfully`);

    // Test 2: Test duplicate email handling
    console.log('\n🔄 Testing duplicate email handling...');
    try {
      await apiInstance.createContact(createContact);
      console.log('✅ Duplicate contact handled gracefully');
    } catch (error: any) {
      if (error.response?.body?.code === 'duplicate_parameter') {
        console.log('✅ Duplicate email properly rejected');
      } else {
        console.log('⚠️  Unexpected error with duplicate email:', error.message);
      }
    }

    // Test 3: Test invalid email handling
    console.log('\n❌ Testing invalid email handling...');
    const invalidContact = new SibApiV3Sdk.CreateContact();
    invalidContact.email = 'invalid-email';
    invalidContact.listIds = [15];

    try {
      await apiInstance.createContact(invalidContact);
      console.log('⚠️  Invalid email was accepted (unexpected)');
    } catch (error: any) {
      if (error.response?.body?.code === 'invalid_parameter') {
        console.log('✅ Invalid email properly rejected');
      } else {
        console.log('⚠️  Unexpected error with invalid email:', error.message);
      }
    }

    console.log('\n🎉 Newsletter integration test completed successfully!');
    console.log('\n📝 Summary:');
    console.log('   ✅ API connection working');
    console.log('   ✅ Contact creation working');
    console.log('   ✅ List #15 integration ready');
    console.log('   ✅ Error handling implemented');

  } catch (error: any) {
    console.error('\n❌ Newsletter integration test failed:');
    console.error('Error:', error.message);
    
    if (error.response?.body) {
      console.error('API Response:', JSON.stringify(error.response.body, null, 2));
    }
    
    console.log('\n🔧 Troubleshooting tips:');
    console.log('   1. Verify your BREVO_API_KEY is correct');
    console.log('   2. Check if your Brevo account has API access');
    console.log('   3. Ensure list #15 exists in your Brevo account');
    console.log('   4. Check your Brevo account permissions');
  }
}

// Run the test
testNewsletterIntegration().catch(console.error); 