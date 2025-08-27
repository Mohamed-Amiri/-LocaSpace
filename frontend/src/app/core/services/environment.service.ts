import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { EnvironmentConfig, validateEnvironment } from '../../../environments/environment.interface';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  private config: EnvironmentConfig;

  constructor() {
    // Validate environment configuration on service initialization
    validateEnvironment(environment);
    this.config = environment;
  }

  /**
   * Get the current environment configuration
   */
  get(): EnvironmentConfig {
    return this.config;
  }

  /**
   * Check if the application is running in production mode
   */
  isProduction(): boolean {
    return this.config.production;
  }

  /**
   * Get the API base URL
   */
  getApiUrl(): string {
    return this.config.apiUrl;
  }

  /**
   * Get authentication configuration
   */
  getAuthConfig() {
    return this.config.auth;
  }

  /**
   * Get social authentication configuration
   */
  getSocialAuthConfig() {
    return this.config.socialAuth;
  }

  /**
   * Get Mapbox token
   */
  getMapboxToken(): string {
    return this.config.mapboxToken;
  }

  /**
   * Get Google Maps API key
   */
  getGoogleMapsApiKey(): string {
    return this.config.googleMapsApiKey;
  }

  /**
   * Get map default configuration
   */
  getMapDefaults() {
    return {
      center: this.config.defaultMapCenter || { lat: 48.8566, lng: 2.3522 }, // Paris by default
      zoom: this.config.defaultMapZoom || 12
    };
  }

  /**
   * Get Sentry configuration
   */
  getSentryConfig() {
    return this.config.sentry;
  }

  /**
   * Check if a feature is enabled
   */
  isFeatureEnabled(featureName: keyof EnvironmentConfig['features']): boolean {
    return this.config.features[featureName] || false;
  }

  /**
   * Get development tools configuration
   */
  getDevTools() {
    return this.config.devTools;
  }

  /**
   * Get cache configuration
   */
  getCacheConfig() {
    return this.config.cache;
  }

  /**
   * Get mock configuration
   */
  getMockConfig() {
    return this.config.mock;
  }

  /**
   * Get API timeout configuration
   */
  getApiTimeout(): number {
    return this.config.apiTimeout || 30000; // Default 30 seconds
  }

  /**
   * Get API retry attempts configuration
   */
  getApiRetryAttempts(): number {
    return this.config.apiRetryAttempts || 3; // Default 3 attempts
  }

  /**
   * Check if development tools should be enabled
   */
  shouldEnableDevTools(): boolean {
    return !this.isProduction() && this.config.devTools?.showDevTools || false;
  }

  /**
   * Check if API mocking is enabled
   */
  isMockingEnabled(): boolean {
    return !this.isProduction() && this.config.mock?.enabled || false;
  }

  /**
   * Get the current environment name
   */
  getEnvironmentName(): string {
    return this.config.sentry.environment;
  }
}