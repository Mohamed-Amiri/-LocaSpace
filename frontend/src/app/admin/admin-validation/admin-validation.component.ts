import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

interface PendingLieu {
  id: number;
  titre: string;
  description: string;
  type: string;
  prix: number;
  adresse: string;
  photos: string[];
  owner?: {
    nom: string;
    email: string;
  };
}

@Component({
  selector: 'app-admin-validation',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="admin-container">
      <!-- Modern Header with Glassmorphism -->
      <div class="premium-header">
        <div class="header-background">
          <div class="floating-elements">
            <div class="element element-1"></div>
            <div class="element element-2"></div>
            <div class="element element-3"></div>
          </div>
        </div>
        <div class="header-content">
          <div class="header-left">
            <div class="icon-wrapper">
              <mat-icon class="header-icon">admin_panel_settings</mat-icon>
            </div>
            <div class="header-text">
              <h1 class="page-title">Admin - Validation des Lieux</h1>
              <p>Validez les nouveaux lieux créés par les propriétaires</p>
            </div>
          </div>
          <div class="header-actions">
            <button mat-raised-button color="primary" (click)="loadPendingLieux()">
              <mat-icon>refresh</mat-icon>
              Actualiser
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="loading-container">
        <mat-spinner diameter="60"></mat-spinner>
        <p>Chargement des lieux en attente...</p>
      </div>

      <!-- Pending Lieux -->
      <div *ngIf="!loading" class="content-container">
        <!-- Stats Cards -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">
              <mat-icon>pending_actions</mat-icon>
            </div>
            <div class="stat-content">
              <h3>{{ pendingLieux.length }}</h3>
              <p>En attente</p>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="pendingLieux.length === 0" class="empty-state">
          <mat-icon class="empty-icon">check_circle</mat-icon>
          <h2>Aucun lieu en attente</h2>
          <p>Tous les lieux ont été validés</p>
        </div>

        <!-- Lieux List -->
        <div *ngIf="pendingLieux.length > 0" class="lieux-grid">
          <mat-card *ngFor="let lieu of pendingLieux" class="lieu-card">
            <div class="card-header">
              <h3>{{ lieu.titre }}</h3>
              <mat-chip class="type-chip">{{ lieu.type }}</mat-chip>
            </div>
            
            <div class="card-content">
              <div class="lieu-image" *ngIf="lieu.photos && lieu.photos.length > 0">
                <img [src]="lieu.photos[0]" [alt]="lieu.titre" />
              </div>
              
              <div class="lieu-details">
                <div class="info-row">
                  <mat-icon>location_on</mat-icon>
                  <span>{{ lieu.adresse }}</span>
                </div>
                <div class="info-row">
                  <mat-icon>euro</mat-icon>
                  <span>{{ lieu.prix }}€ / nuit</span>
                </div>
                <div class="info-row" *ngIf="lieu.owner">
                  <mat-icon>person</mat-icon>
                  <span>{{ lieu.owner.nom }} ({{ lieu.owner.email }})</span>
                </div>
              </div>
              
              <p class="description">{{ lieu.description }}</p>
            </div>

            <div class="card-actions">
              <button 
                mat-raised-button 
                color="primary" 
                (click)="validateLieu(lieu)"
                [disabled]="processingIds.has(lieu.id)">
                <mat-icon>check</mat-icon>
                {{ processingIds.has(lieu.id) ? 'Validation...' : 'Valider' }}
              </button>
              <button 
                mat-stroked-button 
                color="warn" 
                (click)="rejectLieu(lieu)"
                [disabled]="processingIds.has(lieu.id)">
                <mat-icon>close</mat-icon>
                {{ processingIds.has(lieu.id) ? 'Rejet...' : 'Rejeter' }}
              </button>
            </div>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
      min-height: 100vh;
      background: #ffffff;
      font-family: 'Inter', sans-serif;
    }

    .premium-header {
      position: relative;
      padding: 48px 32px;
      margin-bottom: 32px;
      overflow: hidden;
      background: rgba(108, 99, 255, 0.05);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(108, 99, 255, 0.1);
    }

    .header-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
    }

    .floating-elements {
      position: absolute;
      width: 100%;
      height: 100%;
    }

    .element {
      position: absolute;
      background: rgba(108, 99, 255, 0.08);
      border-radius: 50%;
      animation: float 6s ease-in-out infinite;
    }

    .element-1 {
      width: 120px;
      height: 120px;
      top: 10%;
      left: 10%;
      animation-delay: 0s;
    }

    .element-2 {
      width: 80px;
      height: 80px;
      top: 60%;
      right: 15%;
      animation-delay: 2s;
    }

    .element-3 {
      width: 100px;
      height: 100px;
      bottom: 20%;
      left: 60%;
      animation-delay: 4s;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(180deg); }
    }

    .header-content {
      position: relative;
      z-index: 2;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 24px;
    }

    .icon-wrapper {
      width: 64px;
      height: 64px;
      background: rgba(108, 99, 255, 0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(10px);
    }

    .header-icon {
      font-size: 32px;
      color: #667eea;
    }

    .page-title {
      color: #667eea;
      font-size: 2.5rem;
      font-weight: 800;
      margin: 0;
      text-shadow: 0 2px 4px rgba(102, 126, 234, 0.1);
    }

    .header-text p {
      color: rgba(108, 99, 255, 0.7);
      font-size: 1.1rem;
      margin: 8px 0 0 0;
    }

    .content-container {
      padding: 0 32px 32px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .stat-card {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(20px);
      border-radius: 16px;
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .stat-content h3 {
      font-size: 2rem;
      font-weight: 700;
      margin: 0;
      color: #2d3748;
    }

    .stat-content p {
      margin: 4px 0 0 0;
      color: #718096;
      font-weight: 500;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 64px;
      color: #667eea;
    }

    .loading-container p {
      margin-top: 16px;
      font-size: 1.1rem;
    }

    .empty-state {
      text-align: center;
      padding: 64px 32px;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(20px);
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .empty-icon {
      font-size: 64px;
      color: #48bb78;
      margin-bottom: 16px;
    }

    .empty-state h2 {
      color: #2d3748;
      margin-bottom: 8px;
    }

    .empty-state p {
      color: #718096;
    }

    .lieux-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 24px;
    }

    .lieu-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .lieu-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }

    .card-header h3 {
      margin: 0;
      color: #2d3748;
      font-weight: 600;
    }

    .type-chip {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
    }

    .card-content {
      padding: 20px;
    }

    .lieu-image {
      margin-bottom: 16px;
      border-radius: 8px;
      overflow: hidden;
    }

    .lieu-image img {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }

    .info-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      color: #555555;
    }

    .description {
      margin-top: 12px;
      color: #718096;
      line-height: 1.5;
    }

    .card-actions {
      display: flex;
      gap: 12px;
      padding: 20px;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
    }

    .card-actions button {
      flex: 1;
      padding: 12px 24px;
      font-weight: 600;
    }

    ::ng-deep .mat-mdc-raised-button {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
    }

    ::ng-deep .mat-mdc-stroked-button {
      border: 2px solid currentColor !important;
    }
  `]
})
export class AdminValidationComponent implements OnInit {
  pendingLieux: PendingLieu[] = [];
  loading = true;
  processingIds = new Set<number>();

  private apiUrl = `${environment.apiUrl}`;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPendingLieux();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
  }

  loadPendingLieux(): void {
    this.loading = true;
    this.http.get<PendingLieu[]>(`${this.apiUrl}/lieux/pending`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error loading pending lieux:', error);
        this.snackBar.open('Erreur lors du chargement des lieux en attente', 'Fermer', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        return of([]);
      })
    ).subscribe({
      next: (lieux) => {
        this.pendingLieux = lieux;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  validateLieu(lieu: PendingLieu): void {
    this.processingIds.add(lieu.id);
    this.http.put(`${this.apiUrl}/lieux/${lieu.id}/validate`, {}, {
      headers: this.getAuthHeaders(),
      responseType: 'text'
    }).pipe(
      catchError(error => {
        console.error('Error validating lieu:', error);
        this.snackBar.open('Erreur lors de la validation', 'Fermer', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        throw error;
      })
    ).subscribe({
      next: () => {
        this.processingIds.delete(lieu.id);
        this.pendingLieux = this.pendingLieux.filter(l => l.id !== lieu.id);
        this.snackBar.open(`Lieu "${lieu.titre}" validé avec succès`, 'Fermer', {
          duration: 4000,
          panelClass: ['success-snackbar']
        });
        this.cdr.detectChanges();
      },
      error: () => {
        this.processingIds.delete(lieu.id);
        this.cdr.detectChanges();
      }
    });
  }

  rejectLieu(lieu: PendingLieu): void {
    if (!confirm(`Êtes-vous sûr de vouloir rejeter "${lieu.titre}" ? Cette action supprimera définitivement le lieu.`)) {
      return;
    }

    this.processingIds.add(lieu.id);
    this.http.delete(`${this.apiUrl}/lieux/${lieu.id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error rejecting lieu:', error);
        this.snackBar.open('Erreur lors du rejet', 'Fermer', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        throw error;
      })
    ).subscribe({
      next: () => {
        this.processingIds.delete(lieu.id);
        this.pendingLieux = this.pendingLieux.filter(l => l.id !== lieu.id);
        this.snackBar.open(`Lieu "${lieu.titre}" rejeté`, 'Fermer', {
          duration: 4000,
          panelClass: ['info-snackbar']
        });
        this.cdr.detectChanges();
      },
      error: () => {
        this.processingIds.delete(lieu.id);
        this.cdr.detectChanges();
      }
    });
  }
}