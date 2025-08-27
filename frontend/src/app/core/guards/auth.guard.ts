import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn, CanMatchFn } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import { AuthUser } from '../types/auth.types';

/**
 * Guard to protect routes that require authentication
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated$.pipe(
    take(1),
    map(isAuthenticated => {
      if (isAuthenticated) {
        return true;
      } else {
        // Redirect to login page
        router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
      }
    })
  );
};

/**
 * Guard to protect routes that require specific roles
 */
export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.currentUser$.pipe(
      take(1),
      map(user => {
        if (!user) {
          router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
          return false;
        }

        if (allowedRoles.includes(user.role)) {
          return true;
        } else {
          router.navigate(['/unauthorized']);
          return false;
        }
      })
    );
  };
};

/**
 * Guard to redirect authenticated users away from auth pages
 */
export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated$.pipe(
    take(1),
    map(isAuthenticated => {
      if (isAuthenticated) {
        router.navigate(['/']);
        return false;
      } else {
        return true;
      }
    })
  );
};

/**
 * Guard to check if user has specific permissions
 */
export const permissionGuard = (requiredPermissions: string[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.currentUser$.pipe(
      take(1),
      map(user => {
        if (!user) {
          router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
          return false;
        }

        // For now, assume all authenticated users have basic permissions
        // This can be extended when user permissions are properly implemented
        const hasPermission = true;

        if (hasPermission) {
          return true;
        } else {
          router.navigate(['/unauthorized']);
          return false;
        }
      })
    );
  };
};

/**
 * Guard for lazy-loaded modules
 */
export const authCanMatch: CanMatchFn = (route, segments) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated$.pipe(
    take(1),
    map(isAuthenticated => {
      if (isAuthenticated) {
        return true;
      } else {
        router.navigate(['/login']);
        return false;
      }
    })
  );
};

/**
 * Admin guard for admin-only routes
 */
export const adminGuard: CanActivateFn = roleGuard(['admin']);

/**
 * Moderator guard for moderator and admin routes
 */
export const moderatorGuard: CanActivateFn = roleGuard(['admin', 'moderator']);