/**
 * Audio Routes
 * Handles transcription and speech synthesis
 */

import { Router, Request, Response } from 'express';
import { TranscribeRequest, TranscribeResponse, SpeechRequest, ApiResponse } from '../../../shared/types';
import { transcribeAudio } from '../services/transcription';
import { synthesizeSpeech } from '../services/speech';
import { createLogger } from '../../../shared/utils/logger';
import { formatErrorResponse } from '../../../shared/utils/errors';

const router = Router();
const logger = createLogger('audio-service');

// POST /api/audio/transcribe
router.post('/transcribe', async (req: Request, res: Response) => {
  try {
    const file = (req as any).file;
    
    if (!file) {
      return res.status(400).json({
        success: false,
        error: 'Audio file is required'
      } as ApiResponse);
    }

    logger.info('Transcribing audio', { 
      size: file.size,
      mimetype: file.mimetype
    });

    const text = await transcribeAudio(file.buffer, file.mimetype);

    const response: TranscribeResponse = {
      text,
      language: 'en',
      confidence: 0.9
    };

    res.json({
      success: true,
      data: response
    } as ApiResponse<TranscribeResponse>);

  } catch (error) {
    logger.error('Error transcribing audio', error);
    const errorResponse = formatErrorResponse(error);
    res.status(500).json(errorResponse);
  }
});

// POST /api/audio/speech
router.post('/speech', async (req: Request, res: Response) => {
  try {
    const { text, voice, speed }: SpeechRequest = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'text is required and must be a string'
      } as ApiResponse);
    }

    logger.info('Synthesizing speech', { 
      textLength: text.length,
      voice: voice || 'alloy'
    });

    const audioBuffer = await synthesizeSpeech({
      text,
      voice: voice || 'alloy',
      speed: speed || 1.0
    });

    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(audioBuffer);

  } catch (error) {
    logger.error('Error synthesizing speech', error);
    const errorResponse = formatErrorResponse(error);
    res.status(500).json(errorResponse);
  }
});

export { router as audioRoutes };

