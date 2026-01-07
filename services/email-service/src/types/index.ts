/**
 * TypeScript Types for Email Service
 */

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Service Health Check
export interface HealthCheck {
  service: string;
  status: 'healthy' | 'unhealthy';
  timestamp: Date;
  version?: string;
  uptime?: number;
}
