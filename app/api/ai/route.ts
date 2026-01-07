import { NextRequest, NextResponse } from 'next/server';
import { formatErrorResponse, logError, ValidationError } from '@/lib/errors';
import { validateString, validateJsonBody } from '@/lib/api/validation';

const USE_LOCAL = process.env.USE_OLLAMA === 'true';
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(request: NextRequest) {
  try {
    // Validate request body
    const body = await validateJsonBody<{
      userMessage: string;
      history?: any[];
      useLocalAI?: boolean;
      ragContext?: string;
    }>(request);
    const { userMessage, history, useLocalAI, ragContext } = body;

    // Validate user message
    const validatedMessage = validateString(userMessage, 'userMessage', {
      minLength: 1,
      maxLength: 5000,
      required: true,
    });

    const useLocal = useLocalAI || USE_LOCAL;

    // Validate history if provided
    if (history && (!Array.isArray(history) || history.length > 50)) {
      throw new ValidationError('Invalid conversation history format or too long');
    }

    if (useLocal) {
      // Ollama Integration
      try {
        const response = await fetch(`${OLLAMA_URL}/api/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama2', // Change to your preferred model
            messages: [
              {
                role: 'system',
                content: `You are Mr. Shreyas Chate's AI assistant. Be brief (2-3 sentences) unless asked for details. Always refer to him as "Mr. Shreyas" or "Mr. Shreyas Chate". Answer only what's asked. Use RAG context when provided.${ragContext ? `\n\nContext: ${ragContext.substring(0, 500)}` : ''}`
              },
              ...(history || []).slice(-6), // Limit history for speed
                {
                  role: 'user',
                  content: validatedMessage
                }
            ],
            stream: false
          }),
        });

        if (!response.ok) {
          throw new Error('Ollama request failed');
        }

        const data = await response.json();
        return NextResponse.json({ 
          reply: data.message?.content || data.response || 'I apologize, but I couldn\'t process that request.'
        });
      } catch (ollamaError) {
        console.error('Ollama error:', ollamaError);
        // Fallback to OpenAI if Ollama fails
      }
    }

    // OpenAI Integration (Fallback or Primary)
    if (OPENAI_API_KEY) {
      try {
        // Optimized system prompt - shorter for faster responses
        const systemPrompt = `You are Mr. Shreyas Chate's AI assistant. Be brief (1-2 sentences max) unless asked for details. Always refer to him as "Mr. Shreyas" or "Mr. Shreyas Chate". Answer only what's asked. Use RAG context when provided.${ragContext ? `\n\nContext: ${ragContext.substring(0, 300)}` : ''}`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini', // Fastest model
            messages: [
              {
                role: 'system',
                content: systemPrompt
              },
              ...(history || []).slice(-3), // Limit history to last 3 messages for speed
              {
                role: 'user',
                content: validatedMessage
              }
            ],
            temperature: 0.6, // Lower for faster, more consistent responses
            max_tokens: 150, // Further reduced for faster responses
            stream: false // Keep false for now, but can enable streaming later
          }),
        });

        if (!response.ok) {
          throw new Error('OpenAI request failed');
        }

        const data = await response.json();
        return NextResponse.json({ 
          reply: data.choices[0]?.message?.content || 'I apologize, but I couldn\'t process that request.'
        });
      } catch (openaiError) {
        console.error('OpenAI error:', openaiError);
      }
    }

    // Fallback response if both APIs fail
    return NextResponse.json({ 
      reply: `I understand you're asking: "${validatedMessage}". However, the AI backend is not configured. Please set up Ollama or OpenAI API key.`
    });
  } catch (error) {
    logError(error, { endpoint: '/api/ai', method: 'POST' });
    const errorResponse = formatErrorResponse(error);
    
    return NextResponse.json(
      { 
        error: errorResponse.error,
        code: errorResponse.code,
        reply: error instanceof ValidationError 
          ? 'I apologize, but I didn\'t receive a valid message. Could you please try again?'
          : 'I apologize, but I encountered an error. Could you please try again?'
      },
      { status: errorResponse.statusCode }
    );
  }
}

