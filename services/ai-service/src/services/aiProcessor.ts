/**
 * AI Processor Service
 * Handles AI logic, intent detection, and RAG
 */

import OpenAI from 'openai';
import { AIRequest } from '../../../shared/types';
import { createLogger } from '../../../shared/utils/logger';

const logger = createLogger('ai-processor');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const USE_OLLAMA = process.env.USE_OLLAMA === 'true';
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';

let openai: OpenAI | null = null;

if (OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: OPENAI_API_KEY
  });
}

export async function processMessage(request: AIRequest): Promise<string> {
  const { userMessage, history = [], useLocalAI, ragContext } = request;

  // Use Ollama if configured
  if (useLocalAI || USE_OLLAMA) {
    try {
      return await callOllama(userMessage, history, ragContext);
    } catch (error) {
      logger.warn('Ollama request failed, falling back to OpenAI', { error });
      // Fall through to OpenAI
    }
  }

  // Use OpenAI
  if (openai) {
    return await callOpenAI(userMessage, history, ragContext);
  }

  throw new Error('No AI backend configured. Please set OPENAI_API_KEY or USE_OLLAMA=true');
}

async function callOllama(
  userMessage: string,
  history: any[],
  ragContext?: string
): Promise<string> {
  const systemPrompt = buildSystemPrompt(ragContext);

  const response = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama2',
      messages: [
        { role: 'system', content: systemPrompt },
        ...history.slice(-6),
        { role: 'user', content: userMessage }
      ],
      stream: false,
      temperature: 0.7,
      max_tokens: 250,
    }),
  });

  if (!response.ok) {
    throw new Error('Ollama request failed');
  }

  const data = await response.json();
  return data.message?.content || data.response || 'I apologize, but I couldn\'t process that request.';
}

async function callOpenAI(
  userMessage: string,
  history: any[],
  ragContext?: string
): Promise<string> {
  if (!openai) {
    throw new Error('OpenAI client not initialized');
  }

  const systemPrompt = buildSystemPrompt(ragContext);

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      ...history.slice(-6),
      { role: 'user', content: userMessage }
    ],
    temperature: 0.7,
    max_tokens: 250,
  });

  return response.choices[0]?.message?.content || 'I apologize, but I couldn\'t process that request.';
}

function buildSystemPrompt(ragContext?: string): string {
  let prompt = `You are Mr. Shreyas Chate's AI assistant. Be brief (2-3 sentences) unless asked for details. Always refer to him as "Mr. Shreyas" or "Mr. Shreyas Chate". Answer only what's asked.`;
  
  if (ragContext) {
    prompt += `\n\nContext: ${ragContext.substring(0, 500)}`;
  }
  
  return prompt;
}

