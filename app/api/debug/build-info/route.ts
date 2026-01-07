import { NextResponse } from 'next/server';
import { getBuildInfo } from '@/lib/buildInfo';

/**
 * Debug endpoint to check build version and verify deployments
 * Access at: /api/debug/build-info
 */
export async function GET() {
  const buildInfo = getBuildInfo();
  
  return NextResponse.json({
    ...buildInfo,
    timestamp: buildInfo.timestamp,
    formattedTimestamp: new Date(buildInfo.timestamp).toLocaleString(),
    message: 'Use this to verify which version is deployed',
  });
}

