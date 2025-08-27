export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator'
}

export interface UserProfile {
  id: string;
  userId: string;
  bio?: string;
  phone?: string;
  address?: Address;
  socialLinks?: SocialLinks;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface SocialLinks {
  website?: string;
  twitter?: string;
  linkedin?: string;
  facebook?: string;
}