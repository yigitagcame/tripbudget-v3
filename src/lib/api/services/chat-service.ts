import OpenAI from 'openai';
import { BaseService, ServiceResponse } from './base-service';
import { MessageService } from '../chat/message-service';
import { MessageCounterServiceServer } from '../../server/message-counter-service-server';
import { tripServiceServer } from '../../server/trip-service-server';
import { 
  flightSearchFunction, 
  executeFlightSearch, 
  accommodationSearchFunction, 
  executeAccommodationSearch,
  cheapestDestinationFunction,
  executeCheapestDestinationSearch,
  packageDealFunction,
  executePackageDealSearch,
  seasonalPriceAnalysisFunction,
  executeSeasonalPriceAnalysis
} from '../chat/function-registry';
import { transformFlightResultsToCards } from '../flight/flight-transformer';
import { transformAccommodationResultsToCards } from '../accommodation/accommodation-transformer';
import { 
  transformCheapestDestinationResults, 
  transformPackageDealResults, 
  transformSeasonalAnalysisResults 
} from '../chat/creative-results-transformer';
import { validateFlightSearchParams, validateAccommodationSearchParams } from '../../utils/validation';
import { checkRateLimit } from '../../utils/rate-limiter';
import { trackMessageLimitReached, trackApiError } from '../../utils/posthog';
import { functionDefinitions } from '../chat/function-registry';

export interface ChatMessage {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  cards?: any[];
  followUp?: string;
  tripContext?: TripDetails;
}

export interface TripDetails {
  from: string;
  to: string;
  departDate: string;
  returnDate: string;
  passengers: number;
}

export interface ChatRequest {
  message: string;
  conversationHistory: ChatMessage[];
  tripId?: string;
  currency?: string;
  userId: string;
}

export interface ChatResponse {
  id: number;
  type: 'ai';
  content: string;
  timestamp: Date;
  cards: any[];
  followUp: string;
  tripContext: TripDetails;
  tripId?: string;
  intent?: string;
  functionToCall?: string;
}

export class ChatService extends BaseService {
  private openai: OpenAI;
  private messageService: typeof MessageService;
  private messageCounterService: MessageCounterServiceServer;

  constructor() {
    super();
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.messageService = MessageService;
    this.messageCounterService = new MessageCounterServiceServer();
  }

  async processChatMessage(request: ChatRequest): Promise<ServiceResponse<ChatResponse>> {
    try {
      // Validate required fields
      const validationError = this.validateRequiredFields(request, ['message', 'userId']);
      if (validationError) {
        return this.createErrorResponse(
          'validation',
          validationError.message,
          validationError.status,
          validationError.code,
          validationError.details
        );
      }

      // Check rate limit
      const rateLimitResult = await checkRateLimit(request.userId);
      if (!rateLimitResult.allowed) {
        return this.createErrorResponse(
          'rate_limit',
          'Rate limit exceeded. Please try again later.',
          429,
          'RATE_LIMIT_EXCEEDED',
          {
            remaining: rateLimitResult.remaining,
            resetTime: rateLimitResult.resetTime
          }
        );
      }

      // Check message limit
      if (request.tripId) {
        const messageCounter = await MessageCounterServiceServer.getUserCounter(request.userId);
        if (messageCounter.message_count <= 0) {
          trackMessageLimitReached({ userId: request.userId });
          return this.createErrorResponse(
            'client',
            'You have reached your message limit. Please get more messages to continue chatting.',
            429,
            'MESSAGE_LIMIT_REACHED',
            { remaining: 0 }
          );
        }
      }

      // Process the chat message
      const response = await this.generateChatResponse(request);
      
      // Save message to database if tripId is provided
      if (request.tripId) {
        await this.saveMessage(request, response);
        await MessageCounterServiceServer.decreaseMessageCount(request.userId, 1);
      }

      return this.createSuccessResponse(response);
    } catch (error) {
      return this.handleServiceError(error, 'processChatMessage');
    }
  }

  private async generateChatResponse(request: ChatRequest): Promise<ChatResponse> {
    const systemPrompt = this.buildSystemPrompt(request);
    const messages = this.buildMessages(request, systemPrompt);

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 2000,
      functions: functionDefinitions.map(fn => fn.function),
      function_call: 'auto'
    });

    const response = completion.choices[0];
    const functionCall = response.message.function_call;

    if (functionCall) {
      return await this.handleFunctionCall(functionCall, request);
    }

    return this.parseAIResponse(response.message.content || '', request);
  }

  private buildSystemPrompt(request: ChatRequest): string {
    const currentDate = this.getCurrentDateString();
    const tripContext = request.tripId ? this.createTripContextString(request) : '';

    return `You are an AI travel assistant that helps users plan their trips.

CRITICAL: Respond with only a valid JSON object — no markdown, preamble, or escaping unless necessary.

RESPONSE FORMAT:
{
  "message": "Your response message",
  "suggestions": [
    {
      "type": "flight|hotel|restaurant|activity|place|destination|package|seasonal",
      "title": "Suggestion title",
      "description": "Description",
      "price": "Price if available",
      "location": "Location if relevant"
    }
  ],
  "followUpMessage": "Follow-up question or suggestion",
  "tripContext": {
    "from": "Origin",
    "to": "Destination", 
    "departDate": "YYYY-MM-DD",
    "returnDate": "YYYY-MM-DD",
    "passengers": 1
  },
  "intent": "detected_user_intent",
  "functionToCall": "function_name_if_needed"
}

Current date: ${currentDate}
${tripContext}

Be helpful, informative, and engaging. Provide specific, actionable advice.`;
  }

  private buildMessages(request: ChatRequest, systemPrompt: string): any[] {
    const messages = [
      { role: 'system', content: systemPrompt }
    ];

    // Add conversation history
    request.conversationHistory.forEach(msg => {
      messages.push({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      });
    });

    // Add current message
    messages.push({
      role: 'user',
      content: request.message
    });

    return messages;
  }

  private async handleFunctionCall(functionCall: any, request: ChatRequest): Promise<ChatResponse> {
    const functionName = functionCall.name;
    const functionArgs = JSON.parse(functionCall.arguments);

    let results: any;
    let cards: any[] = [];

    switch (functionName) {
      case 'search_flights':
        const flightValidationErrors = validateFlightSearchParams(functionArgs);
        if (flightValidationErrors.length > 0) {
          throw new Error(flightValidationErrors.join(', '));
        }
        results = await executeFlightSearch(functionArgs);
        break;

      case 'search_accommodation':
        const accommodationValidationErrors = validateAccommodationSearchParams(functionArgs);
        if (accommodationValidationErrors.length > 0) {
          throw new Error(accommodationValidationErrors.join(', '));
        }
        results = await executeAccommodationSearch(functionArgs);
        break;

      case 'find_cheapest_destination':
        results = await executeCheapestDestinationSearch(functionArgs);
        break;

      case 'find_package_deals':
        results = await executePackageDealSearch(functionArgs);
        break;

      case 'analyze_seasonal_prices':
        results = await executeSeasonalPriceAnalysis(functionArgs);
        break;

      default:
        throw new Error(`Unknown function: ${functionName}`);
    }

    return {
      id: Date.now(),
      type: 'ai',
      content: this.generateFunctionResponse(functionName, results),
      timestamp: new Date(),
      cards,
      followUp: this.generateFollowUpMessage(functionName),
      tripContext: this.extractTripContext(request),
      tripId: request.tripId,
      intent: functionName,
      functionToCall: functionName
    };
  }

  private parseAIResponse(content: string, request: ChatRequest): ChatResponse {
    const sanitizedContent = this.sanitizeJSONResponse(content);
    let parsedResponse: any;

    try {
      parsedResponse = JSON.parse(sanitizedContent);
    } catch (error) {
      // Fallback to simple text response
      return {
        id: Date.now(),
        type: 'ai',
        content: content,
        timestamp: new Date(),
        cards: [],
        followUp: 'How else can I help you with your trip?',
        tripContext: this.extractTripContext(request),
        tripId: request.tripId
      };
    }

    return {
      id: Date.now(),
      type: 'ai',
      content: parsedResponse.message || content,
      timestamp: new Date(),
      cards: parsedResponse.suggestions || [],
      followUp: parsedResponse.followUpMessage || 'How else can I help you?',
      tripContext: parsedResponse.tripContext || this.extractTripContext(request),
      tripId: request.tripId,
      intent: parsedResponse.intent,
      functionToCall: parsedResponse.functionToCall
    };
  }

  private async saveMessage(request: ChatRequest, response: ChatResponse): Promise<void> {
    // Save user message
    await this.messageService.createMessage({
      trip_id: request.tripId!,
      user_id: request.userId,
      type: 'user',
      content: request.message
    });

    // Save AI response
    await this.messageService.createMessage({
      trip_id: request.tripId!,
      user_id: request.userId,
      type: 'ai',
      content: response.content,
      cards: response.cards,
      follow_up: response.followUp,
      trip_context: response.tripContext
    });
  }

  private getCurrentDateString(): string {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return now.toLocaleDateString('en-US', options);
  }

  private sanitizeJSONResponse(text: string): string {
    return text
      .replace(/^```json\s*/i, '')
      .replace(/^```/, '')
      .replace(/```$/, '')
      .trim();
  }

  private createTripContextString(request: ChatRequest): string {
    // This would be implemented based on your trip context logic
    return '';
  }

  private extractTripContext(request: ChatRequest): TripDetails {
    // This would extract trip context from the request
    return {
      from: '',
      to: '',
      departDate: '',
      returnDate: '',
      passengers: 1
    };
  }

  private generateFunctionResponse(functionName: string, results: any): string {
    // Generate appropriate response based on function results
    return `I found some great options for you! Check out the suggestions below.`;
  }

  private generateFollowUpMessage(functionName: string): string {
    const followUps = {
      flightSearch: 'Would you like me to search for hotels or activities at your destination?',
      accommodationSearch: 'Would you like me to search for flights or activities?',
      cheapestDestinationSearch: 'Would you like me to search for flights to these destinations?',
      packageDealSearch: 'Would you like me to search for individual flights and hotels?',
      seasonalPriceAnalysis: 'Would you like me to search for current prices to these destinations?'
    };

    return followUps[functionName as keyof typeof followUps] || 'How else can I help you with your trip?';
  }
} 