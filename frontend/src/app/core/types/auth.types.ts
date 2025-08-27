export type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading' | 'error';

export type LoginProvider = 'email' | 'google' | 'facebook' | 'github';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface AuthSession {
  user: AuthUser;
  tokens: AuthTokens;
  loginProvider: LoginProvider;
  loginTime: Date;
  lastActivity: Date;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatar?: string;
  role: UserRole;
  permissions: string[];
  isEmailVerified: boolean;
  isActive: boolean;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
  GUEST = 'guest'
}

export interface AuthConfig {
  tokenKey: string;
  refreshTokenKey: string;
  userKey: string;
  loginUrl: string;
  logoutUrl: string;
  registerUrl: string;
  forgotPasswordUrl: string;
  resetPasswordUrl: string;
  refreshTokenUrl: string;
  verifyEmailUrl: string;
}

export interface SocialAuthConfig {
  google?: {
    clientId: string;
    scope?: string[];
  };
  facebook?: {
    appId: string;
    scope?: string[];
  };
  github?: {
    clientId: string;
    scope?: string[];
  };
}

export interface AuthError {
  code: string;
  message: string;
  details?: any;
}

export type AuthAction = 
  | 'login'
  | 'logout' 
  | 'register'
  | 'forgot-password'
  | 'reset-password'
  | 'verify-email'
  | 'refresh-token'
  | 'change-password';