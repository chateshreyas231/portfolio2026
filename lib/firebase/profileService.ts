/**
 * Firebase Profile Service
 * Handles storing and retrieving Shreyas Chate's profile data
 */

import { db } from './config';

const PROFILE_COLLECTION = 'profile';
const PROFILE_DOC_ID = 'shreyas_chate';

export interface ProfileData {
  name: string;
  summary: string;
  background: string;
  education: any;
  experience: any[];
  major_projects: any[];
  skills: any;
  personality: string;
  likes_dislikes: any;
  goals: string[];
  achievements: string[];
  certifications: string[];
  resume_url: string;
  calendly_or_scheduler_url: string;
  scheduler: {
    google_meet_api: string;
    teams_api: string;
  };
  location: string;
  email: string;
  phone: string;
  social: any;
  contact?: any;
  updatedAt?: Date;
}

/**
 * Get profile data from Firebase (Server-side)
 */
export async function getProfileFromFirebase(): Promise<ProfileData | null> {
  try {
    const profileRef = db.collection(PROFILE_COLLECTION).doc(PROFILE_DOC_ID);
    const profileSnap = await profileRef.get();

    if (profileSnap.exists) {
      return profileSnap.data() as ProfileData;
    }
    return null;
  } catch (error) {
    console.error('Error fetching profile from Firebase:', error);
    return null;
  }
}

/**
 * Save profile data to Firebase (Server-side)
 */
export async function saveProfileToFirebase(profileData: ProfileData): Promise<boolean> {
  try {
    console.log('saveProfileToFirebase: Starting save operation...');
    console.log('Collection:', PROFILE_COLLECTION, 'Document:', PROFILE_DOC_ID);
    
    const profileRef = db.collection(PROFILE_COLLECTION).doc(PROFILE_DOC_ID);
    
    // Use Firestore Timestamp for updatedAt
    const { Timestamp } = await import('firebase-admin/firestore');
    
    await profileRef.set({
      ...profileData,
      updatedAt: Timestamp.now(),
    }, { merge: true });
    
    console.log('saveProfileToFirebase: Successfully saved to Firestore');
    return true;
  } catch (error: any) {
    console.error('Error saving profile to Firebase:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
    return false;
  }
}

/**
 * Update profile data in Firebase (Server-side)
 */
export async function updateProfileInFirebase(updates: Partial<ProfileData>): Promise<boolean> {
  try {
    const profileRef = db.collection(PROFILE_COLLECTION).doc(PROFILE_DOC_ID);
    await profileRef.update({
      ...updates,
      updatedAt: new Date(),
    });
    return true;
  } catch (error) {
    console.error('Error updating profile in Firebase:', error);
    return false;
  }
}


