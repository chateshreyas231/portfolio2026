/**
 * Shared TypeScript Types
 * Used across all microservices
 */

// Profile Types
export interface ProfileData {
  name: string;
  summary: string;
  background: string;
  education: any;
  experience: any[];
  major_projects: any[];
  skills: any;
  personality: string;
  likes_dislikes: any;
  goals: string[];
  achievements: string[];
  certifications: string[];
  resume_url: string;
  calendly_or_scheduler_url: string;
  scheduler: {
    google_meet_api: string;
    teams_api: string;
  };
  location: string;
  email: string;
  phone: string;
  social: any;
  contact?: any;
  createdAt?: Date;
  updatedAt?: Date;
}

// Message Types
export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

// Conversation Types
export interface Conversation {
  id?: string;
  sessionId: string;
  startedAt: Date;
  endedAt?: Date;
  durationMs?: number;
  messages: Message[];
  transcript: string;
  createdAt: Date;
  updatedAt: Date;
  userAgent?: string;
  metadata?: Record<string, any>;
}

export interface Transcript {
  id?: string;
  sessionId: string;
  conversationId: string;
  fullTranscript: string;
  messages: Message[];
  createdAt: Date;
}

// AI Service Types
export interface AIRequest {
  userMessage: string;
  history?: Message[];
  useLocalAI?: boolean;
  ragContext?: string;
}

export interface AIResponse {
  reply: string;
  confidence?: number;
  intent?: string;
}

// Audio Service Types
export interface TranscribeRequest {
  audio: Blob | Buffer;
  language?: string;
}

export interface TranscribeResponse {
  text: string;
  language?: string;
  confidence?: number;
}

export interface SpeechRequest {
  text: string;
  voice?: string;
  speed?: number;
}

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

