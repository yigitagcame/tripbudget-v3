import { tripService } from '../src/lib/trip-service';

async function testTripContext() {
  console.log('Testing trip context loading...');
  
  try {
    // Test with a sample trip ID (you'll need to replace this with a real one)
    const testTripId = 'test123';
    
    console.log('Loading trip data for ID:', testTripId);
    const tripData = await tripService.getTrip(testTripId);
    
    if (tripData) {
      console.log('Trip data loaded successfully:');
      console.log('- Origin:', tripData.origin);
      console.log('- Destination:', tripData.destination);
      console.log('- Departure Date:', tripData.departure_date);
      console.log('- Return Date:', tripData.return_date);
      console.log('- Passengers:', tripData.passenger_count);
      
      const hasExistingContext = tripData.origin || tripData.destination || tripData.departure_date || tripData.return_date || tripData.passenger_count;
      console.log('Has existing context:', hasExistingContext);
      
      if (hasExistingContext) {
        const contextString = `\n\nCURRENT TRIP CONTEXT FROM DATABASE:
From: ${tripData.origin || 'Not specified'}
To: ${tripData.destination || 'Not specified'}
Departure Date: ${tripData.departure_date || 'Not specified'}
Return Date: ${tripData.return_date || 'Not specified'}
Passengers: ${tripData.passenger_count || 0}

IMPORTANT: You MUST preserve and build upon these existing trip details. Only update fields when the user provides new information. Always consider these details when making recommendations.`;
        
        console.log('\nGenerated context string:');
        console.log(contextString);
      }
    } else {
      console.log('No trip data found for ID:', testTripId);
    }
  } catch (error) {
    console.error('Error testing trip context:', error);
  }
}

testTripContext(); 