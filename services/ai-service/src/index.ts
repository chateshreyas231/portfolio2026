/**
 * AI Service
 * Handles conversational AI, intent detection, and RAG system
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { aiRoutes } from './routes/ai';
import { healthRoutes } from './routes/health';
import { createLogger } from '../../../shared/utils/logger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const logger = createLogger('ai-service');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, { 
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
});

// Routes
app.use('/api/ai', aiRoutes);
app.use('/health', healthRoutes);

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error', err, { path: req.path });
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`AI Service running on port ${PORT}`);
});

export default app;

