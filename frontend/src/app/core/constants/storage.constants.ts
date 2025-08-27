/**
 * Storage Keys
 * Constants for all storage keys used in the application
 */
export const STORAGE_KEYS = {
  // Authentication
  AUTH: {
    TOKEN: 'auth_token',
    REFRESH_TOKEN: 'refresh_token',
    USER: 'auth_user',
    ROLES: 'auth_roles',
    PERMISSIONS: 'auth_permissions',
    REMEMBER_ME: 'auth_remember_me',
    LAST_ACTIVE: 'auth_last_active',
    SESSION_EXPIRY: 'auth_session_expiry'
  },

  // User Preferences
  PREFERENCES: {
    THEME: 'user_theme',
    LANGUAGE: 'user_language',
    CURRENCY: 'user_currency',
    NOTIFICATIONS: 'user_notifications',
    SEARCH_HISTORY: 'user_search_history',
    RECENT_VIEWS: 'user_recent_views',
    MAP_SETTINGS: 'user_map_settings'
  },

  // Application State
  APP_STATE: {
    LAST_ROUTE: 'app_last_route',
    SCROLL_POSITION: 'app_scroll_position',
    FILTER_STATE: 'app_filter_state',
    SORT_STATE: 'app_sort_state',
    PAGE_SIZE: 'app_page_size'
  },

  // Form Data
  FORM: {
    DRAFT: 'form_draft',
    AUTOSAVE: 'form_autosave',
    VALIDATION_ERRORS: 'form_validation_errors'
  },

  // Cache
  CACHE: {
    USER_PROFILE: 'cache_user_profile',
    PLACES: 'cache_places',
    CATEGORIES: 'cache_categories',
    AMENITIES: 'cache_amenities',
    LOCATIONS: 'cache_locations'
  },

  // Feature Flags
  FEATURES: {
    ENABLED: 'features_enabled',
    DISABLED: 'features_disabled',
    USER_OVERRIDES: 'features_user_overrides'
  }
};

/**
 * Storage Prefixes
 * Prefixes for dynamically generated storage keys
 */
export const STORAGE_PREFIXES = {
  PLACE: 'place_',
  USER: 'user_',
  BOOKING: 'booking_',
  CONVERSATION: 'conversation_',
  NOTIFICATION: 'notification_'
};

/**
 * Storage Configuration
 */
export const STORAGE_CONFIG = {
  // Default expiration times
  EXPIRATION: {
    SHORT: 5 * 60 * 1000, // 5 minutes
    MEDIUM: 30 * 60 * 1000, // 30 minutes
    LONG: 24 * 60 * 60 * 1000, // 24 hours
    VERY_LONG: 7 * 24 * 60 * 60 * 1000 // 7 days
  },

  // Maximum sizes
  MAX_SIZE: {
    SEARCH_HISTORY: 20,
    RECENT_VIEWS: 50,
    FORM_DRAFT: 100 * 1024, // 100KB
    CACHE: 5 * 1024 * 1024 // 5MB
  },

  // Version for data structure changes
  VERSION: '1.0',

  // Encryption
  ENCRYPTION: {
    ENABLED: true,
    SENSITIVE_KEYS: [
      STORAGE_KEYS.AUTH.TOKEN,
      STORAGE_KEYS.AUTH.REFRESH_TOKEN,
      STORAGE_KEYS.AUTH.USER
    ]
  }
};

/**
 * Storage Events
 * Custom events dispatched for storage changes
 */
export const STORAGE_EVENTS = {
  AUTH_CHANGE: 'storage_auth_change',
  PREFERENCES_CHANGE: 'storage_preferences_change',
  CACHE_CHANGE: 'storage_cache_change',
  QUOTA_EXCEEDED: 'storage_quota_exceeded',
  VERSION_CHANGE: 'storage_version_change'
};