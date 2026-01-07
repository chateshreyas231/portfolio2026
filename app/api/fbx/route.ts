/**
 * API route to handle .fbx file requests
 * Returns empty response to prevent 404 errors from cached references
 */
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Return empty response for any .fbx file requests
  // This prevents 404 errors from browser cache or old references
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Content-Type': 'application/octet-stream',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}

