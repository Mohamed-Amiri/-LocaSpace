import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

// Types and interfaces
export interface AdminUser {
  id: number;
  nom: string;
  email: string;
  role: string;
  createdAt: string;
  blocked?: boolean;
  lastLogin?: string;
}

export interface AdminLieu {
  id: number;
  titre: string;
  description: string;
  type: string;
  prix: number;
  adresse: string;
  photos: string[];
  valide: boolean;
  owner?: {
    nom: string;
    email: string;
  };
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalLieux: number;
  validatedLieux: number;
  pendingLieux: number;
  totalReservations: number;
  confirmedReservations: number;
  pendingReservations: number;
  totalReviews: number;
  averageRating: number;
}

export interface UserRoleDistribution {
  [role: string]: number;
}

export interface LieuTypeDistribution {
  [type: string]: number;
}

export interface SystemHealth {
  activeUsers: number;
  activeLieux: number;
  recentReservations: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return of(result as T);
    };
  }

  // User Management
  getAllUsers(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(`${this.apiUrl}/users`, {
      headers: this.getAuthHeaders()
    }).pipe(
      retry(1),
      map(users => users || []),
      catchError(this.handleError<AdminUser[]>('getAllUsers', []))
    );
  }

  blockUser(userId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/users/${userId}/block`, {}, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError('blockUser'))
    );
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/users/${userId}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError('deleteUser'))
    );
  }

  changeUserRole(userId: number, newRole: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${userId}/role`, 
      { role: newRole }, 
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError(this.handleError('changeUserRole'))
    );
  }

  // Lieu Management
  getAllLieux(): Observable<AdminLieu[]> {
    return this.http.get<AdminLieu[]>(`${this.apiUrl}/lieux`, {
      headers: this.getAuthHeaders()
    }).pipe(
      retry(1),
      map(lieux => lieux || []),
      catchError(this.handleError<AdminLieu[]>('getAllLieux', []))
    );
  }

  getPendingLieux(): Observable<AdminLieu[]> {
    return this.http.get<AdminLieu[]>(`${this.apiUrl}/lieux/pending`, {
      headers: this.getAuthHeaders()
    }).pipe(
      retry(1),
      map(lieux => lieux || []),
      catchError(this.handleError<AdminLieu[]>('getPendingLieux', []))
    );
  }

  validateLieu(lieuId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/lieux/${lieuId}/validate`, {}, {
      headers: this.getAuthHeaders(),
      responseType: 'text'
    }).pipe(
      catchError(this.handleError('validateLieu'))
    );
  }

  deleteLieu(lieuId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/lieux/${lieuId}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError('deleteLieu'))
    );
  }

  // Statistics
  getDashboardStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${this.apiUrl}/admin/stats`, {
      headers: this.getAuthHeaders()
    }).pipe(
      retry(1),
      catchError(this.handleError<AdminStats>('getDashboardStats', {
        totalUsers: 0,
        totalLieux: 0,
        validatedLieux: 0,
        pendingLieux: 0,
        totalReservations: 0,
        confirmedReservations: 0,
        pendingReservations: 0,
        totalReviews: 0,
        averageRating: 0
      }))
    );
  }

  getUserRoleDistribution(): Observable<UserRoleDistribution> {
    return this.http.get<UserRoleDistribution>(`${this.apiUrl}/admin/stats/users/roles`, {
      headers: this.getAuthHeaders()
    }).pipe(
      retry(1),
      catchError(this.handleError<UserRoleDistribution>('getUserRoleDistribution', {}))
    );
  }

  getLieuTypeDistribution(): Observable<LieuTypeDistribution> {
    return this.http.get<LieuTypeDistribution>(`${this.apiUrl}/admin/stats/lieux/types`, {
      headers: this.getAuthHeaders()
    }).pipe(
      retry(1),
      catchError(this.handleError<LieuTypeDistribution>('getLieuTypeDistribution', {}))
    );
  }

  getSystemHealth(): Observable<SystemHealth> {
    return this.http.get<SystemHealth>(`${this.apiUrl}/admin/stats/health`, {
      headers: this.getAuthHeaders()
    }).pipe(
      retry(1),
      catchError(this.handleError<SystemHealth>('getSystemHealth', {
        activeUsers: 0,
        activeLieux: 0,
        recentReservations: 0
      }))
    );
  }


}