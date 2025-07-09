import { 
  validateFlightSearchParams, 
  handleFlightSearchError, 
  validateLocationCode,
  formatDateForAPI,
  parseDate 
} from '../validation';

// Simple test function that can be run manually
export async function testValidation() {
  console.log('Testing Validation Functions...');
  
  let allTestsPassed = true;
  
  try {
    // Test 1: validateFlightSearchParams - valid parameters
    console.log('Test 1: Valid flight search parameters...');
    const validParams = {
      fly_from: 'LON',
      date_from: '01/08/2025',
      date_to: '03/08/2025',
      adults: 2
    };
    
    const validErrors = validateFlightSearchParams(validParams);
    if (validErrors.length === 0) {
      console.log('✅ Valid parameters test passed');
    } else {
      console.log('❌ Valid parameters test failed:', validErrors);
      allTestsPassed = false;
    }
    
    // Test 2: validateFlightSearchParams - missing required parameters
    console.log('Test 2: Missing required parameters...');
    const invalidParams = {
      fly_from: 'LON'
      // Missing date_from and date_to
    };
    
    const invalidErrors = validateFlightSearchParams(invalidParams);
    if (invalidErrors.includes('Departure date from is required') && 
        invalidErrors.includes('Departure date to is required')) {
      console.log('✅ Missing parameters validation test passed');
    } else {
      console.log('❌ Missing parameters validation test failed:', invalidErrors);
      allTestsPassed = false;
    }
    
    // Test 3: validateFlightSearchParams - invalid date format
    console.log('Test 3: Invalid date format...');
    const invalidDateParams = {
      fly_from: 'LON',
      date_from: '2025-08-01', // Wrong format
      date_to: '03/08/2025',
      adults: 2
    };
    
    const dateErrors = validateFlightSearchParams(invalidDateParams);
    if (dateErrors.includes('Date format must be dd/mm/yyyy')) {
      console.log('✅ Date format validation test passed');
    } else {
      console.log('❌ Date format validation test failed:', dateErrors);
      allTestsPassed = false;
    }
    
    // Test 3.1: validateFlightSearchParams - past dates
    console.log('Test 3.1: Past dates validation...');
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    const pastDateStr = formatDateForAPI(pastDate);
    
    const pastDateParams = {
      fly_from: 'LON',
      date_from: pastDateStr,
      date_to: '03/08/2025',
      adults: 2
    };
    
    const pastDateErrors = validateFlightSearchParams(pastDateParams);
    if (pastDateErrors.includes('Departure date cannot be in the past')) {
      console.log('✅ Past dates validation test passed');
    } else {
      console.log('❌ Past dates validation test failed:', pastDateErrors);
      allTestsPassed = false;
    }
    
    // Test 3.2: validateFlightSearchParams - invalid date logic
    console.log('Test 3.2: Invalid date logic...');
    const invalidDateLogicParams = {
      fly_from: 'LON',
      date_from: '03/08/2025',
      date_to: '01/08/2025', // date_to before date_from
      adults: 2
    };
    
    const dateLogicErrors = validateFlightSearchParams(invalidDateLogicParams);
    if (dateLogicErrors.includes('Departure date from must be before or equal to departure date to')) {
      console.log('✅ Invalid date logic test passed');
    } else {
      console.log('❌ Invalid date logic test failed:', dateLogicErrors);
      allTestsPassed = false;
    }
    
    // Test 3.3: validateFlightSearchParams - return date validation
    console.log('Test 3.3: Return date validation...');
    const returnDateParams = {
      fly_from: 'LON',
      date_from: '01/08/2025',
      date_to: '03/08/2025',
      return_from: '08/08/2025',
      return_to: '06/08/2025', // return_to before return_from
      adults: 2
    };
    
    const returnDateErrors = validateFlightSearchParams(returnDateParams);
    if (returnDateErrors.includes('Return date from must be before or equal to return date to')) {
      console.log('✅ Return date validation test passed');
    } else {
      console.log('❌ Return date validation test failed:', returnDateErrors);
      allTestsPassed = false;
    }
    
    // Test 3.4: validateFlightSearchParams - total passengers validation
    console.log('Test 3.4: Total passengers validation...');
    const totalPassengersParams = {
      fly_from: 'LON',
      date_from: '01/08/2025',
      date_to: '03/08/2025',
      adults: 5,
      children: 3,
      infants: 2 // Total: 10, exceeds limit of 9
    };
    
    const totalPassengersErrors = validateFlightSearchParams(totalPassengersParams);
    if (totalPassengersErrors.includes('Total number of passengers cannot exceed 9')) {
      console.log('✅ Total passengers validation test passed');
    } else {
      console.log('❌ Total passengers validation test failed:', totalPassengersErrors);
      allTestsPassed = false;
    }
    
    // Test 4: handleFlightSearchError
    console.log('Test 4: Error handling...');
    const locationError = new Error('Not recognized location');
    const locationMessage = handleFlightSearchError(locationError);
    if (locationMessage.includes("I couldn't find that location")) {
      console.log('✅ Location error handling test passed');
    } else {
      console.log('❌ Location error handling test failed:', locationMessage);
      allTestsPassed = false;
    }
    
    // Test 4.1: handleFlightSearchError - network errors
    console.log('Test 4.1: Network error handling...');
    const networkError = new Error('NetworkError: fetch failed');
    const networkMessage = handleFlightSearchError(networkError);
    if (networkMessage.includes('Network connection error')) {
      console.log('✅ Network error handling test passed');
    } else {
      console.log('❌ Network error handling test failed:', networkMessage);
      allTestsPassed = false;
    }
    
    // Test 4.2: handleFlightSearchError - timeout errors
    console.log('Test 4.2: Timeout error handling...');
    const timeoutError = new Error('timeout after 30 seconds');
    const timeoutMessage = handleFlightSearchError(timeoutError);
    if (timeoutMessage.includes('The request timed out')) {
      console.log('✅ Timeout error handling test passed');
    } else {
      console.log('❌ Timeout error handling test failed:', timeoutMessage);
      allTestsPassed = false;
    }
    
    // Test 4.3: handleFlightSearchError - rate limit errors
    console.log('Test 4.3: Rate limit error handling...');
    const rateLimitError = new Error('429 Too Many Requests');
    const rateLimitMessage = handleFlightSearchError(rateLimitError);
    if (rateLimitMessage.includes('currently busy')) {
      console.log('✅ Rate limit error handling test passed');
    } else {
      console.log('❌ Rate limit error handling test failed:', rateLimitMessage);
      allTestsPassed = false;
    }
    
    // Test 5: validateLocationCode
    console.log('Test 5: Location code validation...');
    const validLocations = ['LON', 'JFK', 'US', 'city:LON', 'airport:LHR', 'London'];
    const invalidLocations = ['', 'A', 'ABCD', '123'];
    
    let locationTestPassed = true;
    
    for (const location of validLocations) {
      if (!validateLocationCode(location)) {
        console.log(`❌ Valid location rejected: ${location}`);
        locationTestPassed = false;
      }
    }
    
    for (const location of invalidLocations) {
      if (validateLocationCode(location)) {
        console.log(`❌ Invalid location accepted: ${location}`);
        locationTestPassed = false;
      }
    }
    
    if (locationTestPassed) {
      console.log('✅ Location code validation test passed');
    } else {
      allTestsPassed = false;
    }
    
    // Test 6: formatDateForAPI
    console.log('Test 6: Date formatting...');
    const testDate = new Date('2025-08-01');
    const formatted = formatDateForAPI(testDate);
    if (formatted === '01/08/2025') {
      console.log('✅ Date formatting test passed');
    } else {
      console.log('❌ Date formatting test failed:', formatted);
      allTestsPassed = false;
    }
    
    // Test 7: parseDate
    console.log('Test 7: Date parsing...');
    const parsedDate1 = parseDate('01/08/2025');
    const parsedDate2 = parseDate('2025-08-01');
    const parsedDate3 = parseDate('invalid');
    
    if (parsedDate1 && parsedDate1.getFullYear() === 2025 && 
        parsedDate2 && parsedDate2.getFullYear() === 2025 && 
        parsedDate3 === null) {
      console.log('✅ Date parsing test passed');
    } else {
      console.log('❌ Date parsing test failed');
      allTestsPassed = false;
    }
    
    if (allTestsPassed) {
      console.log('🎉 All validation tests passed!');
    } else {
      console.log('❌ Some validation tests failed');
    }
    
    return allTestsPassed;
    
  } catch (error) {
    console.error('❌ Validation test error:', error);
    return false;
  }
}

// Export for manual testing
export { 
  validateFlightSearchParams, 
  handleFlightSearchError, 
  validateLocationCode,
  formatDateForAPI,
  parseDate 
}; 