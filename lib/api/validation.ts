/**
 * API Request Validation
 * Utilities for validating API requests
 */

import { ValidationError } from '@/lib/errors';

/**
 * Validate string input
 */
export function validateString(
  value: unknown,
  fieldName: string,
  options: {
    minLength?: number;
    maxLength?: number;
    required?: boolean;
  } = {}
): string {
  const { minLength = 0, maxLength = 10000, required = true } = options;

  if (required && (value === undefined || value === null)) {
    throw new ValidationError(`${fieldName} is required`, fieldName);
  }

  if (value === undefined || value === null) {
    return '';
  }

  if (typeof value !== 'string') {
    throw new ValidationError(`${fieldName} must be a string`, fieldName);
  }

  const trimmed = value.trim();

  if (required && trimmed.length === 0) {
    throw new ValidationError(`${fieldName} cannot be empty`, fieldName);
  }

  if (trimmed.length < minLength) {
    throw new ValidationError(
      `${fieldName} must be at least ${minLength} characters`,
      fieldName
    );
  }

  if (trimmed.length > maxLength) {
    throw new ValidationError(
      `${fieldName} must be at most ${maxLength} characters`,
      fieldName
    );
  }

  return trimmed;
}

/**
 * Validate email format
 */
export function validateEmail(email: unknown, fieldName: string = 'email'): string {
  const emailString = validateString(email, fieldName);
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailString)) {
    throw new ValidationError(`Invalid ${fieldName} format`, fieldName);
  }

  return emailString;
}

/**
 * Validate JSON body
 */
export async function validateJsonBody<T>(
  request: Request,
  validator?: (data: unknown) => T
): Promise<T> {
  try {
    const data = await request.json();
    
    if (validator) {
      return validator(data);
    }
    
    return data as T;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new ValidationError('Invalid JSON in request body');
    }
    throw error;
  }
}

/**
 * Validate request method
 */
export function validateMethod(
  request: Request,
  allowedMethods: string[]
): void {
  if (!allowedMethods.includes(request.method)) {
    throw new ValidationError(
      `Method ${request.method} not allowed. Allowed methods: ${allowedMethods.join(', ')}`
    );
  }
}

