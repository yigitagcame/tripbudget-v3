// User-related type definitions

export interface User {
  id: string;
  email: string;
  emailVerified?: boolean;
  name?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  lastSignInAt?: string;
  preferences?: UserPreferences;
  subscription?: UserSubscription;
  usage?: UserUsage;
}

export interface UserPreferences {
  language: string;
  currency: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    dataSharing: boolean;
  };
  travel: {
    preferredAirlines: string[];
    preferredHotels: string[];
    seatPreference: 'window' | 'aisle' | 'any';
    mealPreference?: string;
  };
}

export interface UserSubscription {
  plan: 'free' | 'basic' | 'premium' | 'enterprise';
  status: 'active' | 'inactive' | 'cancelled' | 'expired';
  startDate: string;
  endDate?: string;
  features: string[];
  limits: {
    monthlyTrips: number;
    monthlyMessages: number;
    storageGB: number;
  };
}

export interface UserUsage {
  currentMonth: {
    trips: number;
    messages: number;
    storageUsed: number;
  };
  limits: {
    monthlyTrips: number;
    monthlyMessages: number;
    storageGB: number;
  };
}

export interface AuthSession {
  user: User;
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
}

export interface AuthError {
  code: string;
  message: string;
  details?: any;
}

export interface SignUpParams {
  email: string;
  password: string;
  name?: string;
  avatar?: string;
}

export interface SignInParams {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface PasswordResetParams {
  email: string;
}

export interface UpdateProfileParams {
  name?: string;
  avatar?: string;
  preferences?: Partial<UserPreferences>;
}

export interface UpdatePasswordParams {
  currentPassword: string;
  newPassword: string;
}

export interface UserInvitation {
  id: string;
  email: string;
  invitedBy: string;
  invitedAt: string;
  acceptedAt?: string;
  status: 'pending' | 'accepted' | 'expired';
  expiresAt: string;
  code: string;
}

export interface CreateInvitationParams {
  email: string;
  message?: string;
  expiresIn?: number; // hours
}

export interface AcceptInvitationParams {
  code: string;
  password: string;
  name?: string;
}

export interface UserStats {
  totalTrips: number;
  totalMessages: number;
  totalSavings: number;
  averageTripCost: number;
  favoriteDestinations: string[];
  travelHistory: {
    month: string;
    trips: number;
    cost: number;
  }[];
}

export interface UserActivity {
  id: string;
  type: 'trip_created' | 'message_sent' | 'search_performed' | 'booking_made';
  description: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface UserActivityLog {
  activities: UserActivity[];
  total: number;
  hasMore: boolean;
}

// Brevo integration types
export interface BrevoUser {
  id: number;
  email: string;
  attributes: {
    FIRSTNAME?: string;
    LASTNAME?: string;
    SMS?: string;
    [key: string]: any;
  };
  emailBlacklisted: boolean;
  smsBlacklisted: boolean;
  listIds: number[];
  updateAt: string;
}

export interface CreateBrevoUserParams {
  email: string;
  attributes?: {
    FIRSTNAME?: string;
    LASTNAME?: string;
    SMS?: string;
    [key: string]: any;
  };
  listIds?: number[];
  updateEnabled?: boolean;
}

export interface UpdateBrevoUserParams {
  email: string;
  attributes?: {
    FIRSTNAME?: string;
    LASTNAME?: string;
    SMS?: string;
    [key: string]: any;
  };
}

export interface BrevoUserResponse {
  success: boolean;
  data?: BrevoUser;
  error?: string;
}

// Authentication function types for OpenAI
export interface AuthFunctionCall {
  name: 'get_user_profile' | 'update_user_preferences' | 'get_user_stats';
  parameters?: Record<string, any>;
}

export const authFunctions = {
  getUserProfile: {
    type: 'function' as const,
    function: {
      name: 'get_user_profile',
      description: 'Get the current user profile information',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  },
  updateUserPreferences: {
    type: 'function' as const,
    function: {
      name: 'update_user_preferences',
      description: 'Update user preferences',
      parameters: {
        type: 'object',
        properties: {
          language: {
            type: 'string',
            description: 'Preferred language (e.g., "en", "es", "fr")'
          },
          currency: {
            type: 'string',
            description: 'Preferred currency (e.g., "USD", "EUR", "GBP")'
          },
          notifications: {
            type: 'object',
            description: 'Notification preferences',
            properties: {
              email: {
                type: 'boolean',
                description: 'Email notifications enabled'
              },
              push: {
                type: 'boolean',
                description: 'Push notifications enabled'
              }
            }
          }
        },
        required: []
      }
    }
  },
  getUserStats: {
    type: 'function' as const,
    function: {
      name: 'get_user_stats',
      description: 'Get user statistics and usage information',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  }
} as const; 