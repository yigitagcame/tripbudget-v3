import { executeFlightSearch } from '../src/lib/openai-functions';

async function testFlightSearchTypes() {
  console.log('🧪 Testing Flight Search Types...\n');

  const baseParams = {
    fly_from: 'LON',
    fly_to: 'NYC',
    date_from: '01/08/2025',
    date_to: '03/08/2025',
    adults: 1
  };

  try {
    // Test 1: Cheapest flights
    console.log('1️⃣ Testing CHEAPEST flights...');
    const cheapestParams = { ...baseParams, search_type: 'cheapest' };
    const cheapestResult = await executeFlightSearch(cheapestParams);
    
    if (cheapestResult.success && cheapestResult.data) {
      console.log('✅ Cheapest search successful');
      console.log(`   Results: ${cheapestResult.data.length} flights`);
      console.log(`   Search type: ${cheapestResult.search_type}`);
      if (cheapestResult.data.length > 0) {
        console.log(`   First flight price: $${cheapestResult.data[0].price}`);
        console.log(`   Duration: ${Math.floor(cheapestResult.data[0].duration.total / 3600)}h ${Math.floor((cheapestResult.data[0].duration.total % 3600) / 60)}m`);
      }
    } else {
      console.log('❌ Cheapest search failed:', cheapestResult.error);
    }

    console.log('');

    // Test 2: Fastest flights
    console.log('2️⃣ Testing FASTEST flights...');
    const fastestParams = { ...baseParams, search_type: 'fastest' };
    const fastestResult = await executeFlightSearch(fastestParams);
    
    if (fastestResult.success && fastestResult.data) {
      console.log('✅ Fastest search successful');
      console.log(`   Results: ${fastestResult.data.length} flights`);
      console.log(`   Search type: ${fastestResult.search_type}`);
      if (fastestResult.data.length > 0) {
        console.log(`   First flight price: $${fastestResult.data[0].price}`);
        console.log(`   Duration: ${Math.floor(fastestResult.data[0].duration.total / 3600)}h ${Math.floor((fastestResult.data[0].duration.total % 3600) / 60)}m`);
      }
    } else {
      console.log('❌ Fastest search failed:', fastestResult.error);
    }

    console.log('');

    // Test 3: Best flights (default)
    console.log('3️⃣ Testing BEST flights...');
    const bestParams = { ...baseParams, search_type: 'best' };
    const bestResult = await executeFlightSearch(bestParams);
    
    if (bestResult.success && bestResult.data) {
      console.log('✅ Best search successful');
      console.log(`   Results: ${bestResult.data.length} flights`);
      console.log(`   Search type: ${bestResult.search_type}`);
      if (bestResult.data.length > 0) {
        console.log(`   First flight price: $${bestResult.data[0].price}`);
        console.log(`   Duration: ${Math.floor(bestResult.data[0].duration.total / 3600)}h ${Math.floor((bestResult.data[0].duration.total % 3600) / 60)}m`);
      }
    } else {
      console.log('❌ Best search failed:', bestResult.error);
    }

    console.log('');

    // Test 4: No search type specified (should default to 'best')
    console.log('4️⃣ Testing DEFAULT search type...');
    const defaultParams = { ...baseParams };
    const defaultResult = await executeFlightSearch(defaultParams);
    
    if (defaultResult.success && defaultResult.data) {
      console.log('✅ Default search successful');
      console.log(`   Results: ${defaultResult.data.length} flights`);
      console.log(`   Search type: ${defaultResult.search_type}`);
      if (defaultResult.data.length > 0) {
        console.log(`   First flight price: $${defaultResult.data[0].price}`);
        console.log(`   Duration: ${Math.floor(defaultResult.data[0].duration.total / 3600)}h ${Math.floor((defaultResult.data[0].duration.total % 3600) / 60)}m`);
      }
    } else {
      console.log('❌ Default search failed:', defaultResult.error);
    }

    console.log('\n🎉 Flight search types test completed!');

    // Summary comparison
    if (cheapestResult.success && cheapestResult.data && fastestResult.success && fastestResult.data && bestResult.success && bestResult.data) {
      console.log('\n📊 Summary Comparison:');
      console.log(`   Cheapest: $${cheapestResult.data[0]?.price || 'N/A'} (${Math.floor((cheapestResult.data[0]?.duration.total || 0) / 3600)}h)`);
      console.log(`   Fastest: $${fastestResult.data[0]?.price || 'N/A'} (${Math.floor((fastestResult.data[0]?.duration.total || 0) / 3600)}h)`);
      console.log(`   Best: $${bestResult.data[0]?.price || 'N/A'} (${Math.floor((bestResult.data[0]?.duration.total || 0) / 3600)}h)`);
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error);
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
testFlightSearchTypes(); 