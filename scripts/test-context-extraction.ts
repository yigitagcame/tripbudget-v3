// Test the trip context extraction function
function extractTripContextFromText(text: string) {
  const context = {
    from: '',
    to: '',
    departDate: '',
    returnDate: '',
    passengers: 0
  };

  // Extract destination (to) - look for various patterns
  const destinationPatterns = [
    /\b(?:going to|visit|travel to|headed to|planning to go to)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi,
    /\b(?:like to visit|want to visit|would like to visit)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi,
    /\b(?:visit|go to)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi
  ];
  
  for (const pattern of destinationPatterns) {
    const destinationMatches = text.match(pattern);
    if (destinationMatches) {
      // Clean up the destination by removing the trigger words and extra text
      let destination = destinationMatches[0];
      destination = destination.replace(/\b(?:going to|visit|travel to|headed to|planning to go to|like to visit|want to visit|would like to visit|go to)\s+/gi, '');
      destination = destination.replace(/\s+(?:in|for|with|and).*$/i, ''); // Remove extra context
      context.to = destination.trim();
      break;
    }
  }

  // Extract origin (from) - look for "from [city]"
  const originMatches = text.match(/\bfrom\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi);
  if (originMatches) {
    let origin = originMatches[0].replace(/\bfrom\s+/i, '');
    origin = origin.replace(/\s+(?:to|and).*$/i, ''); // Remove extra context
    context.from = origin.trim();
  }

  // Extract passengers
  const passengerMatches = text.match(/\b(\d+)\s+(?:people?|travelers?|passengers?)\b/gi);
  if (passengerMatches) {
    const passengerCount = parseInt(passengerMatches[0].match(/\d+/)?.[0] || '0');
    context.passengers = passengerCount;
  }

  // Extract dates (basic pattern matching)
  const dateMatches = text.match(/\b(?:in|on|during)\s+([A-Z][a-z]+)\b/gi);
  if (dateMatches) {
    const month = dateMatches[0].replace(/\b(?:in|on|during)\s+/i, '').trim();
    // Convert month name to date (simplified)
    const monthMap: { [key: string]: string } = {
      'january': '2024-01-15', 'february': '2024-02-15', 'march': '2024-03-15',
      'april': '2024-04-15', 'may': '2024-05-15', 'june': '2024-06-15',
      'july': '2024-07-15', 'august': '2024-08-15', 'september': '2024-09-15',
      'october': '2024-10-15', 'november': '2024-11-15', 'december': '2024-12-15'
    };
    const monthLower = month.toLowerCase();
    if (monthMap[monthLower]) {
      context.departDate = monthMap[monthLower];
      // Set return date to 7 days later
      const departDate = new Date(monthMap[monthLower]);
      const returnDate = new Date(departDate);
      returnDate.setDate(departDate.getDate() + 7);
      context.returnDate = returnDate.toISOString().split('T')[0];
    }
  }

  return context;
}

function extractFollowUpFromText(text: string): string {
  // Look for questions or follow-up phrases
  const questionMatches = text.match(/(?:Could you|Please|Would you|What about|Tell me about)[^.!?]*[.!?]?/gi);
  if (questionMatches && questionMatches.length > 0) {
    return questionMatches[questionMatches.length - 1].trim();
  }

  // Look for bullet points or lists
  const bulletMatches = text.match(/-[^.!?]*[.!?]?/gi);
  if (bulletMatches && bulletMatches.length > 0) {
    return bulletMatches.join(' ');
  }

  // Default follow-up
  return "What would you like to know about your trip?";
}

// Test cases
const testCases = [
  "I would like to visit Riga.",
  "I want to go to Paris in March for 2 people",
  "Planning a trip from London to Tokyo",
  "That's great! Riga is a beautiful city. To help you plan your trip, could you please provide additional details such as:\n- The city you'll be traveling from\n- The dates of your travel\n- The number of people joining the trip"
];

console.log('Testing trip context extraction...\n');

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 1}: "${testCase}"`);
  
  const context = extractTripContextFromText(testCase);
  const followUp = extractFollowUpFromText(testCase);
  
  console.log('Extracted context:', context);
  console.log('Extracted follow-up:', followUp);
  console.log('---');
});

console.log('✅ Context extraction test completed!'); 