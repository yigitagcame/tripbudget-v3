#!/usr/bin/env tsx

import dotenv from 'dotenv';
import { testTequilaAPI } from '../src/lib/__tests__/tequila-api.test';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function main() {
  console.log('🚀 Starting Tequila API Integration Test...\n');
  
  // Check if environment variables are set
  if (!process.env.TEQUILA_API_KEY) {
    console.error('❌ TEQUILA_API_KEY environment variable is not set');
    console.log('Please add TEQUILA_API_KEY=your_api_key to your .env.local file');
    process.exit(1);
  }
  
  if (!process.env.TEQUILA_BASE_URL) {
    console.error('❌ TEQUILA_BASE_URL environment variable is not set');
    console.log('Please add TEQUILA_BASE_URL=https://api.tequila.kiwi.com/v2 to your .env.local file');
    process.exit(1);
  }
  
  console.log('✅ Environment variables are configured');
  console.log(`📡 API Base URL: ${process.env.TEQUILA_BASE_URL}\n`);
  
  const success = await testTequilaAPI();
  
  if (success) {
    console.log('\n🎉 Phase 2: Core API Integration is working correctly!');
    console.log('✅ Tequila API service is ready for use');
    console.log('✅ All required parameters are handled');
    console.log('✅ Optional parameters are supported');
    console.log('✅ Error handling is in place');
    console.log('✅ Response data structure is correct');
  } else {
    console.log('\n❌ Phase 2: Core API Integration has issues');
    console.log('Please check the error messages above and fix any issues');
    process.exit(1);
  }
}

main().catch(console.error); 