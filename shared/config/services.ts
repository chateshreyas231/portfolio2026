/**
 * Service Configuration
 * Service discovery and endpoint configuration
 */

export interface ServiceConfig {
  name: string;
  url: string;
  port: number;
  healthCheck?: string;
}

export const SERVICES: Record<string, ServiceConfig> = {
  FRONTEND: {
    name: 'frontend',
    url: process.env.FRONTEND_URL || 'http://localhost:3000',
    port: 3000,
    healthCheck: '/api/health'
  },
  AI_SERVICE: {
    name: 'ai-service',
    url: process.env.AI_SERVICE_URL || 'http://localhost:3001',
    port: 3001,
    healthCheck: '/health'
  },
  AUDIO_SERVICE: {
    name: 'audio-service',
    url: process.env.AUDIO_SERVICE_URL || 'http://localhost:3002',
    port: 3002,
    healthCheck: '/health'
  },
  PROFILE_SERVICE: {
    name: 'profile-service',
    url: process.env.PROFILE_SERVICE_URL || 'http://localhost:3003',
    port: 3003,
    healthCheck: '/health'
  },
  ANALYTICS_SERVICE: {
    name: 'analytics-service',
    url: process.env.ANALYTICS_SERVICE_URL || 'http://localhost:3004',
    port: 3004,
    healthCheck: '/health'
  },
  EMAIL_SERVICE: {
    name: 'email-service',
    url: process.env.EMAIL_SERVICE_URL || 'http://localhost:3005',
    port: 3005,
    healthCheck: '/health'
  }
};

export function getServiceUrl(serviceName: keyof typeof SERVICES): string {
  return SERVICES[serviceName].url;
}

export function getServicePort(serviceName: keyof typeof SERVICES): number {
  return SERVICES[serviceName].port;
}

