import { NextResponse } from 'next/server';
import { getBuildInfo } from '@/lib/buildInfo';

/**
 * Debug endpoint to check build version and verify deployments
 * Access at: /api/debug/build-info
 */
export async function GET() {
  const buildInfo = getBuildInfo();
  
  // Get environment info (for debugging)
  const envInfo = {
    nodeEnv: process.env.NODE_ENV,
    hasFirebaseProjectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    hasFirebaseApiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    hasOpenAiKey: !!process.env.OPENAI_API_KEY,
    hasGroqKey: !!process.env.GROQ_API_KEY,
    // Don't expose actual values, just whether they exist
  };
  
  return NextResponse.json({
    build: {
      ...buildInfo,
      timestamp: buildInfo.timestamp,
      formattedTimestamp: new Date(buildInfo.timestamp).toLocaleString(),
    },
    environment: envInfo,
    message: 'Use this to verify which version is deployed and what env vars are available',
    instructions: [
      'Compare commit hash with: git log --oneline -1',
      'Check if environment variables are set (hasFirebaseProjectId, etc.)',
      'If values differ, check GitHub Secrets match .env.local',
    ],
  });
}

