/**
 * Conversations API Route
 * Handles saving and retrieving conversations and transcripts
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  saveConversationToFirebase,
  saveTranscriptToFirebase,
  getConversationsBySessionId,
  getRecentConversations,
  type Conversation,
  type Transcript,
} from '@/lib/firebase/conversationService';

// POST - Save a conversation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { conversation, transcript } = body;

    let conversationId: string | null = null;
    let transcriptId: string | null = null;

    // Save conversation if provided
    if (conversation) {
      conversationId = await saveConversationToFirebase(conversation as Conversation);
    }

    // Save transcript if provided
    if (transcript) {
      transcriptId = await saveTranscriptToFirebase(transcript as Transcript);
    }

    return NextResponse.json({
      success: true,
      conversationId,
      transcriptId,
    });
  } catch (error) {
    console.error('Error saving conversation/transcript:', error);
    return NextResponse.json(
      { error: 'Failed to save conversation/transcript' },
      { status: 500 }
    );
  }
}

// GET - Get conversations by session ID or recent conversations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const limit = parseInt(searchParams.get('limit') || '50');

    let conversations: Conversation[];

    if (sessionId) {
      conversations = await getConversationsBySessionId(sessionId);
    } else {
      conversations = await getRecentConversations(limit);
    }

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}

