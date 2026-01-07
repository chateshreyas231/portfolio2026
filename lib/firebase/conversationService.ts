/**
 * Firebase Conversation Service
 * Handles storing and retrieving conversation transcripts
 */

import { db } from './config';
import { Timestamp } from 'firebase-admin/firestore';

const CONVERSATIONS_COLLECTION = 'conversations';
const TRANSCRIPTS_COLLECTION = 'transcripts';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface Conversation {
  id?: string;
  sessionId: string; // Unique session identifier
  messages: Message[];
  startedAt: Date;
  endedAt?: Date;
  duration?: number; // in seconds
  messageCount: number;
  userId?: string; // Optional: for authenticated users
  userAgent?: string;
  ipAddress?: string;
  metadata?: {
    topics?: string[];
    intents?: string[];
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Transcript {
  id?: string;
  conversationId: string;
  sessionId: string;
  fullTranscript: string;
  summary?: string;
  messageCount: number;
  createdAt: Date;
}

/**
 * Save a conversation to Firebase (Server-side)
 */
export async function saveConversationToFirebase(conversation: Conversation): Promise<string | null> {
  try {
    const conversationsRef = db.collection(CONVERSATIONS_COLLECTION);
    const docRef = await conversationsRef.add({
      ...conversation,
      startedAt: Timestamp.fromDate(conversation.startedAt),
      endedAt: conversation.endedAt ? Timestamp.fromDate(conversation.endedAt) : null,
      createdAt: Timestamp.fromDate(conversation.createdAt),
      updatedAt: Timestamp.fromDate(conversation.updatedAt),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving conversation to Firebase:', error);
    return null;
  }
}

/**
 * Save a transcript to Firebase (Server-side)
 */
export async function saveTranscriptToFirebase(transcript: Transcript): Promise<string | null> {
  try {
    const transcriptsRef = db.collection(TRANSCRIPTS_COLLECTION);
    const docRef = await transcriptsRef.add({
      ...transcript,
      createdAt: Timestamp.fromDate(transcript.createdAt),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving transcript to Firebase:', error);
    return null;
  }
}

/**
 * Get conversations by session ID (Server-side)
 */
export async function getConversationsBySessionId(sessionId: string): Promise<Conversation[]> {
  try {
    const conversationsRef = db.collection(CONVERSATIONS_COLLECTION);
    const querySnapshot = await conversationsRef
      .where('sessionId', '==', sessionId)
      .orderBy('startedAt', 'desc')
      .get();
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        startedAt: data.startedAt.toDate(),
        endedAt: data.endedAt ? data.endedAt.toDate() : undefined,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as Conversation;
    });
  } catch (error) {
    console.error('Error fetching conversations from Firebase:', error);
    return [];
  }
}

/**
 * Get recent conversations (Server-side)
 */
export async function getRecentConversations(limitCount: number = 50): Promise<Conversation[]> {
  try {
    const conversationsRef = db.collection(CONVERSATIONS_COLLECTION);
    const querySnapshot = await conversationsRef
      .orderBy('startedAt', 'desc')
      .limit(limitCount)
      .get();
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        startedAt: data.startedAt.toDate(),
        endedAt: data.endedAt ? data.endedAt.toDate() : undefined,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as Conversation;
    });
  } catch (error) {
    console.error('Error fetching recent conversations from Firebase:', error);
    return [];
  }
}


/**
 * Generate a unique session ID
 */
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

