import { testValidation } from '../src/lib/__tests__/validation.test';

async function main() {
  console.log('🚀 Starting Validation Tests...\n');
  
  try {
    const result = await testValidation();
    
    if (result) {
      console.log('\n✅ All validation tests completed successfully!');
      process.exit(0);
    } else {
      console.log('\n❌ Some validation tests failed!');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n💥 Test execution failed:', error);
    process.exit(1);
  }
}

main(); 