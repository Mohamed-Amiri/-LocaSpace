/**
 * Environment Configuration Interface
 * 
 * This interface defines the structure of our environment configuration
 * and ensures type safety across different environment files.
 */

export interface EnvironmentConfig {
  production: boolean;
  apiUrl: string;
  apiTimeout?: number;
  apiRetryAttempts?: number;

  // Map Services
  mapboxToken: string;
  googleMapsApiKey: string;
  defaultMapCenter?: {
    lat: number;
    lng: number;
  };
  defaultMapZoom?: number;

  // Authentication
  auth: {
    tokenPrefix: string;
    loginRedirectUrl: string;
    logoutRedirectUrl: string;
    unauthorizedRedirectUrl: string;
    sessionTimeout: number;
    inactivityTimeout: number;
    passwordPolicy?: {
      minLength: number;
      requireUppercase: boolean;
      requireLowercase: boolean;
      requireNumbers: boolean;
      requireSpecialChars: boolean;
    };
  };

  // Social Authentication
  socialAuth: {
    google: {
      clientId: string;
      scopes?: string[];
    };
    facebook: {
      appId: string;
      scopes?: string[];
    };
  };

  // Error Tracking
  sentry: {
    dsn: string;
    environment: string;
    tracesSampleRate: number;
    debug?: boolean;
  };

  // Feature Flags
  features: {
    darkMode: boolean;
    socialLogin: boolean;
    mapIntegration: boolean;
    notifications: boolean;
    chat: boolean;
    analytics?: boolean;
    errorReporting?: boolean;
  };

  // Development Tools
  devTools?: {
    enableDebugger: boolean;
    enableLogger: boolean;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
    showDevTools: boolean;
  };

  // Cache Configuration
  cache?: {
    enabled: boolean;
    duration: number;
    maxSize: number;
  };

  // API Mocking
  mock?: {
    enabled: boolean;
    delay: number;
    errorRate: number;
  };
}

// Type guard to check if an environment object matches our interface
export function isValidEnvironment(env: any): env is EnvironmentConfig {
  return (
    typeof env === 'object' &&
    env !== null &&
    typeof env.production === 'boolean' &&
    typeof env.apiUrl === 'string' &&
    typeof env.mapboxToken === 'string' &&
    typeof env.googleMapsApiKey === 'string' &&
    typeof env.auth === 'object' &&
    typeof env.socialAuth === 'object' &&
    typeof env.sentry === 'object' &&
    typeof env.features === 'object'
  );
}

// Helper function to validate required environment variables
export function validateEnvironment(env: EnvironmentConfig): void {
  if (!env.apiUrl) {
    throw new Error('API URL is required in environment configuration');
  }

  if (env.production) {
    if (!env.mapboxToken || env.mapboxToken.includes('YOUR_')) {
      throw new Error('Valid Mapbox token is required in production environment');
    }

    if (!env.googleMapsApiKey || env.googleMapsApiKey.includes('YOUR_')) {
      throw new Error('Valid Google Maps API key is required in production environment');
    }

    if (!env.sentry.dsn) {
      throw new Error('Sentry DSN is required in production environment');
    }

    if (!env.socialAuth.google.clientId || env.socialAuth.google.clientId.includes('YOUR_')) {
      throw new Error('Valid Google client ID is required in production environment');
    }

    if (!env.socialAuth.facebook.appId || env.socialAuth.facebook.appId.includes('YOUR_')) {
      throw new Error('Valid Facebook app ID is required in production environment');
    }
  }
}