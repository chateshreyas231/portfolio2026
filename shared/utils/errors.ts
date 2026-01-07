/**
 * Shared Error Utilities
 * Standardized error handling across microservices
 */

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    super(
      id ? `${resource} with id ${id} not found` : `${resource} not found`,
      404,
      'NOT_FOUND'
    );
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403, 'FORBIDDEN');
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(service: string, message?: string) {
    super(
      message || `Service ${service} is unavailable`,
      503,
      'SERVICE_UNAVAILABLE',
      { service }
    );
  }
}

export function formatErrorResponse(error: unknown): {
  success: false;
  error: string;
  code?: string;
  details?: any;
} {
  if (error instanceof AppError) {
    return {
      success: false,
      error: error.message,
      code: error.code,
      details: error.details
    };
  }

  if (error instanceof Error) {
    return {
      success: false,
      error: error.message
    };
  }

  return {
    success: false,
    error: 'An unknown error occurred'
  };
}

