/**
 * Speech Synthesis Service
 * Converts text to speech using OpenAI TTS API
 */

import OpenAI from 'openai';
import { createLogger } from '../../../shared/utils/logger';

const logger = createLogger('speech-service');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  logger.warn('OPENAI_API_KEY not set. Speech synthesis will not work.');
}

const openai = OPENAI_API_KEY ? new OpenAI({ apiKey: OPENAI_API_KEY }) : null;

export interface SpeechOptions {
  text: string;
  voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
  speed?: number; // 0.25 to 4.0
}

export async function synthesizeSpeech(options: SpeechOptions): Promise<Buffer> {
  if (!openai) {
    throw new Error('OpenAI API key not configured');
  }

  const { text, voice = 'alloy', speed = 1.0 } = options;

  // Limit text length to 4096 characters (OpenAI limit)
  const truncatedText = text.substring(0, 4096);

  try {
    const response = await openai.audio.speech.create({
      model: 'tts-1',
      voice: voice,
      speed: Math.max(0.25, Math.min(4.0, speed)),
      input: truncatedText
    });

    // Convert response to buffer
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    logger.error('OpenAI speech synthesis error', error);
    throw new Error('Failed to synthesize speech');
  }
}

