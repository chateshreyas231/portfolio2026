/**
 * Audio Service
 * Handles speech-to-text and text-to-speech
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { audioRoutes } from './routes/audio';
import { healthRoutes } from './routes/health';
import { createLogger } from '../../../shared/utils/logger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;
const logger = createLogger('audio-service');

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB limit
});

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
app.use('/api/audio', upload.single('file'), audioRoutes);
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
  logger.info(`Audio Service running on port ${PORT}`);
});

export default app;

