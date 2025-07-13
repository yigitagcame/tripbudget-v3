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
  "follow-up message": "To help you plan better, could you tell me when you're planning to travel and how many people are coming?",
  "trip-context": {
    "from": "",
    "to": "Riga",
    "departDate": "",
    "returnDate": "",
    "passengers": 0
  }
};

console.log('Testing new JSON response format...\n');

// Test parsing
try {
  const parsed = JSON.parse(JSON.stringify(testJsonResponse));
  console.log('✅ JSON parsing successful');
  console.log('Message:', parsed.message);
  console.log('Suggestions count:', parsed.suggestions?.length || 0);
  console.log('Follow-up message:', parsed["follow-up message"]);
  console.log('Trip context:', parsed["trip-context"]);
  
  // Test required fields
  const hasRequiredFields = parsed.message && 
                           parsed["follow-up message"] && 
                           parsed["trip-context"];
  
  if (hasRequiredFields) {
    console.log('✅ All required fields present');
  } else {
    console.log('❌ Missing required fields');
  }
  
} catch (error) {
  console.error('❌ JSON parsing failed:', error);
}

console.log('\n✅ New JSON format test completed!'); 