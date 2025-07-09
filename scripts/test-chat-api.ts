import { testChatAPI } from '../src/app/api/__tests__/chat.test';

// Test runner for Chat API integration tests
async function runChatAPITests() {
  console.log('🚀 Starting Chat API Integration Tests...\n');
  
  // Check environment variables
  const requiredEnvVars = [
    'OPENAI_API_KEY',
    'TEQUILA_API_KEY',
    'TEQUILA_BASE_URL'
  ];
  
  const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingEnvVars.length > 0) {
    console.log('⚠️  Warning: Some environment variables are missing:');
    missingEnvVars.forEach(varName => console.log(`   - ${varName}`));
    console.log('\nSome tests may fail due to missing environment variables.\n');
  }
  
  try {
    const success = await testChatAPI();
    
    if (success) {
      console.log('\n✅ All Chat API integration tests passed!');
      process.exit(0);
    } else {
      console.log('\n❌ Some Chat API integration tests failed.');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n💥 Chat API integration tests crashed:', error);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runChatAPITests();
}

export { runChatAPITests }; 