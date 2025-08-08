import { NextResponse } from 'next/server';

export interface ServiceError {
  type: 'validation' | 'network' | 'server' | 'client' | 'rate_limit' | 'auth';
  message: string;
  status: number;
  code?: string;
  details?: any;
}

export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ServiceError;
  message?: string;
}

export abstract class BaseService {
  protected logError(error: any, context: string): void {
    console.error(`[${this.constructor.name}] ${context}:`, error);
  }

  protected createErrorResponse(
    type: ServiceError['type'],
    message: string,
    status: number,
    code?: string,
    details?: any
  ): ServiceResponse {
    return {
      success: false,
      error: {
        type,
        message,
        status,
        code,
        details
      }
    };
  }

  protected createSuccessResponse<T>(data: T, message?: string): ServiceResponse<T> {
    return {
      success: true,
      data,
      message
    };
  }

  protected handleServiceError(error: any, context: string): ServiceResponse {
    this.logError(error, context);

    if (error instanceof Error) {
      return this.createErrorResponse(
        'server',
        error.message,
        500,
        'INTERNAL_SERVER_ERROR'
      );
    }

    return this.createErrorResponse(
      'server',
      'An unexpected error occurred',
      500,
      'UNKNOWN_ERROR'
    );
  }

  protected validateRequiredFields(data: any, fields: string[]): ServiceError | null {
    for (const field of fields) {
      if (!data[field]) {
        return {
          type: 'validation',
          message: `Missing required field: ${field}`,
          status: 400,
          code: 'MISSING_REQUIRED_FIELD',
          details: { field }
        };
      }
    }
    return null;
  }

  public createNextResponse<T>(serviceResponse: ServiceResponse<T>): NextResponse {
    const status = serviceResponse.error?.status || 200;
    return NextResponse.json(serviceResponse, { status });
  }
} 