import { POST } from '../chat/route';
import { NextRequest } from 'next/server';

// Mock environment variables for testing
process.env.OPENAI_API_KEY = 'test-openai-key';
process.env.TEQUILA_API_KEY = 'test-tequila-key';
process.env.TEQUILA_BASE_URL = 'https://api.tequila.kiwi.com/v2';

// Simple test function that can be run manually
export async function testChatAPI() {
  console.log('Testing Chat API with Error Handling...');
  
  let allTestsPassed = true;
  
  try {
    // Test 1: Valid flight search request
    console.log('Test 1: Valid flight search request...');
    const validRequest = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'I need flights from London to New York for April 1-3, 2024',
        conversationHistory: []
      })
    });
    
    const validResponse = await POST(validRequest);
    const validData = await validResponse.json();
    
    if (validResponse.status === 200 && validData.content) {
      console.log('✅ Valid flight search request test passed');
    } else {
      console.log('❌ Valid flight search request test failed:', validData);
      allTestsPassed = false;
    }
    
    // Test 2: Invalid message format
    console.log('Test 2: Invalid message format...');
    const invalidMessageRequest = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: '', // Empty message
        conversationHistory: []
      })
    });
    
    const invalidMessageResponse = await POST(invalidMessageRequest);
    const invalidMessageData = await invalidMessageResponse.json();
    
    if (invalidMessageResponse.status === 400 || invalidMessageData.error) {
      console.log('✅ Invalid message format test passed');
    } else {
      console.log('❌ Invalid message format test failed:', invalidMessageData);
      allTestsPassed = false;
    }
    
    // Test 3: Missing required fields
    console.log('Test 3: Missing required fields...');
    const missingFieldsRequest = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        // Missing message field
        conversationHistory: []
      })
    });
    
    const missingFieldsResponse = await POST(missingFieldsRequest);
    const missingFieldsData = await missingFieldsResponse.json();
    
    if (missingFieldsResponse.status === 400 || missingFieldsData.error) {
      console.log('✅ Missing required fields test passed');
    } else {
      console.log('❌ Missing required fields test failed:', missingFieldsData);
      allTestsPassed = false;
    }
    
    // Test 4: Invalid conversation history
    console.log('Test 4: Invalid conversation history...');
    const invalidHistoryRequest = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Test message',
        conversationHistory: [
          { id: 1, type: 'user', content: null, timestamp: new Date() } // Invalid content
        ]
      })
    });
    
    const invalidHistoryResponse = await POST(invalidHistoryRequest);
    const invalidHistoryData = await invalidHistoryResponse.json();
    
    if (invalidHistoryResponse.status === 400 || invalidHistoryData.error) {
      console.log('✅ Invalid conversation history test passed');
    } else {
      console.log('❌ Invalid conversation history test failed:', invalidHistoryData);
      allTestsPassed = false;
    }
    
    // Test 5: Flight search with invalid parameters (should trigger validation)
    console.log('Test 5: Flight search with invalid parameters...');
    const invalidFlightRequest = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'I need flights from London to New York for yesterday', // Invalid date
        conversationHistory: []
      })
    });
    
    const invalidFlightResponse = await POST(invalidFlightRequest);
    const invalidFlightData = await invalidFlightResponse.json();
    
    if (invalidFlightResponse.status === 200) {
      // Should still return a response, but with error handling
      console.log('✅ Invalid flight parameters test passed');
    } else {
      console.log('❌ Invalid flight parameters test failed:', invalidFlightData);
      allTestsPassed = false;
    }
    
    // Test 6: Network error simulation (by using invalid API keys)
    console.log('Test 6: Network error simulation...');
    // Temporarily set invalid API keys
    const originalOpenAIKey = process.env.OPENAI_API_KEY;
    const originalTequilaKey = process.env.TEQUILA_API_KEY;
    
    process.env.OPENAI_API_KEY = 'invalid-key';
    process.env.TEQUILA_API_KEY = 'invalid-key';
    
    const networkErrorRequest = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'I need flights from London to New York',
        conversationHistory: []
      })
    });
    
    const networkErrorResponse = await POST(networkErrorRequest);
    const networkErrorData = await networkErrorResponse.json();
    
    // Restore original API keys
    process.env.OPENAI_API_KEY = originalOpenAIKey;
    process.env.TEQUILA_API_KEY = originalTequilaKey;
    
    if (networkErrorResponse.status === 500 || networkErrorData.error) {
      console.log('✅ Network error simulation test passed');
    } else {
      console.log('❌ Network error simulation test failed:', networkErrorData);
      allTestsPassed = false;
    }
    
    // Test 7: Large conversation history (should trigger summarization)
    console.log('Test 7: Large conversation history...');
    const largeHistory = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      type: 'user' as const,
      content: `Test message ${i + 1}`,
      timestamp: new Date()
    }));
    
    const largeHistoryRequest = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Continue the conversation',
        conversationHistory: largeHistory
      })
    });
    
    const largeHistoryResponse = await POST(largeHistoryRequest);
    const largeHistoryData = await largeHistoryResponse.json();
    
    if (largeHistoryResponse.status === 200 && largeHistoryData.content) {
      console.log('✅ Large conversation history test passed');
    } else {
      console.log('❌ Large conversation history test failed:', largeHistoryData);
      allTestsPassed = false;
    }
    
    if (allTestsPassed) {
      console.log('🎉 All Chat API error handling tests passed!');
    } else {
      console.log('❌ Some Chat API error handling tests failed');
    }
    
    return allTestsPassed;
    
  } catch (error) {
    console.error('❌ Chat API test error:', error);
    return false;
  }
}

// Export for manual testing
export { POST }; 