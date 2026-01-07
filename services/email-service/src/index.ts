/**
 * Email Service
 * Handles contact form submissions and email sending
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { emailRoutes } from './routes/email';
import { healthRoutes } from './routes/health';
import { createLogger } from './utils/logger';

// Load environment variables from multiple locations
// First try local .env, then parent directory .env.local
dotenv.config(); // Loads .env in email-service directory

// Try to load from root .env.local
// Calculate project root: from services/email-service/src -> go up 3 levels
let projectRoot: string;
try {
  // Try using __dirname (available in CommonJS)
  if (typeof __dirname !== 'undefined') {
    projectRoot = path.resolve(__dirname, '../../../..');
  } else {
    // Fallback: use process.cwd() and check if we're in email-service
    const cwd = process.cwd();
    if (cwd.includes('email-service')) {
      projectRoot = path.resolve(cwd, '../..');
    } else {
      projectRoot = cwd;
    }
  }
} catch {
  projectRoot = process.cwd();
}

const rootEnvLocal = path.resolve(projectRoot, '.env.local');
const rootEnv = path.resolve(projectRoot, '.env');

// Try loading from root (override: false means don't overwrite if already set)
// dotenv.config doesn't throw if file doesn't exist, it just returns empty result
const result1 = dotenv.config({ path: rootEnvLocal, override: false });
const result2 = dotenv.config({ path: rootEnv, override: false });

const app = express();
const PORT = process.env.PORT || 3005;
const logger = createLogger('email-service');

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
app.use('/api/email', emailRoutes);
app.use('/health', healthRoutes);

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error', err, { path: req.path });
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

// Log environment variable status
if (process.env.RESEND_API_KEY) {
  logger.info('Resend API key configured');
} else {
  logger.warn('Resend API key not found. Email service will not work.');
  logger.warn(`Checked paths: ${rootEnvLocal}, ${rootEnv}`);
  logger.warn(`Current working directory: ${process.cwd()}`);
  logger.warn(`Project root: ${projectRoot}`);
  logger.warn(`Env load results: rootEnvLocal=${result1.parsed ? 'loaded' : 'not found'}, rootEnv=${result2.parsed ? 'loaded' : 'not found'}`);
}

// Start server with error handling for port conflicts
const server = app.listen(PORT, () => {
  logger.info(`Email Service running on port ${PORT}`);
}).on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    logger.error(`Port ${PORT} is already in use. Please stop the existing process or use a different port.`);
    logger.info('Try running: lsof -ti:3005 | xargs kill -9');
    process.exit(1);
  } else {
    logger.error('Failed to start server', err);
    process.exit(1);
  }
});

export default app;

