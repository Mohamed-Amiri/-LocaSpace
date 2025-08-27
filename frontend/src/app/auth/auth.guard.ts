import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanMatch, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AuthService } from './auth.service';
import { ToastService } from '../shared/components/toast/toast.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanMatch {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.checkAuth(route, state.url);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.canActivate(childRoute, state);
  }

  canMatch(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> {
    return this.checkAuth(route, segments.map(s => s.path).join('/'));
  }

  private checkAuth(route: ActivatedRouteSnapshot | Route, url: string): Observable<boolean> {
    return this.authService.currentUser$.pipe(
      take(1),
      map(user => {
        const requiredRoles = route.data?.['roles'] as ('tenant' | 'owner' | 'admin')[];

        // If not authenticated, redirect to login
        if (!user) {
          this.toastService.error('Veuillez vous connecter pour accéder à cette page');
          this.router.navigate(['/login'], {
            queryParams: { returnUrl: url }
          });
          return false;
        }

        // If no specific roles are required, allow access
        if (!requiredRoles || requiredRoles.length === 0) {
          return true;
        }

        // Check if user has required role
        if (requiredRoles.includes(user.role)) {
          return true;
        }

        // If user doesn't have required role, redirect to home
        this.toastService.error('Vous n\'avez pas les permissions nécessaires');
        this.router.navigate(['/']);
        return false;
      })
    );
  }
}

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate, CanActivateChild, CanMatch {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.checkNoAuth();
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.canActivate(childRoute, state);
  }

  canMatch(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> {
    return this.checkNoAuth();
  }

  private checkNoAuth(): Observable<boolean> {
    return this.authService.currentUser$.pipe(
      take(1),
      map(user => {
        console.log('NoAuthGuard - Current user:', user);
        if (user) {
          // If user is already authenticated, redirect to home
          console.log('NoAuthGuard - User is authenticated, redirecting to home');
          this.router.navigate(['/']);
          return false;
        }
        console.log('NoAuthGuard - No user, allowing access to auth page');
        return true;
      })
    );
  }
}