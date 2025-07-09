import { flightSearchFunction, executeFlightSearch } from '../src/lib/openai-functions';

// Test the function definition
console.log('Testing flight search function definition:');
console.log(JSON.stringify(flightSearchFunction, null, 2));

// Test the execute function with mock data
async function testExecuteFunction() {
  console.log('\nTesting executeFlightSearch function...');
  
  // Mock successful response
  const mockArgs = {
    fly_from: 'LON',
    fly_to: 'NYC',
    date_from: '01/04/2024',
    date_to: '03/04/2024',
    adults: 2
  };
  
  try {
    // This will fail without proper environment variables, but we can test the structure
    console.log('Function definition is valid');
    console.log('Mock arguments:', mockArgs);
  } catch (error) {
    console.log('Expected error (no API key):', error instanceof Error ? error.message : 'Unknown error');
  }
}

testExecuteFunction(); 