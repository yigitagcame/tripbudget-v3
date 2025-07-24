#!/usr/bin/env tsx

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { getBrevoUserService } from '../src/lib/brevo-user-service';
import { extractUserDataForBrevo } from '../src/lib/user-utils';

// Load environment variables
config({ path: '.env.local' });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface SyncConfig {
  batchSize: number;
  delayMs: number;
  maxRetries: number;
  resumeFrom?: number;
}

interface SyncResult {
  total: number;
  processed: number;
  successful: number;
  failed: number;
  errors: Array<{ email: string; error: string; userId: string }>;
}

async function syncExistingUsers(config: SyncConfig = {
  batchSize: parseInt(process.env.BREVO_SYNC_BATCH_SIZE || '50'),
  delayMs: parseInt(process.env.BREVO_SYNC_DELAY_MS || '1000'),
  maxRetries: 3
}): Promise<SyncResult> {
  console.log('🔄 Starting user sync to Brevo...\n');
  console.log('Configuration:', config);

  const result: SyncResult = {
    total: 0,
    processed: 0,
    successful: 0,
    failed: 0,
    errors: []
  };

  // Get Brevo service instance
  const brevoUserService = getBrevoUserService();

  try {
    // Get all users from Supabase
    console.log('📊 Fetching users from Supabase...');
    const response = await supabase.auth.admin.listUsers();
    console.log('Supabase response:', {
      hasData: !!response.data,
      dataType: typeof response.data,
      hasUsers: !!response.data?.users,
      usersLength: response.data?.users?.length,
      error: response.error
    });
    
    const { data, error } = response;
    
    if (error) {
      console.error('❌ Error fetching users:', error);
      return result;
    }

    if (!data || !data.users || !Array.isArray(data.users)) {
      console.error('❌ Invalid users data received:', data);
      console.log('Full response data:', JSON.stringify(data, null, 2));
      return result;
    }

    const users = data.users;
    result.total = users.length;
    console.log(`📈 Found ${users.length} users to process`);

    // Process users in batches
    const startIndex = config.resumeFrom || 0;
    const usersToProcess = users.slice(startIndex);
    
    console.log(`🚀 Processing ${usersToProcess.length} users starting from index ${startIndex}`);

    for (let i = 0; i < usersToProcess.length; i += config.batchSize) {
      const batch = usersToProcess.slice(i, i + config.batchSize);
      const batchIndex = startIndex + i;
      
      console.log(`\n📦 Processing batch ${Math.floor(i / config.batchSize) + 1} (users ${batchIndex + 1}-${batchIndex + batch.length})`);
      
      // Process batch
      for (const user of batch) {
        try {
          // Skip users without email
          if (!user.email) {
            console.log(`⚠️  Skipping user ${user.id} - no email`);
            result.processed++;
            continue;
          }

          // Check if user already exists in Brevo
          const exists = await brevoUserService.isUserInList(user.email);
          if (exists) {
            console.log(`✅ User ${user.email} already exists in Brevo list`);
            result.processed++;
            result.successful++;
            continue;
          }

          // Prepare user data for Brevo
          const userData = extractUserDataForBrevo(user);
          
          // Add user to Brevo
          const success = await brevoUserService.addUserToMainList(userData);
          
          if (success) {
            console.log(`✅ Added user ${user.email} to Brevo list`);
            result.successful++;
          } else {
            console.log(`❌ Failed to add user ${user.email} to Brevo list`);
            result.failed++;
            result.errors.push({
              email: user.email,
              error: 'Failed to add to Brevo list',
              userId: user.id
            });
          }
          
          result.processed++;
          
        } catch (error: any) {
          console.error(`❌ Error processing user ${user.email}:`, error.message);
          result.failed++;
          result.errors.push({
            email: user.email || 'unknown',
            error: error.message,
            userId: user.id
          });
          result.processed++;
        }
      }

      // Progress update
      const progress = ((result.processed / result.total) * 100).toFixed(1);
      console.log(`📊 Progress: ${result.processed}/${result.total} (${progress}%) - Success: ${result.successful}, Failed: ${result.failed}`);

      // Delay between batches (except for the last batch)
      if (i + config.batchSize < usersToProcess.length) {
        console.log(`⏳ Waiting ${config.delayMs}ms before next batch...`);
        await new Promise(resolve => setTimeout(resolve, config.delayMs));
      }
    }

    // Final summary
    console.log('\n🎉 Sync completed!');
    console.log('📊 Final Results:');
    console.log(`   Total users: ${result.total}`);
    console.log(`   Processed: ${result.processed}`);
    console.log(`   Successful: ${result.successful}`);
    console.log(`   Failed: ${result.failed}`);
    
    if (result.errors.length > 0) {
      console.log('\n❌ Errors:');
      result.errors.slice(0, 10).forEach(error => {
        console.log(`   ${error.email}: ${error.error}`);
      });
      if (result.errors.length > 10) {
        console.log(`   ... and ${result.errors.length - 10} more errors`);
      }
    }

  } catch (error) {
    console.error('❌ Fatal error during sync:', error);
  }

  return result;
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  
  // Parse command line arguments
  const config: SyncConfig = {
    batchSize: parseInt(process.env.BREVO_SYNC_BATCH_SIZE || '50'),
    delayMs: parseInt(process.env.BREVO_SYNC_DELAY_MS || '1000'),
    maxRetries: 3
  };

  // Parse resume-from argument
  const resumeIndex = args.findIndex(arg => arg.startsWith('--resume-from='));
  if (resumeIndex !== -1) {
    const resumeValue = args[resumeIndex].split('=')[1];
    config.resumeFrom = parseInt(resumeValue);
    console.log(`🔄 Resuming sync from index ${config.resumeFrom}`);
  }

  // Parse batch-size argument
  const batchSizeIndex = args.findIndex(arg => arg.startsWith('--batch-size='));
  if (batchSizeIndex !== -1) {
    const batchSizeValue = args[batchSizeIndex].split('=')[1];
    config.batchSize = parseInt(batchSizeValue);
  }

  // Parse delay argument
  const delayIndex = args.findIndex(arg => arg.startsWith('--delay='));
  if (delayIndex !== -1) {
    const delayValue = args[delayIndex].split('=')[1];
    config.delayMs = parseInt(delayValue);
  }

  // Validate environment
  if (!process.env.BREVO_API_KEY || !process.env.BREVO_USER_LIST_ID) {
    console.error('❌ Missing required environment variables');
    console.error('Required: BREVO_API_KEY, BREVO_USER_LIST_ID');
    process.exit(1);
  }

  // Run sync
  await syncExistingUsers(config);
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
} 