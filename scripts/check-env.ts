import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Required environment variables
const requiredEnvVars = [
  'OPENAI_API_KEY',
  'TEQUILA_API_KEY',
  'TEQUILA_BASE_URL',
  'RAPIDAPI_KEY',
  'RAPIDAPI_HOST',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'BREVO_API_KEY',
  'SUPPORT_EMAIL_ADDRESS'
];

// Optional environment variables
const optionalEnvVars = [
  'SUPABASE_SERVICE_ROLE_KEY'
];

function checkEnvironmentVariables() {
  console.log('🔍 Checking Environment Variables...\n');
  
  let allRequiredSet = true;
  
  // Check required variables
  console.log('📋 Required Environment Variables:');
  requiredEnvVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      console.log(`   ✅ ${varName}: ${value.substring(0, 10)}...`);
    } else {
      console.log(`   ❌ ${varName}: Not set`);
      allRequiredSet = false;
    }
  });
  
  console.log('\n📋 Optional Environment Variables:');
  optionalEnvVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      console.log(`   ✅ ${varName}: ${value.substring(0, 10)}...`);
    } else {
      console.log(`   ⚠️  ${varName}: Not set (optional)`);
    }
  });
  
  console.log('\n📝 Environment Setup Instructions:');
  
  if (!allRequiredSet) {
    console.log('\n❌ Missing required environment variables!');
    console.log('\nPlease create a `.env.local` file in the root directory with the following variables:');
    console.log('\n```env');
    requiredEnvVars.forEach(varName => {
      if (!process.env[varName]) {
        console.log(`${varName}=your_${varName.toLowerCase()}_here`);
      }
    });
    console.log('```');
    
    console.log('\n📚 How to get these values:');
    console.log('- OpenAI API Key: https://platform.openai.com/api-keys');
    console.log('- Tequila API Key: https://tequila.kiwi.com/developers');
    console.log('- RapidAPI Key: https://rapidapi.com (subscribe to Booking.com API)');
    console.log('- Supabase URL & Keys: https://supabase.com (create a new project)');
    console.log('- Brevo API Key: https://brevo.com (for newsletter and contact form)');
    console.log('- Support Email Address: Your support email address for contact form');
    
    return false;
  } else {
    console.log('\n✅ All required environment variables are set!');
    console.log('\n🚀 You can now run the application with:');
    console.log('   npm run dev');
    return true;
  }
}

// Run check if this file is executed directly
if (require.main === module) {
  const success = checkEnvironmentVariables();
  process.exit(success ? 0 : 1);
}

export { checkEnvironmentVariables }; 