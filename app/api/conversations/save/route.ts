import { NextRequest, NextResponse } from 'next/server';
import { saveConversationToFirebase, saveTranscriptToFirebase, generateSessionId, type Conversation, type Transcript } from '@/lib/firebase/conversationService';
import { validateJsonBody } from '@/lib/api/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await validateJsonBody<{
      sessionId: string;
      messages: Array<{ role: 'user' | 'assistant'; content: string; timestamp?: string }>;
      startedAt: string;
      endedAt?: string;
      userAgent?: string;
      metadata?: {
        topics?: string[];
        intents?: string[];
      };
    }>(request);

    const { sessionId, messages, startedAt, endedAt, userAgent, metadata } = body;

    if (!sessionId || !messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'sessionId and messages are required' },
        { status: 400 }
      );
    }

    // Convert messages to proper format
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
    }));

    // Create conversation object
    const conversation: Conversation = {
      sessionId,
      messages: formattedMessages,
      startedAt: new Date(startedAt),
      endedAt: endedAt ? new Date(endedAt) : undefined,
      duration: endedAt ? Math.floor((new Date(endedAt).getTime() - new Date(startedAt).getTime()) / 1000) : undefined,
      messageCount: messages.length,
      userAgent: userAgent || request.headers.get('user-agent') || undefined,
      metadata: metadata || {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save conversation to Firebase
    const conversationId = await saveConversationToFirebase(conversation);

    if (!conversationId) {
      return NextResponse.json(
        { error: 'Failed to save conversation' },
        { status: 500 }
      );
    }

    // Create transcript
    const fullTranscript = messages
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n\n');

    const transcript: Transcript = {
      conversationId,
      sessionId,
      fullTranscript,
      messageCount: messages.length,
      createdAt: new Date(),
    };

    // Save transcript to Firebase
    const transcriptId = await saveTranscriptToFirebase(transcript);

    return NextResponse.json({
      success: true,
      conversationId,
      transcriptId,
      message: 'Conversation and transcript saved successfully',
    });
  } catch (error) {
    console.error('Error saving conversation:', error);
    return NextResponse.json(
      { error: 'Failed to save conversation', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

