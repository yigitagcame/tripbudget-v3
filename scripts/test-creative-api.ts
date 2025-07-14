#!/usr/bin/env tsx

import dotenv from 'dotenv';
import { 
  executeCheapestDestinationSearch, 
  executePackageDealSearch, 
  executeSeasonalPriceAnalysis 
} from '../src/lib/openai-functions';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function testCreativeAPI() {
  console.log('Testing Creative API Features...\n');

  try {
    // Test 1: Cheapest Destination Search
    console.log('1. Testing Cheapest Destination Search...');
    const cheapestResults = await executeCheapestDestinationSearch({
      fly_from: 'LON',
      date_from: '01/08/2025',
      date_to: '03/08/2025',
      return_from: '08/08/2025',
      return_to: '10/08/2025',
      adults: 2,
      duration: 7,
      destinations: ['CDG', 'BCN', 'FCO'] // Paris CDG, Barcelona BCN, Rome FCO
    });
    
    console.log('✅ Cheapest destination search:', cheapestResults.success ? 'Success' : 'Failed');
    if (cheapestResults.success && cheapestResults.data) {
      console.log(`Found ${cheapestResults.data.length} destinations`);
      cheapestResults.data.forEach((result, index) => {
        console.log(`${index + 1}. ${result.destination}: $${Math.round(result.totalCost)} total`);
      });
    }
    console.log('');

    // Test 2: Package Deal Search
    console.log('2. Testing Package Deal Search...');
    const packageResults = await executePackageDealSearch({
      fly_from: 'LON',
      destination: 'Paris',
      arrival_date: '2025-08-01',
      departure_date: '2025-08-08',
      adults: 2,
      budget: 1500
    });
    
    console.log('✅ Package deal search:', packageResults.success ? 'Success' : 'Failed');
    if (packageResults.success && packageResults.data) {
      console.log(`Found ${packageResults.data.length} packages`);
      packageResults.data.forEach((result, index) => {
        console.log(`${index + 1}. $${Math.round(result.totalCost)} total`);
      });
    }
    console.log('');

    // Test 3: Seasonal Price Analysis
    console.log('3. Testing Seasonal Price Analysis...');
    const seasonalResults = await executeSeasonalPriceAnalysis({
      fly_from: 'LON',
      fly_to: 'CDG',
      start_month: '2025-06',
      end_month: '2025-12',
      trip_duration: 7,
      adults: 2
    });
    
    console.log('✅ Seasonal price analysis:', seasonalResults.success ? 'Success' : 'Failed');
    if (seasonalResults.success && seasonalResults.data) {
      console.log('Best month:', seasonalResults.data.bestMonth?.month);
      console.log('Worst month:', seasonalResults.data.worstMonth?.month);
    }
    console.log('');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testCreativeAPI(); 