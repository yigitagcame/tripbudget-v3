import { supabase } from '../src/lib/supabase';

// Test authentication functionality
async function testAuth() {
  console.log('🔐 Testing Authentication System...\n');
  
  // Check environment variables
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ];
  
  const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingEnvVars.length > 0) {
    console.log('❌ Missing required environment variables:');
    missingEnvVars.forEach(varName => console.log(`   - ${varName}`));
    console.log('\nPlease set these environment variables to test authentication.');
    return false;
  }
  
  try {
    // Test 1: Check if Supabase client can be created
    console.log('1. Testing Supabase client creation...');
    if (!supabase) {
      console.log('❌ Failed to create Supabase client');
      return false;
    }
    console.log('✅ Supabase client created successfully');
    
    // Test 2: Check current session
    console.log('\n2. Testing session retrieval...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.log('❌ Error retrieving session:', sessionError.message);
      return false;
    }
    
    if (session) {
      console.log('✅ User is authenticated:', session.user.email);
    } else {
      console.log('ℹ️  No active session (user not logged in)');
    }
    
    // Test 3: Test sign out (if user is logged in)
    if (session) {
      console.log('\n3. Testing sign out...');
      const { error: signOutError } = await supabase.auth.signOut();
      
      if (signOutError) {
        console.log('❌ Error signing out:', signOutError.message);
        return false;
      }
      
      console.log('✅ Sign out successful');
    }
    
    console.log('\n✅ All authentication tests passed!');
    return true;
    
  } catch (error) {
    console.error('\n💥 Authentication tests crashed:', error);
    return false;
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testAuth().then((success) => {
    process.exit(success ? 0 : 1);
  });
}

export { testAuth }; 