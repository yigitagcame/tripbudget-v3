# Brevo User Integration Plan - Adding New Users to List

## Overview

This document outlines the implementation plan for automatically adding new users to a Brevo (formerly Sendinblue) list when they sign up for the trip budget application. The integration will capture new user registrations and add them to a designated Brevo list for email marketing and user engagement.

## Current System Analysis

### Existing Architecture
- **Authentication**: Supabase Auth with OAuth (Google, Twitter) and email/password
- **User Registration**: Users sign up via `/login` page and complete OAuth flow
- **Auth Callback**: `/auth/callback` handles post-authentication processing
- **Brevo Integration**: Already exists for newsletter signup (`/api/newsletter`) and contact form (`/api/contact`)
- **Dependencies**: `@getbrevo/brevo` SDK already installed

### Current User Flow
1. User visits `/login` page
2. User clicks OAuth provider (Google/Twitter) or enters email/password
3. OAuth redirects to `/auth/callback`
4. Auth callback processes referral codes and redirects to `/chat`
5. User starts using the application

## Integration Strategy

### 1. Backend Service Implementation

#### 1.1 Create Brevo User Service
**File:** `src/lib/brevo-user-service.ts`

**Purpose**: Centralized service for managing user contacts in Brevo

**Features**:
- Add new users to designated list
- Update existing user information
- Handle duplicate contacts gracefully
- Error handling and logging
- TypeScript interfaces for type safety

#### 1.2 API Endpoint for User Addition
**File:** `src/app/api/brevo/add-user/route.ts`

**Purpose**: Server-side endpoint to add users to Brevo list

**Features**:
- Authentication required
- User data validation
- Brevo API integration
- Error handling and response formatting

### 2. Integration Points

#### 2.1 Auth Callback Integration
**File:** `src/app/auth/callback/page.tsx`

**Purpose**: Add new users to Brevo list after successful authentication

**Implementation**:
- Detect new user registration (first-time signup)
- Call Brevo API to add user to list
- Handle errors gracefully (don't block auth flow)
- Log success/failure for monitoring

#### 2.2 User Detection Logic
**Strategy**: Use Supabase user metadata or database check to identify new users

**Options**:
1. **User Metadata**: Check `user.user_metadata.created_at` vs current session
2. **Database Check**: Query user_message_counters table for existing records
3. **Session Comparison**: Compare user creation date with current time

### 3. Data Collection Strategy

#### 3.1 Required User Data
- **Email**: Primary identifier (required)
- **Name**: Full name from OAuth providers or user input
- **Signup Date**: When user registered
- **Provider**: OAuth provider (Google, Twitter) or email
- **User ID**: Supabase user ID for reference

#### 3.2 Optional User Data
- **Avatar**: Profile picture from OAuth providers
- **Location**: Geographic data if available
- **Referral Source**: How user found the application
- **Initial Trip Context**: First trip details if available

### 4. Brevo Configuration

#### 4.1 List Management
- **Primary List**: Main user list for all registered users
- **List ID**: Configurable via environment variable
- **Update Settings**: Allow updating existing contacts
- **Double Opt-in**: Optional (not required for existing users)

#### 4.2 Contact Attributes
- **Standard Fields**: Email, First Name, Last Name
- **Custom Attributes**: 
  - `user_id`: Supabase user ID
  - `signup_date`: Registration date
  - `provider`: OAuth provider
  - `referral_source`: How user found the app
  - `initial_trip_context`: First trip details

## Implementation Plan

### Phase 0: User Sync Strategy (Pre-Implementation)

#### 0.1 Backfill Existing Users
**Purpose**: Sync all existing users who registered before Brevo integration

**Strategy**:
1. **Database Query**: Get all users from Supabase auth.users table
2. **Batch Processing**: Process users in batches to avoid API rate limits
3. **Duplicate Prevention**: Check if user already exists in Brevo before adding
4. **Progress Tracking**: Track sync progress and handle failures gracefully

#### 0.2 Sync Service Implementation
**File:** `src/lib/brevo-sync-service.ts`

**Features**:
- Batch processing of existing users
- Progress tracking and resumability
- Error handling and retry logic
- Duplicate detection and handling
- Logging and monitoring

#### 0.3 Sync API Endpoint
**File:** `src/app/api/brevo/sync-users/route.ts`

**Purpose**: Admin endpoint to trigger user sync process

**Features**:
- Admin authentication required
- Batch size configuration
- Progress reporting
- Error handling and recovery

#### 0.4 Sync Script
**File:** `scripts/sync-existing-users.ts`

**Purpose**: Command-line tool for syncing existing users

**Features**:
- Environment validation
- Batch processing with progress bars
- Error reporting and logging
- Resume capability for interrupted syncs

### Phase 1: Core Service Development

#### 1.1 Create Brevo User Service
```typescript
// src/lib/brevo-user-service.ts
interface BrevoUserData {
  email: string;
  firstName?: string;
  lastName?: string;
  userId: string;
  signupDate: string;
  provider: string;
  referralSource?: string;
  initialTripContext?: string;
}

interface SyncProgress {
  total: number;
  processed: number;
  successful: number;
  failed: number;
  errors: Array<{ email: string; error: string }>;
}

class BrevoUserService {
  async addUserToMainList(userData: BrevoUserData): Promise<boolean>
  async updateUserData(email: string, updates: Partial<BrevoUserData>): Promise<boolean>
  async isUserInList(email: string): Promise<boolean>
  async syncExistingUsers(batchSize?: number): Promise<SyncProgress>
  async getSyncProgress(): Promise<SyncProgress>
}
```

#### 1.2 Create API Endpoints
```typescript
// src/app/api/brevo/add-user/route.ts
export async function POST(request: NextRequest) {
  // Authentication check
  // User data validation
  // Brevo API call
  // Response handling
}

// src/app/api/brevo/sync-users/route.ts
export async function POST(request: NextRequest) {
  // Admin authentication check
  // Batch size validation
  // Start sync process
  // Return progress tracking
}

export async function GET(request: NextRequest) {
  // Admin authentication check
  // Return current sync progress
}
```

### Phase 2: Auth Integration

#### 2.1 Update Auth Callback
```typescript
// src/app/auth/callback/page.tsx
// Add after successful authentication:
if (session && isNewUser) {
  await addUserToBrevoList(session.user);
}
```

#### 2.2 New User Detection
```typescript
// Helper function to detect new users
function isNewUser(user: User): boolean {
  // Implementation based on chosen strategy
}
```

### Phase 3: Testing & Validation

#### 3.1 Unit Tests
- Brevo service functions
- API endpoint validation
- Error handling scenarios
- Sync service functions
- Progress tracking logic

#### 3.2 Integration Tests
- End-to-end user registration flow
- Brevo API integration
- Error recovery
- User sync process
- Batch processing validation

#### 3.3 Test Scripts
```bash
npm run test:brevo-user-integration
npm run test:brevo-sync
npm run sync:users  # Sync existing users
```

## Environment Variables

### Required Variables
```env
# Existing
BREVO_API_KEY=your_brevo_api_key_here

# New
BREVO_USER_LIST_ID=16  # List ID for registered users
BREVO_UPDATE_EXISTING_CONTACTS=true
BREVO_SYNC_BATCH_SIZE=50  # Number of users to process per batch
BREVO_SYNC_DELAY_MS=1000  # Delay between batches (ms)
```

### Optional Variables
```env
BREVO_DOUBLE_OPTIN=false
BREVO_SEND_WELCOME_EMAIL=true
BREVO_WELCOME_EMAIL_TEMPLATE_ID=1
```

## Database Considerations

### User Tracking
- **No new tables required**: Use existing Supabase auth.users table
- **Metadata storage**: Store Brevo contact ID in user metadata if needed
- **Audit trail**: Log Brevo operations for debugging

### Sync Tracking (Optional)
- **Sync progress table**: Track sync progress and resume capability
- **User sync status**: Mark users as synced to avoid reprocessing
- **Error logging**: Store sync errors for debugging and retry

### Existing User Detection
- **Creation date filtering**: Only sync users created before integration date
- **Metadata flag**: Use user metadata to mark synced users
- **Brevo contact check**: Verify if user already exists in Brevo list

### Performance
- **Async operations**: Don't block auth flow for Brevo calls
- **Error handling**: Graceful degradation if Brevo is unavailable
- **Rate limiting**: Respect Brevo API limits
- **Batch processing**: Process users in configurable batches
- **Progress tracking**: Real-time sync progress monitoring
- **Resume capability**: Continue sync from last successful point

## Security & Privacy

### Data Protection
- **GDPR Compliance**: Only collect necessary data
- **Consent Management**: Clear privacy policy and consent
- **Data Retention**: Follow data retention policies
- **API Security**: Secure API key storage and usage

### Error Handling
- **No sensitive data in logs**: Avoid logging email addresses
- **Graceful failures**: Don't expose internal errors to users
- **Monitoring**: Track success/failure rates

## Monitoring & Analytics

### Success Metrics
- **Registration rate**: Users successfully added to Brevo
- **Error rate**: Failed Brevo operations
- **Response time**: Brevo API performance
- **User engagement**: Email open rates and click-through rates

### Logging
- **Structured logging**: JSON format for easy parsing
- **Error tracking**: Detailed error information for debugging
- **Performance monitoring**: API response times

## Future Enhancements

### Phase 4: Advanced Features
1. **Segmentation**: Different lists for different user types
2. **Automated Campaigns**: Welcome series and onboarding emails
3. **User Behavior Tracking**: Trip creation, message usage, etc.
4. **A/B Testing**: Different onboarding flows
5. **Re-engagement**: Win-back campaigns for inactive users

### Phase 5: Analytics Integration
1. **User Journey Tracking**: Complete user lifecycle
2. **Conversion Funnel**: Signup to active user conversion
3. **Churn Prediction**: Identify at-risk users
4. **ROI Tracking**: User lifetime value analysis

## Testing Strategy

### Manual Testing
1. **New User Registration**: Complete OAuth flow and verify Brevo addition
2. **Existing User Login**: Ensure no duplicate entries
3. **Error Scenarios**: Test with invalid API keys, network issues
4. **Data Validation**: Verify all user data is correctly captured
5. **User Sync Process**: Test sync of existing users
6. **Batch Processing**: Verify batch size and rate limiting
7. **Progress Tracking**: Check sync progress reporting
8. **Resume Capability**: Test sync interruption and resumption

### Automated Testing
1. **Unit Tests**: Service functions and API endpoints
2. **Integration Tests**: End-to-end user registration flow
3. **Error Handling Tests**: Various failure scenarios
4. **Performance Tests**: API response times and reliability
5. **Sync Tests**: Batch processing and progress tracking
6. **Duplicate Prevention Tests**: Ensure no duplicate contacts
7. **Resume Tests**: Sync interruption and recovery

## Deployment Checklist

### Pre-deployment
- [ ] Brevo API key configured
- [ ] List ID configured and verified
- [ ] Environment variables set
- [ ] Error monitoring configured
- [ ] Privacy policy updated
- [ ] Sync batch size configured
- [ ] Rate limiting settings verified

### Post-deployment
- [ ] Test user registration flow
- [ ] Verify Brevo list population
- [ ] Monitor error rates
- [ ] Check API performance
- [ ] Validate data accuracy
- [ ] Run initial user sync
- [ ] Verify sync completion
- [ ] Monitor sync performance
- [ ] Check for duplicate contacts

## Troubleshooting

### Common Issues
1. **API Key Issues**: Invalid or expired Brevo API key
2. **List ID Problems**: Incorrect list ID or permissions
3. **Duplicate Contacts**: Existing email addresses causing conflicts
4. **Network Issues**: Timeout or connection problems
5. **Rate Limiting**: Too many API calls
6. **Sync Failures**: Batch processing errors or interruptions
7. **Progress Tracking**: Sync progress not updating correctly
8. **Resume Issues**: Sync not resuming from correct point

### Debug Steps
1. Check environment variables
2. Verify Brevo API key permissions
3. Test API endpoint directly
4. Review server logs for errors
5. Check Brevo dashboard for contact status
6. Check sync progress and error logs
7. Verify batch size and rate limiting settings
8. Test sync resume functionality

## Detailed Sync Implementation

### Sync Service Architecture

#### Core Sync Service (`src/lib/brevo-sync-service.ts`)
```typescript
interface SyncConfig {
  batchSize: number;
  delayMs: number;
  maxRetries: number;
  resumeFrom?: number;
}

interface SyncResult {
  success: boolean;
  processed: number;
  successful: number;
  failed: number;
  errors: Array<{ email: string; error: string; userId: string }>;
  lastProcessedIndex: number;
}

class BrevoSyncService {
  async syncAllUsers(config: SyncConfig): Promise<SyncResult>
  async syncBatch(users: User[], startIndex: number): Promise<SyncResult>
  async checkUserExists(email: string): Promise<boolean>
  async addUserToBrevo(user: User): Promise<boolean>
  async updateSyncProgress(progress: SyncProgress): Promise<void>
  async getSyncProgress(): Promise<SyncProgress>
}
```

#### Sync Process Flow
1. **Query Existing Users**: Get all users from Supabase auth.users
2. **Filter New Users**: Only process users created before integration date
3. **Batch Processing**: Process users in configurable batches
4. **Duplicate Check**: Verify user doesn't already exist in Brevo
5. **Add to Brevo**: Add user to designated list with proper attributes
6. **Progress Tracking**: Update sync progress after each batch
7. **Error Handling**: Log errors and continue with next batch
8. **Resume Capability**: Store last processed index for resumption

#### Sync Script Implementation (`scripts/sync-existing-users.ts`)
```typescript
async function syncExistingUsers() {
  // 1. Environment validation
  // 2. Database connection
  // 3. Get all users
  // 4. Process in batches
  // 5. Progress reporting
  // 6. Error handling
  // 7. Completion summary
}
```

### Sync Monitoring & Recovery

#### Progress Tracking
- **Real-time updates**: Progress bar with current status
- **Error logging**: Detailed error information for each failed user
- **Resume points**: Store last successful batch for resumption
- **Completion summary**: Final report with success/failure counts

#### Error Recovery
- **Retry logic**: Automatic retry for transient failures
- **Skip failed users**: Continue processing other users
- **Manual retry**: Ability to retry specific failed users
- **Partial completion**: Resume from last successful point

#### Performance Optimization
- **Batch size tuning**: Configurable batch sizes for optimal performance
- **Rate limiting**: Respect Brevo API rate limits
- **Parallel processing**: Process multiple users concurrently (if API allows)
- **Memory management**: Process large user lists efficiently

## Conclusion

This integration plan provides a comprehensive approach to adding new users to a Brevo list during the registration process, with special emphasis on syncing existing users who registered before the implementation. The plan includes robust sync mechanisms, progress tracking, error recovery, and performance optimization to ensure all users are properly added to the Brevo list regardless of when they registered.

The implementation leverages existing infrastructure while adding robust error handling and monitoring capabilities. The phased approach ensures smooth deployment and allows for future enhancements based on user behavior and business needs. 