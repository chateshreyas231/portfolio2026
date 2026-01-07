/**
 * Email Routes
 * Handles contact form submissions
 */

import { Router, Request, Response } from 'express';
import { ApiResponse } from '../types';
import { sendContactEmail, sendConfirmationEmail } from '../services/emailService';
import { createLogger } from '../utils/logger';
import { formatErrorResponse } from '../utils/errors';

const router = Router();
const logger = createLogger('email-service');

interface ContactFormRequest {
  name: string;
  email: string;
  message: string;
  userIp?: string;
  userAgent?: string;
}

router.post('/contact', async (req: Request, res: Response) => {
  try {
    const { name, email, message, userIp, userAgent }: ContactFormRequest = req.body;

    // Validate inputs
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Name is required and must be at least 2 characters'
      } as ApiResponse);
    }

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Valid email is required'
      } as ApiResponse);
    }

    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Message is required and must be at least 10 characters'
      } as ApiResponse);
    }

    logger.info('Processing contact form submission', { 
      name: name.substring(0, 20),
      email: email.substring(0, 20),
      messageLength: message.length
    });

    // Get IP and user agent from request if not provided
    const ip = userIp || req.ip || req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
    const agent = userAgent || req.headers['user-agent'] || 'unknown';

    // Send notification email to you
    const notificationResult = await sendContactEmail({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      userIp: String(ip),
      userAgent: String(agent).substring(0, 200)
    });

    if (!notificationResult.success) {
      logger.error('Failed to send notification email', { error: notificationResult.error });
      return res.status(500).json({
        success: false,
        error: 'Failed to send email. Please try again later.'
      } as ApiResponse);
    }

    // Send confirmation email to visitor (non-blocking)
    sendConfirmationEmail({
      name: name.trim(),
      email: email.trim()
    }).catch((error) => {
      logger.warn('Failed to send confirmation email', { error });
      // Don't fail the request if confirmation fails
    });

    res.json({
      success: true,
      message: 'Your message has been sent successfully! I\'ll get back to you soon.'
    } as ApiResponse);

  } catch (error) {
    logger.error('Error processing contact form', error);
    const errorResponse = formatErrorResponse(error);
    res.status(500).json(errorResponse);
  }
});

export { router as emailRoutes };

