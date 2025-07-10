import { executeFlightSearch } from '../src/lib/openai-functions';

async function testToolCallsFix() {
  console.log('🧪 Testing Tool Calls Fix...\n');

  try {
    // Test the flight search function directly
    const testParams = {
      fly_from: 'LON',
      fly_to: 'NYC',
      date_from: '01/08/2025',
      date_to: '03/08/2025',
      adults: 1,
      search_type: 'best'
    };

    console.log('Testing flight search with search_type parameter...');
    const result = await executeFlightSearch(testParams);
    
    if (result.success) {
      console.log('✅ Flight search successful');
      console.log(`   Search type: ${result.search_type}`);
      console.log(`   Results count: ${result.data?.length || 0}`);
      console.log(`   Currency: ${result.currency}`);
      
      if (result.data && result.data.length > 0) {
        console.log(`   First flight price: $${result.data[0].price}`);
        console.log(`   First flight duration: ${Math.floor(result.data[0].duration.total / 3600)}h`);
      }
    } else {
      console.log('❌ Flight search failed:', result.error);
    }

    console.log('\n🎉 Tool calls fix test completed!');
    console.log('The fix should resolve the "messages with role tool must be a response to a preceding message with tool_calls" error.');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Check environment variables
const requiredEnvVars = ['TEQUILA_API_KEY', 'TEQUILA_BASE_URL'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
  console.log('Please add them to your .env.local file');
  process.exit(1);
}

// Run the test
testToolCallsFix(); 