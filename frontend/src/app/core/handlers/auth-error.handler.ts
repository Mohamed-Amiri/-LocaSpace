import { ErrorHandler, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../shared/components/toast/toast.service';
import { ErrorUtils } from '../utils/error.utils';

@Injectable()
export class AuthErrorHandler implements ErrorHandler {
  constructor(private toastService: ToastService) {}

  handleError(error: any): void {
    console.error('Global error handler:', error);

    // Handle different types of errors
    if (error instanceof HttpErrorResponse) {
      this.handleHttpError(error);
    } else if (error?.rejection instanceof HttpErrorResponse) {
      // Handle unhandled promise rejections with HTTP errors
      this.handleHttpError(error.rejection);
    } else {
      this.handleGenericError(error);
    }
  }

  private handleHttpError(error: HttpErrorResponse): void {
    const errorMessage = ErrorUtils.getHttpErrorMessage(error);

    switch (error.status) {
      case 401:
        this.handleUnauthorizedError(error);
        break;
      case 403:
        this.handleForbiddenError(error);
        break;
      case 422:
        this.handleValidationError(error);
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        this.handleServerError(error);
        break;
      default:
        this.toastService.error(errorMessage);
        break;
    }

    // Log error details for debugging
    ErrorUtils.logError(error, 'AuthErrorHandler');
  }

  private handleUnauthorizedError(error: HttpErrorResponse): void {
    // Don't show toast for 401 errors as they're handled by the interceptor
    console.warn('Unauthorized access detected');
  }

  private handleForbiddenError(error: HttpErrorResponse): void {
    this.toastService.error('Accès refusé. Vous n\'avez pas les permissions nécessaires.');
  }

  private handleValidationError(error: HttpErrorResponse): void {
    const message = ErrorUtils.getValidationErrorMessage(error.error);
    this.toastService.error(message);
  }

  private handleServerError(error: HttpErrorResponse): void {
    this.toastService.error('Le serveur rencontre des difficultés. Veuillez réessayer plus tard.');
  }

  private handleGenericError(error: any): void {
    const errorMessage = ErrorUtils.getErrorMessage(error);
    
    // Don't show toast for certain types of errors
    if (this.shouldIgnoreError(error)) {
      return;
    }

    this.toastService.error(errorMessage);
    ErrorUtils.logError(error, 'AuthErrorHandler');
  }

  private shouldIgnoreError(error: any): boolean {
    // Ignore certain types of errors that shouldn't be shown to users
    const ignoredErrors = [
      'ChunkLoadError',
      'Loading chunk',
      'Script error',
      'Non-Error promise rejection captured'
    ];

    const errorMessage = error?.message || error?.toString() || '';
    return ignoredErrors.some(ignored => errorMessage.includes(ignored));
  }
}

/**
 * Specific error handler for authentication-related errors
 */
@Injectable()
export class AuthenticationErrorHandler {
  constructor(private toastService: ToastService) {}

  handleLoginError(error: any): void {
    const errorMessage = this.getLoginErrorMessage(error);
    this.toastService.error(errorMessage);
    ErrorUtils.logError(error, 'Login');
  }

  handleRegistrationError(error: any): void {
    const errorMessage = this.getRegistrationErrorMessage(error);
    this.toastService.error(errorMessage);
    ErrorUtils.logError(error, 'Registration');
  }

  handlePasswordResetError(error: any): void {
    const errorMessage = this.getPasswordResetErrorMessage(error);
    this.toastService.error(errorMessage);
    ErrorUtils.logError(error, 'Password Reset');
  }

  private getLoginErrorMessage(error: any): string {
    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 401:
          return 'Email ou mot de passe incorrect';
        case 423:
          return 'Compte temporairement verrouillé. Réessayez plus tard.';
        case 429:
          return 'Trop de tentatives de connexion. Veuillez patienter.';
        default:
          return ErrorUtils.getHttpErrorMessage(error);
      }
    }
    return 'Erreur lors de la connexion';
  }

  private getRegistrationErrorMessage(error: any): string {
    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 409:
          return 'Cette adresse email est déjà utilisée';
        case 422:
          return ErrorUtils.getValidationErrorMessage(error.error);
        default:
          return ErrorUtils.getHttpErrorMessage(error);
      }
    }
    return 'Erreur lors de l\'inscription';
  }

  private getPasswordResetErrorMessage(error: any): string {
    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 404:
          return 'Adresse email non trouvée';
        case 429:
          return 'Trop de demandes de réinitialisation. Veuillez patienter.';
        default:
          return ErrorUtils.getHttpErrorMessage(error);
      }
    }
    return 'Erreur lors de la réinitialisation du mot de passe';
  }
}