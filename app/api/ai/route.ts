import { NextRequest, NextResponse } from 'next/server';
import { formatErrorResponse, logError, ValidationError } from '@/lib/errors';
import { validateString, validateJsonBody } from '@/lib/api/validation';

const USE_LOCAL = process.env.USE_OLLAMA === 'true';
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

export async function POST(request: NextRequest) {
  try {
    // Validate request body
    const body = await validateJsonBody<{
      userMessage: string;
      history?: any[];
      useLocalAI?: boolean;
      ragContext?: string;
      sessionId?: string;
      topicHistory?: string[]; // Track topics discussed for progressive disclosure
    }>(request);
    const { userMessage, history, useLocalAI, ragContext, sessionId, topicHistory } = body;

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

    // Build enhanced system prompt for natural, friendly conversation
    const buildSystemPrompt = (ragContext?: string, topics?: string[]) => {
      let prompt = `You are a friendly, conversational AI assistant representing Mr. Shreyas Chate, a conversational AI engineer.

PERSONALITY & STYLE:
- Warm, approachable, and genuinely helpful - like a knowledgeable colleague
- Professional but never stiff or robotic
- Enthusiastic about technology and AI, but not overly technical unless asked
- Natural in conversation - respond like you're having a friendly chat
- Always refer to him as "Mr. Shreyas" or "Mr. Shreyas Chate"

CONVERSATION STRATEGY:
1. **Progressive Disclosure**: Start with brief, concise answers (2-3 sentences). Only go in-depth if the user asks for more details or says "tell me more", "elaborate", "details", etc.
2. **Ask Questions**: Be curious and engaging. Ask follow-up questions to understand what the user really wants to know.
3. **Remember Context**: Use the conversation history to remember what you've already discussed. Reference previous topics naturally.
4. **Be Conversational**: Match the user's tone (casual if they're casual, professional if they're professional). Use natural language, avoid corporate jargon.

TOPICS ALREADY DISCUSSED: ${topics && topics.length > 0 ? topics.join(', ') : 'None yet'}

${ragContext ? `\n\nRELEVANT CONTEXT: ${ragContext.substring(0, 500)}` : ''}

Remember: Be brief first, ask questions, remember context, and be naturally friendly!`;

      return prompt;
    };

    if (useLocal) {
      // Ollama Integration
      try {
        const systemPrompt = buildSystemPrompt(ragContext, topicHistory);
        const response = await fetch(`${OLLAMA_URL}/api/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama3.1:8b', // Upgraded from llama2
            messages: [
              {
                role: 'system',
                content: systemPrompt
              },
              ...(history || []).slice(-10), // Increased history for better context
              {
                role: 'user',
                content: validatedMessage
              }
            ],
            stream: false,
            temperature: 0.8, // More natural conversation
            max_tokens: 500, // Increased for better responses
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
        // Fallback to Groq/OpenAI if Ollama fails
      }
    }

    // Groq API Integration (Fast, free tier, great for conversational AI)
    if (GROQ_API_KEY && !useLocal) {
      try {
        const systemPrompt = buildSystemPrompt(ragContext, topicHistory);
        
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GROQ_API_KEY}`
          },
          body: JSON.stringify({
            model: 'mixtral-8x7b-32768', // More conversational than Llama
            messages: [
              {
                role: 'system',
                content: systemPrompt
              },
              ...(history || []).slice(-10), // Keep more history for context
              {
                role: 'user',
                content: validatedMessage
              }
            ],
            temperature: 0.8, // More natural, creative responses
            max_tokens: 500, // Increased for better conversational quality
            top_p: 0.9, // More diverse responses
            stream: false
          }),
        });

        if (!response.ok) {
          throw new Error('Groq request failed');
        }

        const data = await response.json();
        return NextResponse.json({ 
          reply: data.choices[0]?.message?.content || 'I apologize, but I couldn\'t process that request.'
        });
      } catch (groqError) {
        console.error('Groq error:', groqError);
        // Fall through to OpenAI
      }
    }

    // OpenAI Integration (Fallback or Primary)
    if (OPENAI_API_KEY) {
      try {
        const systemPrompt = buildSystemPrompt(ragContext, topicHistory);

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini', // Fast and cost-effective
            messages: [
              {
                role: 'system',
                content: systemPrompt
              },
              ...(history || []).slice(-10), // Increased history for better context
              {
                role: 'user',
                content: validatedMessage
              }
            ],
            temperature: 0.8, // More natural conversation
            max_tokens: 500, // Increased for better responses
            stream: false
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

