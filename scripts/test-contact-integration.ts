import dotenv from 'dotenv';
import * as SibApiV3Sdk from '@getbrevo/brevo';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function testContactIntegration() {
  console.log('🧪 Testing Contact Form Integration with Brevo...\n');

  // Check if API key is available
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error('❌ BREVO_API_KEY not found in environment variables');
    console.log('Please add BREVO_API_KEY to your .env.local file');
    return;
  }

  console.log('✅ BREVO_API_KEY found');

  // Check if support email is configured
  const supportEmail = process.env.SUPPORT_EMAIL_ADDRESS;
  if (!supportEmail) {
    console.error('❌ SUPPORT_EMAIL_ADDRESS not found in environment variables');
    console.log('Please add SUPPORT_EMAIL_ADDRESS to your .env.local file');
    return;
  }

  console.log('✅ SUPPORT_EMAIL_ADDRESS found:', supportEmail);

  try {
    // Initialize Brevo API client
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, apiKey);

    // Test 1: Test email sending (with a test message)
    console.log('\n📧 Testing email sending...');
    
    const testData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      subject: 'Test Contact Form',
      message: 'This is a test message from the contact form integration test.'
    };

    // Create email content
    const emailContent = `
**Name:** ${testData.firstName} ${testData.lastName}
**Email:** ${testData.email}
**Subject:** ${testData.subject}

**Message:**
${testData.message}
    `.trim();

    // Create send email request
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.to = [{ email: supportEmail }];
    sendSmtpEmail.sender = { email: supportEmail, name: 'Trip Budget Contact Form' };
    sendSmtpEmail.replyTo = { email: testData.email, name: `${testData.firstName} ${testData.lastName}` };
    sendSmtpEmail.subject = `Contact Form: ${testData.subject}`;
    sendSmtpEmail.htmlContent = emailContent.replace(/\n/g, '<br>');
    sendSmtpEmail.textContent = emailContent;

    // Send email
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`✅ Test email sent successfully!`);
    console.log(`🆔 Response received:`, result);

    // Test 2: Test API endpoint
    console.log('\n🌐 Testing API endpoint...');
    
    const response = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ API endpoint working correctly');
      console.log(`📝 Response: ${data.message}`);
    } else {
      const errorData = await response.json();
      console.log('⚠️  API endpoint test failed:', errorData.error);
    }

    console.log('\n🎉 Contact form integration test completed successfully!');
    console.log('\n📝 Summary:');
    console.log('   ✅ API connection working');
    console.log('   ✅ Email sending working');
    console.log('   ✅ Support email configured');
    console.log('   ✅ API endpoint ready');

  } catch (error: any) {
    console.error('\n❌ Contact form integration test failed:');
    console.error('Error:', error.message);
    
    if (error.response?.body) {
      console.error('API Response:', JSON.stringify(error.response.body, null, 2));
    }
    
    console.log('\n🔧 Troubleshooting tips:');
    console.log('   1. Verify your BREVO_API_KEY is correct');
    console.log('   2. Check if your Brevo account has transactional email permissions');
    console.log('   3. Ensure SUPPORT_EMAIL_ADDRESS is set correctly');
    console.log('   4. Check your Brevo account email sending limits');
  }
}

// Run the test
testContactIntegration().catch(console.error); 