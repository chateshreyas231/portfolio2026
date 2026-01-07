/**
 * Profile API Route
 * Handles fetching and updating profile data from Firebase
 */

import { NextRequest, NextResponse } from 'next/server';
import { getProfileFromFirebase, saveProfileToFirebase, updateProfileInFirebase } from '@/lib/firebase/profileService';
import { formatErrorResponse, logError } from '@/lib/errors';
import { validateJsonBody } from '@/lib/api/validation';

// GET - Fetch profile data
export async function GET() {
  try {
    const profile = await getProfileFromFirebase();
    
    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(profile);
  } catch (error) {
    logError(error, { endpoint: '/api/profile', method: 'GET' });
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(
      { error: errorResponse.error, code: errorResponse.code },
      { status: errorResponse.statusCode }
    );
  }
}

// POST - Save/Update profile data
export async function POST(request: NextRequest) {
  try {
    const profileData = await validateJsonBody<any>(request);
    
    const success = await saveProfileToFirebase(profileData);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to save profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Profile saved successfully' });
  } catch (error) {
    logError(error, { endpoint: '/api/profile', method: 'POST' });
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(
      { error: errorResponse.error, code: errorResponse.code },
      { status: errorResponse.statusCode }
    );
  }
}

// PATCH - Update profile data
export async function PATCH(request: NextRequest) {
  try {
    const updates = await request.json();
    
    const success = await updateProfileInFirebase(updates);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    logError(error, { endpoint: '/api/profile', method: 'PATCH' });
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(
      { error: errorResponse.error, code: errorResponse.code },
      { status: errorResponse.statusCode }
    );
  }
}

