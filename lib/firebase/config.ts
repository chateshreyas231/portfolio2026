/**
 * Firebase Configuration
 * Initialize Firebase Admin SDK for server-side operations
 */

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';

// Initialize Firebase Admin (server-side only)
if (!getApps().length) {
  try {
    // For server-side, use service account or environment variables
    // You'll need to set these in your .env.local file
    let serviceAccount;
    
    // Try to get from environment variable (as JSON string)
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      } catch {
        // If parsing fails, try as file path
        const keyPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY.trim();
        if (fs.existsSync(keyPath)) {
          serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf-8'));
        }
      }
    }
    
    // Try to load from default location if not found
    if (!serviceAccount) {
      // Try to find service account file in project root
      const files = fs.readdirSync(process.cwd()).filter((f: string) => 
        f.includes('firebase-adminsdk') && f.endsWith('.json')
      );
      if (files.length > 0) {
        const serviceAccountPath = path.join(process.cwd(), files[0]);
        serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));
      }
    }

    if (serviceAccount) {
      initializeApp({
        credential: cert(serviceAccount),
      });
    } else {
      // Fallback: Use default credentials (for Firebase Emulator or if using client SDK)
      console.warn('Firebase Admin: Using default credentials. Set FIREBASE_SERVICE_ACCOUNT_KEY for production.');
      initializeApp();
    }
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
  }
}

export const db = getFirestore();

