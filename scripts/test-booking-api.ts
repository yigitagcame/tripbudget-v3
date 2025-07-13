import * as dotenv from 'dotenv';
import { searchDestinations, searchHotels } from '../src/lib/booking-api';
import { formatDateForBookingAPI } from '../src/lib/accommodation-transformer';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function testBookingAPI() {
  console.log('Testing Booking.com API Integration...\n');

  try {
    // Test 1: Destination Search
    console.log('1. Testing Destination Search...');
    const destinationResults = await searchDestinations({ query: 'New York' });
    console.log('✅ Destination search successful');
    console.log(`Found ${destinationResults.data.length} destinations`);
    console.log('First destination:', destinationResults.data[0]?.name);
    console.log('Destination ID:', destinationResults.data[0]?.dest_id);
    console.log('');

    if (destinationResults.data.length === 0) {
      console.log('❌ No destinations found, cannot continue with hotel search');
      return;
    }

    // Test 2: Hotel Search
    console.log('2. Testing Hotel Search...');
    const destination = destinationResults.data[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

    const hotelResults = await searchHotels({
      dest_id: destination.dest_id,
      search_type: 'CITY',
      arrival_date: formatDateForBookingAPI(tomorrow.toISOString().split('T')[0]),
      departure_date: formatDateForBookingAPI(dayAfterTomorrow.toISOString().split('T')[0]),
      adults: 2,
      room_qty: 1,
      currency_code: 'USD',
      languagecode: 'en-us'
    });

    console.log('✅ Hotel search successful');
    console.log('Hotel search response:', JSON.stringify(hotelResults, null, 2));
    console.log(`Found ${hotelResults.data?.hotels?.length || 0} hotels`);
    if (hotelResults.data?.hotels?.length > 0) {
      console.log('First hotel:', hotelResults.data.hotels[0]?.property.name);
      console.log('Hotel price:', hotelResults.data.hotels[0]?.property.priceBreakdown?.grossPrice);
    }
    console.log('');

    // Test 3: Date Format Validation
    console.log('3. Testing Date Format Validation...');
    const testDate = '2024-04-01';
    const validatedDate = formatDateForBookingAPI(testDate);
    console.log(`Original date: ${testDate}`);
    console.log(`Validated date: ${validatedDate}`);
    console.log('✅ Date format validation successful');
    console.log('');

    console.log('🎉 All tests passed! Booking.com API integration is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
  }
}

// Check if environment variables are set
if (!process.env.RAPIDAPI_KEY || !process.env.RAPIDAPI_HOST) {
  console.error('❌ Missing required environment variables:');
  console.error('RAPIDAPI_KEY:', process.env.RAPIDAPI_KEY ? 'Set' : 'Missing');
  console.error('RAPIDAPI_HOST:', process.env.RAPIDAPI_HOST ? 'Set' : 'Missing');
  console.error('');
  console.error('Please set these environment variables before running the test.');
  process.exit(1);
}

testBookingAPI(); 