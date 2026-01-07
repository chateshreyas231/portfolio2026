/**
 * Environment Variables Validation
 * Ensures all required environment variables are set
 */

const requiredEnvVars = {
  // Firebase (client-side)
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  
  // Optional but recommended
  OPENAI_API_KEY: process.env.OPENAI_API_KEY, // Optional - AI widget can work without it
} as const;

// Optional environment variables (not required for basic functionality)
// These are checked individually where needed

/**
 * Validate environment variables
 * Throws error if required vars are missing
 */
export function validateEnv() {
  const missing: string[] = [];

  // Check required vars
  if (!requiredEnvVars.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    missing.push('NEXT_PUBLIC_FIREBASE_PROJECT_ID');
  }
  if (!requiredEnvVars.NEXT_PUBLIC_FIREBASE_API_KEY) {
    missing.push('NEXT_PUBLIC_FIREBASE_API_KEY');
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env.local file.'
    );
  }
}

/**
 * Get environment variable with validation
 */
export function getEnvVar(key: keyof typeof requiredEnvVars | 'USE_OLLAMA' | 'OLLAMA_URL' | 'FIREBASE_SERVICE_ACCOUNT_KEY'): string {
  const value = process.env[key];
  if (!value && key in requiredEnvVars) {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  return value || '';
}

/**
 * Check if we're in production
 */
export const isProduction = process.env.NODE_ENV === 'production';

/**
 * Check if we're in development
 */
export const isDevelopment = process.env.NODE_ENV === 'development';

// Validate on module load (server-side only)
if (typeof window === 'undefined') {
  try {
    validateEnv();
  } catch (error) {
    if (isDevelopment) {
      console.warn('⚠️  Environment validation warning:', (error as Error).message);
    } else {
      throw error;
    }
  }
}

