/**
 * Base API Response interface
 * All API responses should extend this interface
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ApiMeta;
}

/**
 * API Error interface
 * Standardized error format for all API errors
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp?: string;
  path?: string;
  status?: number;
}

/**
 * API Metadata interface
 * Contains pagination and other metadata information
 */
export interface ApiMeta {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  timestamp?: string;
  version?: string;
}

/**
 * Paginated Response interface
 * Used for endpoints that return paginated data
 */
export interface PaginatedResponse<T> extends ApiResponse {
  data: T[];
  meta: Required<ApiMeta>;
}

/**
 * API List Response
 * Used for endpoints that return arrays of data
 */
export interface ApiListResponse<T> extends ApiResponse {
  data: T[];
}

/**
 * API Single Response
 * Used for endpoints that return a single item
 */
export interface ApiSingleResponse<T> extends ApiResponse {
  data: T;
}

/**
 * API Empty Response
 * Used for endpoints that don't return data (e.g., DELETE operations)
 */
export interface ApiEmptyResponse extends ApiResponse {
  data?: never;
}

/**
 * API Validation Error
 * Specific error format for validation errors
 */
export interface ApiValidationError extends ApiError {
  code: 'VALIDATION_ERROR';
  details: {
    [field: string]: {
      message: string;
      value?: any;
      constraints?: string[];
    };
  };
}

/**
 * API Authentication Error
 * Specific error format for authentication errors
 */
export interface ApiAuthenticationError extends ApiError {
  code: 'AUTHENTICATION_ERROR' | 'INVALID_TOKEN' | 'TOKEN_EXPIRED';
}

/**
 * API Authorization Error
 * Specific error format for authorization errors
 */
export interface ApiAuthorizationError extends ApiError {
  code: 'AUTHORIZATION_ERROR' | 'INSUFFICIENT_PERMISSIONS' | 'ROLE_REQUIRED';
  details?: {
    requiredRoles?: string[];
    userRoles?: string[];
    resource?: string;
  };
}

/**
 * API Rate Limit Error
 * Specific error format for rate limiting errors
 */
export interface ApiRateLimitError extends ApiError {
  code: 'RATE_LIMIT_EXCEEDED';
  details: {
    limit: number;
    remaining: number;
    reset: number; // Unix timestamp
  };
}

/**
 * Type guard to check if an error is a validation error
 */
export function isValidationError(error: ApiError): error is ApiValidationError {
  return error.code === 'VALIDATION_ERROR' && 'details' in error;
}

/**
 * Type guard to check if an error is an authentication error
 */
export function isAuthenticationError(error: ApiError): error is ApiAuthenticationError {
  return ['AUTHENTICATION_ERROR', 'INVALID_TOKEN', 'TOKEN_EXPIRED'].includes(error.code);
}

/**
 * Type guard to check if an error is an authorization error
 */
export function isAuthorizationError(error: ApiError): error is ApiAuthorizationError {
  return ['AUTHORIZATION_ERROR', 'INSUFFICIENT_PERMISSIONS', 'ROLE_REQUIRED'].includes(error.code);
}

/**
 * Type guard to check if an error is a rate limit error
 */
export function isRateLimitError(error: ApiError): error is ApiRateLimitError {
  return error.code === 'RATE_LIMIT_EXCEEDED';
}