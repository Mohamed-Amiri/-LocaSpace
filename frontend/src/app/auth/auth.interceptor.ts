import { inject } from '@angular/core';
import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, take, filter, finalize } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { ToastService } from '../shared/components/toast/toast.service';

// Token refresh state management
let isRefreshing = false;
const refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

export function authInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);
  const toastService = inject(ToastService);

  return authService.token$.pipe(
    take(1),
    switchMap(token => {
      // Add auth header if token exists and request is to the API
      if (token && isApiUrl(request.url)) {
        request = addAuthHeader(request, token);
      }

      return next(request).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 401 && !request.url.includes('/auth/login') && !request.url.includes('/auth/refresh')) {
              // Try to refresh token
              return handle401WithRefresh(request, next, authService, toastService);
            } else if (error.status === 403) {
              // Handle 403 Forbidden
              handle403Error(error, toastService);
            } else {
              // Handle other errors
              handleOtherErrors(error, toastService);
            }
          }
          return throwError(() => error);
        })
      );
    })
  );
}

function handle401WithRefresh(
  request: HttpRequest<unknown>, 
  next: HttpHandlerFn, 
  authService: AuthService, 
  toastService: ToastService
): Observable<HttpEvent<unknown>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap((newToken: string) => {
        isRefreshing = false;
        refreshTokenSubject.next(newToken);
        
        // Retry the original request with new token
        const newRequest = addAuthHeader(request, newToken);
        return next(newRequest);
      }),
      catchError((refreshError) => {
        isRefreshing = false;
        refreshTokenSubject.next(null);
        
        // Refresh failed, logout user
        toastService.error('Votre session a expiré. Veuillez vous reconnecter.');
        authService.logout();
        return throwError(() => refreshError);
      }),
      finalize(() => {
        isRefreshing = false;
      })
    );
  } else {
    // Wait for refresh to complete
    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((newToken) => {
        const newRequest = addAuthHeader(request, newToken);
        return next(newRequest);
      })
    );
  }
}

function isApiUrl(url: string): boolean {
  // Check if URL is an API endpoint
  return url.startsWith('/api') || url.includes('/api/');
}

function addAuthHeader(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
}

function handle401Error(error: HttpErrorResponse, authService: AuthService, toastService: ToastService): void {
  // Token is invalid or expired (fallback for non-refreshable scenarios)
  toastService.error('Votre session a expiré. Veuillez vous reconnecter.');
  authService.logout();
}

function handle403Error(error: HttpErrorResponse, toastService: ToastService): void {
  // User doesn't have permission
  toastService.error('Vous n\'avez pas les permissions nécessaires pour effectuer cette action.');
}

function handleOtherErrors(error: HttpErrorResponse, toastService: ToastService): void {
  let errorMessage = 'Une erreur est survenue';

  if (error.error instanceof ErrorEvent) {
    // Client-side error
    errorMessage = error.error.message;
  } else {
    // Server-side error
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.status === 404) {
      errorMessage = 'Ressource non trouvée';
    } else if (error.status === 400) {
      errorMessage = 'Requête invalide';
    } else if (error.status === 500) {
      errorMessage = 'Erreur serveur';
    }
  }

  toastService.error(errorMessage);
}

// Keep the old class for backward compatibility if needed
export { authInterceptor as AuthInterceptor };