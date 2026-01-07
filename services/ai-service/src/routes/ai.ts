/**
 * AI Routes
 * Handles chat requests and AI processing
 */

import { Router, Request, Response } from 'express';
import { AIRequest, AIResponse, ApiResponse } from '../../../shared/types';
import { processMessage } from '../services/aiProcessor';
import { createLogger } from '../../../shared/utils/logger';
import { formatErrorResponse } from '../../../shared/utils/errors';

const router = Router();
const logger = createLogger('ai-service');

router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { userMessage, history, useLocalAI, ragContext }: AIRequest = req.body;

    if (!userMessage || typeof userMessage !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'userMessage is required and must be a string'
      } as ApiResponse);
    }

    logger.info('Processing AI request', { 
      messageLength: userMessage.length,
      hasHistory: !!history,
      hasRagContext: !!ragContext
    });

    const response = await processMessage({
      userMessage,
      history,
      useLocalAI,
      ragContext
    });

    const aiResponse: AIResponse = {
      reply: response,
      confidence: 0.8 // Can be calculated based on RAG confidence
    };

    res.json({
      success: true,
      data: aiResponse
    } as ApiResponse<AIResponse>);

  } catch (error) {
    logger.error('Error processing AI request', error);
    const errorResponse = formatErrorResponse(error);
    res.status(500).json(errorResponse);
  }
});

export { router as aiRoutes };

