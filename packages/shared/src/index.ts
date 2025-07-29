// User types and DTOs
export * from './types/user.types';

// Issue types and DTOs
export * from './types/issue.types';

// Project types and DTOs
export * from './types/project.types';

// Common types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId: string;
    version: string;
  };
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// WebSocket event types
export enum WebSocketEvents {
  // Connection events
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  
  // Issue events
  ISSUE_CREATED = 'issue:created',
  ISSUE_UPDATED = 'issue:updated',
  ISSUE_DELETED = 'issue:deleted',
  ISSUE_ASSIGNED = 'issue:assigned',
  ISSUE_STATUS_CHANGED = 'issue:status_changed',
  
  // Comment events
  COMMENT_ADDED = 'comment:added',
  COMMENT_UPDATED = 'comment:updated',
  COMMENT_DELETED = 'comment:deleted',
  
  // Project events
  PROJECT_CREATED = 'project:created',
  PROJECT_UPDATED = 'project:updated',
  PROJECT_MEMBER_ADDED = 'project:member_added',
  PROJECT_MEMBER_REMOVED = 'project:member_removed',
  
  // Notification events
  NOTIFICATION_SENT = 'notification:sent',
  
  // User events
  USER_ONLINE = 'user:online',
  USER_OFFLINE = 'user:offline',
  USER_TYPING = 'user:typing'
}

export interface WebSocketMessage<T = any> {
  event: WebSocketEvents;
  data: T;
  timestamp: string;
  userId?: string;
  projectId?: string;
  issueId?: string;
}

// Notification types
export enum NotificationType {
  ISSUE_ASSIGNED = 'issue_assigned',
  ISSUE_UPDATED = 'issue_updated',
  ISSUE_COMMENTED = 'issue_commented',
  ISSUE_RESOLVED = 'issue_resolved',
  PROJECT_INVITED = 'project_invited',
  MENTION = 'mention',
  SYSTEM = 'system'
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  userId: string;
  isRead: boolean;
  data?: Record<string, any>;
  createdAt: Date;
}

// Audit log types
export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  metadata?: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
}

// File upload types
export interface FileUpload {
  id: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
}

// Search types
export interface SearchResult<T = any> {
  id: string;
  type: 'issue' | 'project' | 'user' | 'comment';
  title: string;
  description?: string;
  url: string;
  score: number;
  data: T;
  highlightedFields?: Record<string, string>;
}

export interface SearchQuery {
  query: string;
  filters?: Record<string, any>;
  types?: string[];
  limit?: number;
  offset?: number;
}

export interface SearchResponse<T = any> {
  results: SearchResult<T>[];
  total: number;
  took: number;
  suggestions?: string[];
}

// Health check types
export interface HealthCheckStatus {
  status: 'healthy' | 'unhealthy' | 'degraded';
  checks: {
    database: boolean;
    redis: boolean;
    elasticsearch: boolean;
    external_services: boolean;
  };
  uptime: number;
  version: string;
  timestamp: string;
}