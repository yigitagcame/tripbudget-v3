// Chat-related type definitions

export interface ChatMessage {
  id: string;
  tripId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: {
    functionCall?: FunctionCall;
    functionResult?: any;
    tokens?: number;
    model?: string;
  };
  status: 'sending' | 'sent' | 'error';
  error?: string;
}

export interface FunctionCall {
  name: string;
  arguments: Record<string, any>;
}

export interface ChatContext {
  tripId: string;
  userId: string;
  messages: ChatMessage[];
  metadata: {
    destination?: string;
    dates?: {
      start: string;
      end: string;
    };
    budget?: number;
    travelers?: number;
    preferences?: Record<string, any>;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ChatSession {
  id: string;
  tripId: string;
  userId: string;
  title: string;
  summary?: string;
  messageCount: number;
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface SendMessageParams {
  tripId: string;
  content: string;
  context?: Record<string, any>;
}

export interface SendMessageResponse {
  success: boolean;
  message: ChatMessage;
  error?: string;
}

export interface GetMessagesParams {
  tripId: string;
  limit?: number;
  offset?: number;
  before?: string;
  after?: string;
}

export interface GetMessagesResponse {
  success: boolean;
  messages: ChatMessage[];
  hasMore: boolean;
  total: number;
  error?: string;
}

export interface ChatFunction {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, any>;
    required: string[];
  };
}

export interface ChatFunctionHandler {
  (args: any): Promise<any>;
}

export interface ChatFunctionDefinition {
  function: OpenAIFunction;
  handler: ChatFunctionHandler;
}

export interface ChatFunctionRegistry {
  [key: string]: ChatFunctionDefinition;
}

export interface ChatConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  functions?: ChatFunction[];
  systemPrompt?: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  config?: Partial<ChatConfig>;
  context?: Record<string, any>;
}

export interface ChatResponse {
  success: boolean;
  message: ChatMessage;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  error?: string;
}

export interface MessageCounter {
  userId: string;
  tripId: string;
  count: number;
  limit: number;
  resetAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface MessageCounterParams {
  userId: string;
  tripId: string;
}

export interface MessageCounterResponse {
  success: boolean;
  counter: MessageCounter;
  error?: string;
}

export interface IncrementMessageCountParams {
  userId: string;
  tripId: string;
  amount?: number;
}

export interface DecrementMessageCountParams {
  userId: string;
  tripId: string;
  amount?: number;
}

export interface ResetMessageCountParams {
  userId: string;
  tripId: string;
}

// OpenAI function definitions
export interface OpenAIFunction {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: {
      type: string;
      properties: Record<string, any>;
      required: string[];
    };
  };
}

export interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: 'assistant';
      content: string;
      function_call?: FunctionCall;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ChatError {
  code: string;
  message: string;
  details?: any;
}

export interface ProcessMessageParams {
  message: ChatMessage;
  context: ChatContext;
  config: ChatConfig;
}

export interface ProcessMessageResult {
  success: boolean;
  response: ChatMessage;
  error?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface TripContext {
  id: string;
  userId: string;
  title: string;
  destination?: string;
  dates?: {
    start: string;
    end: string;
  };
  budget?: number;
  travelers?: number;
  preferences?: {
    accommodation?: {
      type?: string[];
      amenities?: string[];
      maxPrice?: number;
    };
    flights?: {
      cabinClass?: string;
      airlines?: string[];
      maxPrice?: number;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface UpdateTripContextParams {
  tripId: string;
  updates: Partial<TripContext>;
}

export interface GetTripContextParams {
  tripId: string;
}

export interface TripContextResponse {
  success: boolean;
  context: TripContext;
  error?: string;
} 