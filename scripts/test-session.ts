import { createBrowserClient } from '@supabase/ssr';
import 'dotenv/config';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

console.log('Environment variables:');
console.log('SUPABASE_URL:', supabaseUrl ? 'Set' : 'Not set');
console.log('SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Not set');

const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

async function testSession() {
  console.log('🔐 Testing Session Status...\n');
  
  try {
    // Check current session
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.log('❌ Error getting session:', error.message);
      return;
    }
    
    if (session) {
      console.log('✅ Session found:');
      console.log('   User ID:', session.user.id);
      console.log('   Email:', session.user.email);
      console.log('   Created at:', session.user.created_at);
      console.log('   Last sign in:', session.user.last_sign_in_at);
      console.log('   Session expires:', new Date(session.expires_at! * 1000).toISOString());
    } else {
      console.log('ℹ️  No active session found');
    }
    
    // Check current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.log('❌ Error getting user:', userError.message);
      return;
    }
    
    if (user) {
      console.log('\n✅ User found:', user.email);
    } else {
      console.log('\nℹ️  No user found');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testSession(); 