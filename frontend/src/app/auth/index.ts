// Services
export * from './auth.service';
export * from './auth-state.service';

// Guards
export * from './auth.guard';

// Interceptors
export * from './auth.interceptor';

// Error Handlers
export * from './auth-error.handler';

// Constants and Types
export * from './auth.constants';

// Routes
export * from './auth.routes';

// Components
export * from './login/login.component';
export * from './register/register.component';
export * from './forgot-password/forgot-password.component';
export * from './reset-password/reset-password.component';
export * from './verify-email/verify-email.component';

// Re-export commonly used types
export interface AuthModuleConfig {
  apiUrl: string;
  tokenPrefix?: string;
  loginRedirectUrl?: string;
  logoutRedirectUrl?: string;
  unauthorizedRedirectUrl?: string;
  sessionTimeout?: number;
  inactivityTimeout?: number;
}

// Export default configuration
export const DEFAULT_AUTH_CONFIG: AuthModuleConfig = {
  apiUrl: '/api',
  tokenPrefix: 'Bearer',
  loginRedirectUrl: '/',
  logoutRedirectUrl: '/login',
  unauthorizedRedirectUrl: '/login',
  sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
  inactivityTimeout: 30 * 60 * 1000 // 30 minutes
};