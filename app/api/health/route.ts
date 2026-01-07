/**
 * Health Check API Route
 * Used by Cloud Run for health checks and monitoring
 */

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'portfolio-app',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
}
