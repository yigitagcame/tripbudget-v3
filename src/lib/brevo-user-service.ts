import * as SibApiV3Sdk from '@getbrevo/brevo';

export interface BrevoUserData {
  email: string;
  firstName?: string;
  lastName?: string;
  userId: string;
  signupDate: string;
  provider: string;
  referralSource?: string;
  initialTripContext?: string;
}

export interface SyncProgress {
  total: number;
  processed: number;
  successful: number;
  failed: number;
  errors: Array<{ email: string; error: string }>;
}

export class BrevoUserService {
  private apiInstance: SibApiV3Sdk.ContactsApi;
  private listId: number;
  private updateExisting: boolean;

  constructor() {
    this.apiInstance = new SibApiV3Sdk.ContactsApi();
    
    // Set API key using the correct method
    const apiKey = process.env.BREVO_API_KEY!;
    if (!apiKey) {
      throw new Error('BREVO_API_KEY environment variable is required');
    }
    
    // Configure API key
    this.apiInstance.setApiKey(SibApiV3Sdk.ContactsApiApiKeys.apiKey, apiKey);
    
    this.listId = parseInt(process.env.BREVO_USER_LIST_ID || '16');
    this.updateExisting = process.env.BREVO_UPDATE_EXISTING_CONTACTS === 'true';
    
    console.log('BrevoUserService initialized with:', {
      listId: this.listId,
      updateExisting: this.updateExisting,
      apiKeyConfigured: !!apiKey
    });
  }

  /**
   * Add a new user to the main Brevo list
   */
  async addUserToMainList(userData: BrevoUserData): Promise<boolean> {
    try {
      console.log(`Adding user to Brevo list: ${userData.email}`);

      // Create contact data
      const createContact = new SibApiV3Sdk.CreateContact();
      createContact.email = userData.email;
      createContact.listIds = [this.listId];
      createContact.updateEnabled = this.updateExisting;

      // Set standard attributes
      const attributes: any = {};
      
      if (userData.firstName) {
        attributes.FIRSTNAME = userData.firstName;
      }

      if (userData.lastName) {
        attributes.LASTNAME = userData.lastName;
      }

      // Set custom attributes
      const customAttributes: any = {
        USER_ID: userData.userId,
        SIGNUP_DATE: userData.signupDate,
        PROVIDER: userData.provider
      };

      if (userData.referralSource) {
        customAttributes.REFERRAL_SOURCE = userData.referralSource;
      }

      if (userData.initialTripContext) {
        customAttributes.INITIAL_TRIP_CONTEXT = userData.initialTripContext;
      }

      createContact.attributes = {
        ...createContact.attributes,
        ...customAttributes
      };

      // Add contact to the list
      await this.apiInstance.createContact(createContact);

      console.log(`Successfully added user to Brevo list: ${userData.email}`);
      return true;

    } catch (error: any) {
      console.error(`Error adding user to Brevo list: ${userData.email}`, error);
      
      // Handle specific Brevo API errors
      if (error.response?.body?.code === 'duplicate_parameter') {
        console.log(`User already exists in Brevo list: ${userData.email}`);
        return true; // Consider this a success since user is in list
      }
      
      return false;
    }
  }

  /**
   * Update existing user data in Brevo
   */
  async updateUserData(email: string, updates: Partial<BrevoUserData>): Promise<boolean> {
    try {
      console.log(`Updating user data in Brevo: ${email}`);

      const updateContact = new SibApiV3Sdk.UpdateContact();
      
      // Map updates to Brevo attributes
      const attributes: any = {};
      
      if (updates.firstName) {
        attributes.FIRSTNAME = updates.firstName;
      }
      
      if (updates.lastName) {
        attributes.LASTNAME = updates.lastName;
      }
      
      if (updates.referralSource) {
        attributes.REFERRAL_SOURCE = updates.referralSource;
      }
      
      if (updates.initialTripContext) {
        attributes.INITIAL_TRIP_CONTEXT = updates.initialTripContext;
      }

      updateContact.attributes = attributes;

      // Update contact
      await this.apiInstance.updateContact(email, updateContact);

      console.log(`Successfully updated user data in Brevo: ${email}`);
      return true;

    } catch (error: any) {
      console.error(`Error updating user data in Brevo: ${email}`, error);
      return false;
    }
  }

  /**
   * Check if a user exists in the Brevo list
   */
  async isUserInList(email: string): Promise<boolean> {
    try {
      console.log(`Checking if user exists in Brevo list: ${email}`);

      // Get contact information
      const contact = await this.apiInstance.getContactInfo(email);
      
      // Check if user is in our target list
      const isInList = contact.body.listIds?.includes(this.listId) || false;
      
      console.log(`User ${email} exists in Brevo list: ${isInList}`);
      return isInList;

    } catch (error: any) {
      console.log(`User ${email} not found in Brevo list`);
      return false;
    }
  }

  /**
   * Get sync progress (placeholder for future implementation)
   */
  async getSyncProgress(): Promise<SyncProgress> {
    // This would typically query a database or cache for sync progress
    // For now, return a placeholder
    return {
      total: 0,
      processed: 0,
      successful: 0,
      failed: 0,
      errors: []
    };
  }

  /**
   * Validate environment configuration
   */
  static validateEnvironment(): boolean {
    const requiredVars = [
      'BREVO_API_KEY',
      'BREVO_USER_LIST_ID',
      'BREVO_UPDATE_EXISTING_CONTACTS'
    ];

    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
      return false;
    }

    return true;
  }
}

// Export singleton instance (lazy-loaded)
let _brevoUserService: BrevoUserService | null = null;

export function getBrevoUserService(): BrevoUserService {
  if (!_brevoUserService) {
    _brevoUserService = new BrevoUserService();
  }
  return _brevoUserService;
} 