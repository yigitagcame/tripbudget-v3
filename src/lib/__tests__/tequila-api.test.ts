import { searchFlights } from '../tequila-api';

// Simple test function that can be run manually
export async function testTequilaAPI() {
  console.log('Testing Tequila API...');
  
  try {
    // Test 1: Basic search with required parameters
    console.log('Test 1: Basic search...');
    const basicParams = {
      fly_from: 'LON',
      date_from: '01/08/2025',
      date_to: '03/08/2025'
    };
    
    const result = await searchFlights(basicParams);
    console.log('✅ Basic search successful:', {
      hasData: !!result.data,
      dataLength: result.data?.length,
      currency: result.currency,
      searchId: result.search_id
    });
    
    // Test 2: Search with optional parameters
    console.log('Test 2: Search with optional parameters...');
    const fullParams = {
      fly_from: 'LON',
      fly_to: 'NYC',
      date_from: '01/08/2025',
      date_to: '03/08/2025',
      adults: 2,
      children: 1,
      selected_cabins: 'M',
      curr: 'USD',
      limit: 5,
      sort: 'price' as const
    };
    
    const fullResult = await searchFlights(fullParams);
    console.log('✅ Full search successful:', {
      hasData: !!fullResult.data,
      dataLength: fullResult.data?.length,
      currency: fullResult.currency
    });
    
    // Test 3: Check flight data structure
    if (fullResult.data && fullResult.data.length > 0) {
      const flight = fullResult.data[0];
      console.log('✅ Flight data structure check:', {
        hasId: !!flight.id,
        hasFlyFrom: !!flight.flyFrom,
        hasFlyTo: !!flight.flyTo,
        hasPrice: !!flight.price,
        hasBookingLink: !!flight.deep_link
      });
    }
    
    console.log('🎉 All tests passed!');
    return true;
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
}

// Export for manual testing
export { searchFlights }; 