import { HttpErrorResponse } from '@angular/common/http';
import { ApiError, ApiValidationError } from '../types/api.types';

export class ErrorUtils {
  /**
   * Extract error message from various error types
   */
  static getErrorMessage(error: any): string {
    if (typeof error === 'string') {
      return error;
    }

    if (error instanceof HttpErrorResponse) {
      return ErrorUtils.getHttpErrorMessage(error);
    }

    if (error?.error?.message) {
      return error.error.message;
    }

    if (error?.message) {
      return error.message;
    }

    return 'Une erreur inattendue s\'est produite';
  }

  /**
   * Get error message from HTTP error response
   */
  static getHttpErrorMessage(error: HttpErrorResponse): string {
    switch (error.status) {
      case 0:
        return 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.';
      case 400:
        return error.error?.message || 'Requête invalide';
      case 401:
        return 'Session expirée. Veuillez vous reconnecter.';
      case 403:
        return 'Accès refusé. Vous n\'avez pas les permissions nécessaires.';
      case 404:
        return 'Ressource non trouvée';
      case 409:
        return error.error?.message || 'Conflit de données';
      case 422:
        return ErrorUtils.getValidationErrorMessage(error.error);
      case 429:
        return 'Trop de requêtes. Veuillez patienter avant de réessayer.';
      case 500:
        return 'Erreur interne du serveur';
      case 502:
        return 'Serveur temporairement indisponible';
      case 503:
        return 'Service temporairement indisponible';
      case 504:
        return 'Délai d\'attente dépassé';
      default:
        return error.error?.message || `Erreur ${error.status}: ${error.statusText}`;
    }
  }

  /**
   * Get validation error message
   */
  static getValidationErrorMessage(error: ApiValidationError): string {
    if (error.errors && error.errors.length > 0) {
      return error.errors.map(e => e.message).join(', ');
    }
    return error.message || 'Erreur de validation';
  }

  /**
   * Check if error is a network error
   */
  static isNetworkError(error: any): boolean {
    return error instanceof HttpErrorResponse && error.status === 0;
  }

  /**
   * Check if error is an authentication error
   */
  static isAuthError(error: any): boolean {
    return error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403);
  }

  /**
   * Check if error is a validation error
   */
  static isValidationError(error: any): boolean {
    return error instanceof HttpErrorResponse && error.status === 422;
  }

  /**
   * Check if error is a server error
   */
  static isServerError(error: any): boolean {
    return error instanceof HttpErrorResponse && error.status >= 500;
  }

  /**
   * Log error with context
   */
  static logError(error: any, context?: string): void {
    const errorMessage = ErrorUtils.getErrorMessage(error);
    const logContext = context ? `[${context}]` : '';
    
    console.error(`${logContext} Error:`, errorMessage);
    
    if (error instanceof HttpErrorResponse) {
      console.error('HTTP Error Details:', {
        status: error.status,
        statusText: error.statusText,
        url: error.url,
        error: error.error
      });
    } else {
      console.error('Error Details:', error);
    }
  }

  /**
   * Create user-friendly error object
   */
  static createUserError(error: any, context?: string): UserError {
    return {
      message: ErrorUtils.getErrorMessage(error),
      context: context || 'Unknown',
      timestamp: new Date(),
      isNetworkError: ErrorUtils.isNetworkError(error),
      isAuthError: ErrorUtils.isAuthError(error),
      isValidationError: ErrorUtils.isValidationError(error),
      isServerError: ErrorUtils.isServerError(error),
      originalError: error
    };
  }

  /**
   * Handle async errors with optional retry logic
   */
  static async handleAsyncError<T>(
    operation: () => Promise<T>,
    context: string,
    maxRetries: number = 0,
    retryDelay: number = 1000
  ): Promise<T> {
    let lastError: any;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (attempt < maxRetries && !ErrorUtils.isAuthError(error)) {
          console.warn(`${context} failed (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${retryDelay}ms...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          continue;
        }
        
        ErrorUtils.logError(error, context);
        throw ErrorUtils.createUserError(error, context);
      }
    }
    
    throw ErrorUtils.createUserError(lastError, context);
  }
}

export interface UserError {
  message: string;
  context: string;
  timestamp: Date;
  isNetworkError: boolean;
  isAuthError: boolean;
  isValidationError: boolean;
  isServerError: boolean;
  originalError: any;
}