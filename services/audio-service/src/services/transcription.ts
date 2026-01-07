/**
 * Transcription Service
 * Converts audio to text using OpenAI Whisper API
 */

import OpenAI from 'openai';
import { createLogger } from '../../../shared/utils/logger';

const logger = createLogger('transcription-service');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  logger.warn('OPENAI_API_KEY not set. Transcription will not work.');
}

const openai = OPENAI_API_KEY ? new OpenAI({ apiKey: OPENAI_API_KEY }) : null;

export async function transcribeAudio(
  audioBuffer: Buffer,
  mimeType: string
): Promise<string> {
  if (!openai) {
    throw new Error('OpenAI API key not configured');
  }

  // Convert buffer to File-like object
  const file = new File([audioBuffer], 'audio.webm', { type: mimeType });

  try {
    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
      language: 'en',
      response_format: 'text'
    });

    return transcription as unknown as string;
  } catch (error) {
    logger.error('OpenAI transcription error', error);
    throw new Error('Failed to transcribe audio');
  }
}

