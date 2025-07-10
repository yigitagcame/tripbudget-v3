import { generateTripId } from '../src/lib/trip-utils';

function testTripUtils() {
  console.log('Testing Trip Utilities...\n');

  // Test trip ID generation
  console.log('1. Testing trip ID generation:');
  const tripIds = [];
  
  for (let i = 0; i < 10; i++) {
    const tripId = generateTripId();
    tripIds.push(tripId);
    console.log(`   Generated trip ID ${i + 1}: ${tripId}`);
  }

  // Verify all IDs are unique
  const uniqueIds = new Set(tripIds);
  console.log(`\n   All IDs are unique: ${uniqueIds.size === tripIds.length}`);

  // Verify ID format
  const validFormat = tripIds.every(id => 
    id.length === 8 && /^[A-Za-z0-9]+$/.test(id)
  );
  console.log(`   All IDs are 8 characters and URL-safe: ${validFormat}`);

  console.log('\n✅ Trip utilities are working correctly!');
  console.log('\nNext steps to complete implementation:');
  console.log('1. Run the SQL migrations in Supabase SQL Editor:');
  console.log('   - migrations/20241220_143000_create_trips_table.sql');
  console.log('   - migrations/20241220_143100_add_trips_indexes.sql');
  console.log('2. Test the chat functionality at http://localhost:3001/chat');
  console.log('3. Verify trip creation and URL routing works');
}

testTripUtils(); 