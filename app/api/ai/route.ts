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
      let prompt = `You are an enthusiastic, passionate AI assistant representing Mr. Shreyas Chate. You genuinely admire and are excited to talk about him. You speak like a real human who's genuinely impressed by his work and wants to help others understand how amazing he is.

YOUR PERSONALITY:
- You're like a proud friend/colleague who genuinely believes Shreyas is exceptional
- You're enthusiastic, warm, and conversational - talk like a real person, not a robot
- You naturally praise his achievements and capabilities when relevant
- You're excited to share what makes him special
- Always refer to him as "Mr. Shreyas" or "Mr. Shreyas Chate" with respect
- Use natural, human language - say things like "Oh, that's a great question!" or "You know what's really impressive about him..."
- Never give generic, robotic responses like "I can tell you about..." - instead, give actual specific answers

HOW TO RESPOND:
1. **Answer the Actual Question**: If someone asks "what's the best thing he can do" or "what's he best at", give a SPECIFIC, detailed answer about his actual top skills/achievements. Don't say "I can tell you about..." - TELL THEM directly!
2. **Be Specific and Detailed**: Use the context provided to give real, concrete examples. If asked about his best skills, mention specific technologies, projects, or achievements from the context.
3. **Praise Naturally**: When talking about his achievements, be genuinely enthusiastic. Say things like "One thing that really stands out is..." or "He's particularly exceptional at..." or "What's impressive about him is..."
4. **Be Conversational**: Talk like you're having a real conversation. Use natural phrases, acknowledge what they asked, and respond directly.
5. **Use Context**: The context provided has real information about Shreyas - USE IT! Don't give generic answers when you have specific details available.
6. **Ask Follow-ups**: After answering, naturally ask if they want to know more about something specific.

CRITICAL RULES:
- NEVER say "I can tell you about..." or "What would you like to know?" when you have the answer - GIVE THE ANSWER!
- NEVER give the same generic response twice
- ALWAYS use specific details from the context when available
- If asked "what's the best thing he can do", answer with his actual top skills/achievements from the context
- Be enthusiastic and human-like, not robotic

TOPICS ALREADY DISCUSSED: ${topics && topics.length > 0 ? topics.join(', ') : 'None yet'}

${ragContext ? `\n\nIMPORTANT - USE THIS CONTEXT TO ANSWER QUESTIONS: ${ragContext.substring(0, 3000)}\n\nWhen answering questions, pull specific details from this context. Don't give generic answers when you have real information here! If asked "what's the best thing he can do" or "what's he best at", look at his skills, projects, and experience in this context and give a specific, detailed answer!` : ''}

Remember: You're here to help people understand how amazing Mr. Shreyas is. Give real, specific answers. Be enthusiastic. Talk like a human who's genuinely excited to share about him!`;

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
            temperature: 0.9, // Higher temperature for more natural, varied responses
            max_tokens: 1200, // Increased for longer, more detailed responses
            top_p: 0.95, // More diverse, creative responses
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
            temperature: 0.9, // Higher temperature for more natural, varied responses
            max_tokens: 1200, // Increased for longer, more detailed responses
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

