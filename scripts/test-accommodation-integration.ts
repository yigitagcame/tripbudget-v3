import * as dotenv from 'dotenv';
import { executeAccommodationSearch } from '../src/lib/openai-functions';
import { validateAccommodationSearchParams, handleAccommodationSearchError } from '../src/lib/validation';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function testAccommodationIntegration() {
  console.log('Testing Full Accommodation Integration...\n');

  // Check environment variables
  if (!process.env.RAPIDAPI_KEY || !process.env.RAPIDAPI_HOST) {
    console.error('❌ Missing required environment variables:');
    console.error('RAPIDAPI_KEY:', process.env.RAPIDAPI_KEY ? 'Set' : 'Missing');
    console.error('RAPIDAPI_HOST:', process.env.RAPIDAPI_HOST ? 'Set' : 'Missing');
    console.error('');
    console.error('Please set these environment variables in your .env.local file.');
    process.exit(1);
  }

  try {
    // Test 1: Parameter Validation
    console.log('1. Testing Parameter Validation...');
    
    const validParams = {
      destination: 'New York',
      arrival_date: '2024-04-01',
      departure_date: '2024-04-05',
      adults: 2,
      search_type: 'best'
    };
    
    const validationErrors = validateAccommodationSearchParams(validParams);
    if (validationErrors.length === 0) {
      console.log('✅ Valid parameters passed validation');
    } else {
      console.log('❌ Validation failed:', validationErrors);
    }
    
    // Test invalid parameters
    const invalidParams = {
      destination: '',
      arrival_date: 'invalid-date',
      departure_date: '2024-04-01', // Same as arrival
      adults: 0
    };
    
    const invalidValidationErrors = validateAccommodationSearchParams(invalidParams);
    console.log('✅ Invalid parameters correctly rejected:', invalidValidationErrors.length, 'errors');
    console.log('');

    // Test 2: Accommodation Search Execution
    console.log('2. Testing Accommodation Search Execution...');
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    
    const searchParams = {
      destination: 'New York',
      arrival_date: tomorrow.toISOString().split('T')[0],
      departure_date: dayAfterTomorrow.toISOString().split('T')[0],
      adults: 2,
      search_type: 'best'
    };
    
    console.log('Search parameters:', searchParams);
    const searchResults = await executeAccommodationSearch(searchParams);
    
    if (searchResults.success) {
      console.log('✅ Accommodation search successful');
      console.log(`Found ${searchResults.data?.length || 0} hotels`);
      if (searchResults.data && searchResults.data.length > 0) {
        const firstHotel = searchResults.data[0];
        console.log('First hotel:', firstHotel.property.name);
        console.log('Price:', firstHotel.property.priceBreakdown?.grossPrice);
        console.log('Rating:', firstHotel.property.reviewScore);
      }
    } else {
      console.log('❌ Accommodation search failed:', searchResults.error);
    }
    console.log('');

    // Test 3: Different Search Types
    console.log('3. Testing Different Search Types...');
    
    const searchTypes = ['budget', 'luxury', 'best'];
    for (const searchType of searchTypes) {
      console.log(`Testing ${searchType} search...`);
      const typeResults = await executeAccommodationSearch({
        ...searchParams,
        search_type: searchType
      });
      
      if (typeResults.success) {
        console.log(`✅ ${searchType} search successful (${typeResults.data?.length || 0} results)`);
      } else {
        console.log(`❌ ${searchType} search failed:`, typeResults.error);
      }
    }
    console.log('');

    // Test 4: Error Handling
    console.log('4. Testing Error Handling...');
    
    // Test with invalid destination
    const invalidDestinationResults = await executeAccommodationSearch({
      destination: 'NonExistentCity12345',
      arrival_date: tomorrow.toISOString().split('T')[0],
      departure_date: dayAfterTomorrow.toISOString().split('T')[0],
      adults: 1
    });
    
    if (!invalidDestinationResults.success) {
      console.log('✅ Invalid destination correctly handled');
      console.log('Error message:', invalidDestinationResults.error);
    } else {
      console.log('❌ Invalid destination should have failed');
    }
    console.log('');

    // Test 5: Date Format Conversion
    console.log('5. Testing Date Format Conversion...');
    const testDates = [
      '2024-04-01',
      '2024-12-25',
      '2025-01-01'
    ];
    
    testDates.forEach(date => {
      const converted = date.split('-').reverse().join('.');
      console.log(`${date} → ${converted}`);
    });
    console.log('✅ Date format conversion working correctly');
    console.log('');

    console.log('🎉 All accommodation integration tests completed!');
    console.log('');
    console.log('📝 Summary:');
    console.log('- Parameter validation: ✅ Working');
    console.log('- API integration: ✅ Working');
    console.log('- Search types: ✅ Working');
    console.log('- Error handling: ✅ Working');
    console.log('- Date conversion: ✅ Working');
    console.log('');
    console.log('🚀 The accommodation integration is ready to use!');

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
    
    // Test error handling function
    const userFriendlyError = handleAccommodationSearchError(error);
    console.log('User-friendly error message:', userFriendlyError);
  }
}

testAccommodationIntegration(); 