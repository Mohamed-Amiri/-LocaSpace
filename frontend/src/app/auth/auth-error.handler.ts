import { ErrorHandler, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../shared/components/toast/toast.service';
import { AuthService } from './auth.service';
import { AUTH_CONFIG } from './auth.constants';

interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

@Injectable()
export class AuthErrorHandler implements ErrorHandler {
  constructor(
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  handleError(error: Error | HttpErrorResponse): void {
    if (error instanceof HttpErrorResponse) {
      this.handleHttpError(error);
    } else {
      this.handleGenericError(error);
    }
  }

  private handleHttpError(error: HttpErrorResponse): void {
    if (this.isAuthenticationError(error)) {
      this.handleAuthenticationError(error);
    } else if (this.isAuthorizationError(error)) {
      this.handleAuthorizationError(error);
    } else if (this.isValidationError(error)) {
      this.handleValidationError(error);
    } else {
      this.handleApiError(error);
    }
  }

  private isAuthenticationError(error: HttpErrorResponse): boolean {
    return error.status === 401;
  }

  private isAuthorizationError(error: HttpErrorResponse): boolean {
    return error.status === 403;
  }

  private isValidationError(error: HttpErrorResponse): boolean {
    return error.status === 400 && error.error?.code === 'VALIDATION_ERROR';
  }

  private handleAuthenticationError(error: HttpErrorResponse): void {
    const apiError = this.parseApiError(error);

    switch (apiError.code) {
      case 'INVALID_CREDENTIALS':
        this.toastService.error(AUTH_CONFIG.ERROR_MESSAGES.LOGIN.INVALID_CREDENTIALS);
        break;
      case 'ACCOUNT_LOCKED':
        this.toastService.error(AUTH_CONFIG.ERROR_MESSAGES.LOGIN.ACCOUNT_LOCKED);
        break;
      case 'UNVERIFIED_EMAIL':
        this.toastService.error(AUTH_CONFIG.ERROR_MESSAGES.LOGIN.UNVERIFIED_EMAIL);
        break;
      case 'ACCOUNT_DISABLED':
        this.toastService.error(AUTH_CONFIG.ERROR_MESSAGES.LOGIN.ACCOUNT_DISABLED);
        break;
      case 'TOKEN_EXPIRED':
      case 'INVALID_TOKEN':
        this.handleSessionExpired();
        break;
      default:
        this.toastService.error(AUTH_CONFIG.ERROR_MESSAGES.SESSION.INVALID_TOKEN);
        break;
    }
  }

  private handleAuthorizationError(error: HttpErrorResponse): void {
    const apiError = this.parseApiError(error);

    switch (apiError.code) {
      case 'INSUFFICIENT_PERMISSIONS':
        this.toastService.error('Vous n\'avez pas les permissions nécessaires pour effectuer cette action');
        break;
      case 'ROLE_REQUIRED':
        this.toastService.error('Cette action nécessite un rôle spécifique');
        break;
      default:
        this.toastService.error('Accès refusé');
        break;
    }
  }

  private handleValidationError(error: HttpErrorResponse): void {
    const apiError = this.parseApiError(error);
    const details = apiError.details || {};

    // Handle specific validation errors
    if (details['email']) {
      this.toastService.error(`Email invalide : ${details['email']}`);
    } else if (details['password']) {
      this.toastService.error(`Mot de passe invalide : ${details['password']}`);
    } else {
      this.toastService.error(apiError.message || 'Données invalides');
    }
  }

  private handleApiError(error: HttpErrorResponse): void {
    const apiError = this.parseApiError(error);

    switch (error.status) {
      case 404:
        this.toastService.error('Ressource non trouvée');
        break;
      case 408:
        this.toastService.error('La requête a expiré');
        break;
      case 429:
        this.toastService.error('Trop de requêtes, veuillez réessayer plus tard');
        break;
      case 500:
        this.toastService.error('Une erreur serveur est survenue');
        break;
      case 503:
        this.toastService.error('Service temporairement indisponible');
        break;
      default:
        this.toastService.error(apiError.message || 'Une erreur est survenue');
        break;
    }
  }

  private handleGenericError(error: Error): void {
    console.error('Application error:', error);
    this.toastService.error('Une erreur inattendue est survenue');
  }

  private handleSessionExpired(): void {
    this.toastService.error(AUTH_CONFIG.ERROR_MESSAGES.SESSION.EXPIRED);
    this.authService.logout();
  }

  private parseApiError(error: HttpErrorResponse): ApiError {
    try {
      if (error.error && typeof error.error === 'object') {
        return {
          code: error.error.code || 'UNKNOWN_ERROR',
          message: error.error.message || error.message,
          details: error.error.details
        };
      }
    } catch (e) {
      console.error('Error parsing API error:', e);
    }

    return {
      code: 'UNKNOWN_ERROR',
      message: error.message || 'Une erreur est survenue'
    };
  }
}