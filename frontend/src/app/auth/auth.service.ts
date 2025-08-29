import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, tap, catchError, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'tenant' | 'owner' | 'admin';
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'tenant' | 'owner' | 'admin';
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  id: number;
  email: string;
  nom: string;
  roles: string[];
  frontendRole: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  public currentUser$ = this.currentUserSubject.asObservable();
  public token$ = this.tokenSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    // Check for saved user in both localStorage and sessionStorage
    const savedUser = this.getFromStorage('currentUser');
    const savedToken = this.getFromStorage('authToken');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
      this.isAuthenticatedSubject.next(true);
    }
    if (savedToken) {
      this.tokenSubject.next(savedToken);
    }
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isAuthenticated(): boolean {
    const user = this.currentUser;
    const token = this.getFromStorage('authToken');
    return !!user && !!token;
  }

  login(credentials: LoginCredentials): Observable<User> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => {
        // Extract user info from response
        const user: User = {
          id: response.id.toString(),
          firstName: response.nom.split(' ')[0] || '',
          lastName: response.nom.split(' ').slice(1).join(' ') || '',
          email: response.email,
          role: response.frontendRole as 'tenant' | 'owner' | 'admin'
        };

        // Store user and token based on rememberMe preference
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
        this.tokenSubject.next(response.accessToken);

        const storage = this.getStorage(credentials.rememberMe);
        storage.setItem('currentUser', JSON.stringify(user));
        storage.setItem('authToken', response.accessToken);

        // Store remember preference
        if (credentials.rememberMe !== undefined) {
          localStorage.setItem('rememberMe', credentials.rememberMe.toString());
        }
      }),
      // Map response to User interface
      switchMap(response => {
        return of(this.currentUserSubject.value!);
      }),
      catchError(this.handleError)
    );
  }

  register(data: RegisterData): Observable<User> {
    // Map frontend role to backend expected format
    const backendData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      role: data.role.toUpperCase() // Backend expects uppercase
    };

    return this.http.post(`${this.API_URL}/register`, backendData, { responseType: 'text' }).pipe(
      switchMap((response: string) => {
        // Return a user object for consistency
        return of({
          id: 'temp',
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          role: data.role
        });
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.tokenSubject.next(null);

    // Clear from both storages
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    localStorage.removeItem('rememberMe');
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('authToken');

    // Automatically redirect to home page
    this.router.navigate(['/']);
  }

  refreshToken(): Observable<string> {
    return this.http.post<{ accessToken: string }>(`${this.API_URL}/refresh`, {}).pipe(
      tap(response => {
        this.tokenSubject.next(response.accessToken);
        const storage = this.getStorage();
        storage.setItem('authToken', response.accessToken);
      }),
      switchMap(response => of(response.accessToken)),
      catchError(this.handleError)
    );
  }

  forgotPassword(email: string): Observable<void> {
    // Simulate API call
    return of(void 0).pipe(delay(1000));
  }

  resetPassword(token: string, newPassword: string): Observable<void> {
    // Simulate API call
    return of(void 0).pipe(delay(1000));
  }

  validateToken(): Observable<boolean> {
    const token = this.getFromStorage('authToken');
    if (!token) {
      return of(false);
    }

    return this.http.get<any>(`${this.API_URL}/validate`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).pipe(
      switchMap(() => of(true)),
      catchError(() => {
        // Token is invalid, clear authentication
        this.logout();
        return of(false);
      })
    );
  }

  private getStorage(rememberMe?: boolean): Storage {
    if (rememberMe === undefined) {
      // Check stored preference
      const storedRememberMe = localStorage.getItem('rememberMe');
      rememberMe = storedRememberMe === 'true';
    }
    return rememberMe ? localStorage : sessionStorage;
  }

  private getFromStorage(key: string): string | null {
    // Check localStorage first, then sessionStorage
    return localStorage.getItem(key) || sessionStorage.getItem(key);
  }

  private translateError(message: string): string {
    const translations: { [key: string]: string } = {
      'Email is already in use!': 'Cet email est déjà utilisé',
      'Error: Email is already in use!': 'Cet email est déjà utilisé',
      'Invalid credentials': 'Email ou mot de passe incorrect',
      'User not found': 'Utilisateur non trouvé',
      'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character': 'Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial',
      'Password must be between 8 and 100 characters': 'Le mot de passe doit contenir entre 8 et 100 caractères',
      'Email should be valid': 'Format d\'email invalide',
      'First name is required': 'Le prénom est requis',
      'Last name is required': 'Le nom est requis',
      'Email is required': 'L\'email est requis',
      'Password is required': 'Le mot de passe est requis',
      'Role must be either TENANT, OWNER, or ADMIN': 'Le rôle doit être Locataire, Propriétaire ou Admin'
    };
    return translations[message] || message;
  }

  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      if (error.status === 401) {
        errorMessage = 'Email ou mot de passe incorrect';
      } else if (error.status === 400) {
        // Handle validation errors
        if (error.error?.message) {
          errorMessage = this.translateError(error.error.message);
        } else if (typeof error.error === 'string') {
          errorMessage = this.translateError(error.error);
        } else {
          errorMessage = 'Données invalides - Vérifiez le format de vos données';
        }
      } else if (error.status === 409) {
        errorMessage = 'Cet email est déjà utilisé';
      } else if (error.status === 0) {
        errorMessage = 'Impossible de se connecter au serveur. Vérifiez que le backend est démarré.';
      } else {
        const serverMessage = error.error?.message || error.message;
        errorMessage = `Erreur ${error.status}: ${this.translateError(serverMessage)}`;
      }
    }

    console.error('Auth Service Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}