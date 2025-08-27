import { environment } from '../../../environments/environment';

/**
 * API Base URL
 */
export const API_BASE_URL = environment.apiUrl;

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    CHANGE_PASSWORD: '/auth/change-password',
    PROFILE: '/auth/profile',
    SOCIAL: {
      GOOGLE: '/auth/google',
      FACEBOOK: '/auth/facebook'
    }
  },

  // User endpoints
  USER: {
    PROFILE: '/users/profile',
    SETTINGS: '/users/settings',
    NOTIFICATIONS: '/users/notifications',
    PREFERENCES: '/users/preferences'
  },

  // Place endpoints
  PLACE: {
    BASE: '/places',
    SEARCH: '/places/search',
    FEATURED: '/places/featured',
    CATEGORIES: '/places/categories',
    AMENITIES: '/places/amenities',
    REVIEWS: (placeId: string) => `/places/${placeId}/reviews`,
    AVAILABILITY: (placeId: string) => `/places/${placeId}/availability`,
    PHOTOS: (placeId: string) => `/places/${placeId}/photos`
  },

  // Booking endpoints
  BOOKING: {
    BASE: '/bookings',
    USER: '/bookings/user',
    OWNER: '/bookings/owner',
    HISTORY: '/bookings/history',
    UPCOMING: '/bookings/upcoming',
    CANCEL: (bookingId: string) => `/bookings/${bookingId}/cancel`,
    MODIFY: (bookingId: string) => `/bookings/${bookingId}/modify`,
    REVIEW: (bookingId: string) => `/bookings/${bookingId}/review`
  },

  // Message endpoints
  MESSAGE: {
    BASE: '/messages',
    CONVERSATIONS: '/messages/conversations',
    UNREAD: '/messages/unread',
    MARK_READ: '/messages/mark-read',
    CONVERSATION: (conversationId: string) => `/messages/conversations/${conversationId}`
  },

  // Payment endpoints
  PAYMENT: {
    BASE: '/payments',
    METHODS: '/payments/methods',
    HISTORY: '/payments/history',
    INTENT: '/payments/create-intent',
    CONFIRM: '/payments/confirm',
    REFUND: (paymentId: string) => `/payments/${paymentId}/refund`
  },

  // Review endpoints
  REVIEW: {
    BASE: '/reviews',
    USER: '/reviews/user',
    PENDING: '/reviews/pending',
    REPORT: (reviewId: string) => `/reviews/${reviewId}/report`
  },

  // Location endpoints
  LOCATION: {
    CITIES: '/locations/cities',
    REGIONS: '/locations/regions',
    COUNTRIES: '/locations/countries',
    GEOCODE: '/locations/geocode',
    REVERSE_GEOCODE: '/locations/reverse-geocode'
  }
};

/**
 * API Headers
 */
export const API_HEADERS = {
  CONTENT_TYPE: 'Content-Type',
  ACCEPT: 'Accept',
  AUTHORIZATION: 'Authorization',
  REFRESH_TOKEN: 'X-Refresh-Token',
  API_KEY: 'X-API-Key',
  CORRELATION_ID: 'X-Correlation-ID',
  CLIENT_VERSION: 'X-Client-Version',
  CLIENT_PLATFORM: 'X-Client-Platform'
};

/**
 * API Response Codes
 */
export const API_RESPONSE_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

/**
 * API Error Codes
 */
export const API_ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  RESOURCE_CONFLICT: 'RESOURCE_CONFLICT',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE'
};

/**
 * API Configuration
 */
export const API_CONFIG = {
  TIMEOUT: environment.apiTimeout || 30000,
  RETRY_ATTEMPTS: environment.apiRetryAttempts || 3,
  RETRY_DELAY: 1000,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE_SIZE: 20
};