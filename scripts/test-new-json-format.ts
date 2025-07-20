// Test the new JSON response format
const testJsonResponse = {
  "message": "That sounds wonderful! Riga is a beautiful city with rich history and culture.",
  "suggestions": [
    {
      "type": "place",
      "title": "Old Town Riga",
      "description": "UNESCO World Heritage site with medieval architecture",
      "price": "Free to explore",
      "location": "Riga Old Town"
    }
  ],
  "followUpMessage": "To help you plan better, could you tell me when you're planning to travel and how many people are coming?",
  "tripContext": {
    "from": "",
    "to": "Riga",
    "departDate": "",
    "returnDate": "",
    "passengers": 0
  },
  "intent": "destination_inquiry",
  "functionToCall": undefined
};

console.log('Testing new JSON response format...\n');

// Test parsing
try {
  const parsed = JSON.parse(JSON.stringify(testJsonResponse));
  
  console.log('✅ JSON parsing successful');
  console.log('Message:', parsed.message);
  console.log('Suggestions count:', parsed.suggestions?.length || 0);
  console.log('Follow-up message:', parsed.followUpMessage);
  console.log('Trip context:', parsed.tripContext);
  console.log('Intent:', parsed.intent);
  console.log('Function to call:', parsed.functionToCall);
  
  // Validate required fields
  const isValid = 
    parsed.message &&
    Array.isArray(parsed.suggestions) &&
    parsed.followUpMessage &&
    parsed.tripContext;
  
  console.log('\n✅ Validation result:', isValid ? 'PASSED' : 'FAILED');
  
} catch (error) {
  console.error('❌ JSON parsing failed:', error);
} 