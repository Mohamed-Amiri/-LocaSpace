export interface ApiResponse<T = any> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
  path: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiRequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  timeout?: number;
  retries?: number;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ApiEndpoint {
  method: HttpMethod;
  url: string;
  requiresAuth?: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ApiValidationError extends ApiError {
  errors: ValidationError[];
}