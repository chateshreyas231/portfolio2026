import { Router } from 'express';
import { HealthCheck } from '../../../shared/types';

const router = Router();

router.get('/', (req, res) => {
  const health: HealthCheck = {
    service: 'audio-service',
    status: 'healthy',
    timestamp: new Date(),
    version: process.env.npm_package_version || '1.0.0',
    uptime: process.uptime()
  };

  res.json(health);
});

export { router as healthRoutes };

