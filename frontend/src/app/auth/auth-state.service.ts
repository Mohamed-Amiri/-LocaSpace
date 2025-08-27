import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, timer } from 'rxjs';
import { takeUntil, tap, filter, map as rxMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastService } from '../shared/components/toast/toast.service';
import { AUTH_CONFIG } from './auth.constants';
import { User } from './auth.service';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  lastActivity: number;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  lastActivity: Date.now()
};

@Injectable({
  providedIn: 'root'
})
export class AuthStateService implements OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly state = new BehaviorSubject<AuthState>(initialState);
  private inactivityTimer: any;
  private sessionExpiryTimer: any;

  // State Observables
  readonly state$ = this.state.asObservable();
  readonly user$ = this.state$.pipe(rxMap(state => state.user));
  readonly token$ = this.state$.pipe(rxMap(state => state.token));
  readonly isAuthenticated$ = this.state$.pipe(rxMap(state => state.isAuthenticated));
  readonly isLoading$ = this.state$.pipe(rxMap(state => state.isLoading));

  constructor(
    private router: Router,
    private toastService: ToastService
  ) {
    this.initializeState();
    this.setupInactivityTimer();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.clearTimers();
  }

  // State Management Methods
  private initializeState(): void {
    try {
      const storedUser = localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.CURRENT_USER);
      const storedToken = localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.TOKEN);

      if (storedUser && storedToken) {
        const user = JSON.parse(storedUser);
        this.updateState({
          user,
          token: storedToken,
          isAuthenticated: true,
          isLoading: false,
          lastActivity: Date.now()
        });
        this.setupSessionExpiryTimer();
      }
    } catch (error) {
      console.error('Error initializing auth state:', error);
      this.clearState();
    }
  }

  private updateState(newState: Partial<AuthState>): void {
    this.state.next({
      ...this.state.value,
      ...newState
    });
  }

  setLoading(isLoading: boolean): void {
    this.updateState({ isLoading });
  }

  setAuthenticated(user: User, token: string, rememberMe: boolean = false): void {
    if (rememberMe) {
      localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.REMEMBER_ME, 'true');
    }

    this.updateState({
      user,
      token,
      isAuthenticated: true,
      lastActivity: Date.now()
    });

    this.setupSessionExpiryTimer();
  }

  clearState(): void {
    localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.TOKEN);
    localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.REMEMBER_ME);

    this.updateState(initialState);
    this.clearTimers();
    this.router.navigate(['/']);
  }

  // Session Management
  private setupInactivityTimer(): void {
    document.addEventListener('mousemove', () => this.resetInactivityTimer());
    document.addEventListener('keypress', () => this.resetInactivityTimer());
    document.addEventListener('click', () => this.resetInactivityTimer());
    document.addEventListener('scroll', () => this.resetInactivityTimer());

    this.resetInactivityTimer();
  }

  private resetInactivityTimer(): void {
    if (!this.state.value.isAuthenticated) return;

    this.updateState({ lastActivity: Date.now() });

    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }

    this.inactivityTimer = setTimeout(() => {
      if (this.state.value.isAuthenticated) {
        this.toastService.warning('Votre session va expirer pour inactivité');
        
        // Give user a chance to extend session
        setTimeout(() => {
          if (Date.now() - this.state.value.lastActivity >= AUTH_CONFIG.TIMEOUTS.INACTIVITY_TIMEOUT) {
            this.handleSessionExpired('Votre session a expiré pour inactivité');
          }
        }, AUTH_CONFIG.TIMEOUTS.SESSION_EXPIRY_WARNING);
      }
    }, AUTH_CONFIG.TIMEOUTS.INACTIVITY_TIMEOUT - AUTH_CONFIG.TIMEOUTS.SESSION_EXPIRY_WARNING);
  }

  private setupSessionExpiryTimer(): void {
    if (this.sessionExpiryTimer) {
      clearTimeout(this.sessionExpiryTimer);
    }

    // Show warning before session expires
    this.sessionExpiryTimer = setTimeout(() => {
      if (this.state.value.isAuthenticated) {
        this.toastService.warning('Votre session va bientôt expirer');
      }
    }, AUTH_CONFIG.TIMEOUTS.SESSION_EXPIRY_WARNING);
  }

  private handleSessionExpired(message: string): void {
    this.toastService.error(message);
    this.clearState();
  }

  private clearTimers(): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }
    if (this.sessionExpiryTimer) {
      clearTimeout(this.sessionExpiryTimer);
    }
  }

  // Helper Methods
  hasRole(role: string): boolean {
    return this.state.value.user?.role === role;
  }

  hasPermission(permission: string): boolean {
    const userRole = this.state.value.user?.role;
    if (!userRole) return false;
    return AUTH_CONFIG.PERMISSIONS[userRole].includes(permission as any);
  }

  get currentState(): AuthState {
    return this.state.value;
  }

  get isAuthenticated(): boolean {
    return this.state.value.isAuthenticated;
  }

  get currentUser(): User | null {
    return this.state.value.user;
  }

  get token(): string | null {
    return this.state.value.token;
  }
}

// Helper function for state$ pipe operations
function map<T>(project: (state: AuthState) => T) {
  return (source: Observable<AuthState>): Observable<T> => {
    return new Observable(subscriber => {
      return source.subscribe({
        next(state) { subscriber.next(project(state)); },
        error(err) { subscriber.error(err); },
        complete() { subscriber.complete(); }
      });
    });
  };
}