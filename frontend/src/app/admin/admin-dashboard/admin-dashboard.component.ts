import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { AdminService, AdminStats, SystemHealth } from '../services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  template: `
    <div class="admin-dashboard">
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
              <mat-icon class="header-icon">dashboard</mat-icon>
            </div>
            <div class="header-text">
              <h1 class="page-title">Tableau de Bord Admin</h1>
              <p>Vue d'ensemble du système LocaSpace</p>
            </div>
          </div>
          <div class="header-actions">
            <button mat-raised-button color="primary" (click)="refreshData()">
              <mat-icon>refresh</mat-icon>
              Actualiser
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="loading-container">
        <mat-spinner diameter="60"></mat-spinner>
        <p>Chargement des statistiques...</p>
      </div>

      <!-- Dashboard Content -->
      <div *ngIf="!loading" class="dashboard-content">
        <!-- Quick Stats Grid -->
        <div class="stats-grid">
          <div class="stat-card users">
            <div class="stat-icon">
              <mat-icon>people</mat-icon>
            </div>
            <div class="stat-content">
              <h3>{{ stats.totalUsers }}</h3>
              <p>Utilisateurs</p>
              <div class="stat-trend positive">
                <mat-icon>trending_up</mat-icon>
                <span>+12% ce mois</span>
              </div>
            </div>
          </div>

          <div class="stat-card lieux">
            <div class="stat-icon">
              <mat-icon>home</mat-icon>
            </div>
            <div class="stat-content">
              <h3>{{ stats.validatedLieux }}</h3>
              <p>Lieux Validés</p>
              <div class="stat-trend positive">
                <mat-icon>trending_up</mat-icon>
                <span>+8% ce mois</span>
              </div>
            </div>
          </div>

          <div class="stat-card reservations">
            <div class="stat-icon">
              <mat-icon>event</mat-icon>
            </div>
            <div class="stat-content">
              <h3>{{ stats.confirmedReservations }}</h3>
              <p>Réservations</p>
              <div class="stat-trend positive">
                <mat-icon>trending_up</mat-icon>
                <span>+15% ce mois</span>
              </div>
            </div>
          </div>

          <div class="stat-card revenue">
            <div class="stat-icon">
              <mat-icon>euro</mat-icon>
            </div>
            <div class="stat-content">
              <h3>4.2</h3>
              <p>Note Moyenne</p>
              <div class="stat-trend neutral">
                <mat-icon>star</mat-icon>
                <span>{{ stats.totalReviews }} avis</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Management Cards -->
        <div class="management-grid">
          <mat-card class="management-card">
            <div class="card-header">
              <div class="card-icon users-icon">
                <mat-icon>people</mat-icon>
              </div>
              <h3>Gestion des Utilisateurs</h3>
            </div>
            <div class="card-content">
              <p>Gérez les comptes utilisateurs, bloquez ou supprimez les comptes problématiques.</p>
              <div class="card-stats">
                <div class="stat-item">
                  <span class="stat-label">Total:</span>
                  <span class="stat-value">{{ stats.totalUsers }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Actifs:</span>
                  <span class="stat-value">{{ healthStats.activeUsers }}</span>
                </div>
              </div>
            </div>
            <div class="card-actions">
              <button mat-raised-button color="primary" routerLink="/admin/users">
                <mat-icon>manage_accounts</mat-icon>
                Gérer les Utilisateurs
              </button>
            </div>
          </mat-card>

          <mat-card class="management-card">
            <div class="card-header">
              <div class="card-icon lieux-icon">
                <mat-icon>home</mat-icon>
              </div>
              <h3>Validation des Lieux</h3>
            </div>
            <div class="card-content">
              <p>Validez ou supprimez les nouveaux lieux créés par les propriétaires.</p>
              <div class="card-stats">
                <div class="stat-item">
                  <span class="stat-label">En attente:</span>
                  <span class="stat-value highlight">{{ stats.pendingLieux }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Validés:</span>
                  <span class="stat-value">{{ stats.validatedLieux }}</span>
                </div>
              </div>
            </div>
            <div class="card-actions">
              <button mat-raised-button color="primary" routerLink="/admin/validation">
                <mat-icon>verified</mat-icon>
                Valider les Lieux
              </button>
            </div>
          </mat-card>

          <mat-card class="management-card">
            <div class="card-header">
              <div class="card-icon stats-icon">
                <mat-icon>analytics</mat-icon>
              </div>
              <h3>Statistiques Avancées</h3>
            </div>
            <div class="card-content">
              <p>Consultez les statistiques détaillées et les analyses d'utilisation.</p>
              <div class="card-stats">
                <div class="stat-item">
                  <span class="stat-label">Réservations:</span>
                  <span class="stat-value">{{ stats.totalReservations }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Avis:</span>
                  <span class="stat-value">{{ stats.totalReviews }}</span>
                </div>
              </div>
            </div>
            <div class="card-actions">
              <button mat-raised-button color="primary" routerLink="/admin/statistics">
                <mat-icon>bar_chart</mat-icon>
                Voir les Statistiques
              </button>
            </div>
          </mat-card>
        </div>

        <!-- System Health -->
        <div class="health-section">
          <mat-card class="health-card">
            <div class="card-header">
              <mat-icon class="health-icon">health_and_safety</mat-icon>
              <h3>État du Système</h3>
            </div>
            <div class="health-content">
              <div class="health-indicator good">
                <mat-icon>check_circle</mat-icon>
                <span>Système Opérationnel</span>
              </div>
              <div class="health-stats">
                <div class="health-stat">
                  <mat-icon>people</mat-icon>
                  <span>{{ healthStats.activeUsers }} utilisateurs actifs</span>
                </div>
                <div class="health-stat">
                  <mat-icon>home</mat-icon>
                  <span>{{ healthStats.activeLieux }} lieux actifs</span>
                </div>
                <div class="health-stat">
                  <mat-icon>event</mat-icon>
                  <span>{{ healthStats.recentReservations }} réservations récentes</span>
                </div>
              </div>
            </div>
          </mat-card>
        </div>

        <!-- Pending Actions -->
        <div class="pending-actions" *ngIf="stats.pendingLieux > 0 || stats.pendingReservations > 0">
          <mat-card class="pending-card">
            <div class="card-header">
              <mat-icon class="pending-icon">pending_actions</mat-icon>
              <h3>Actions en Attente</h3>
            </div>
            <div class="pending-content">
              <div class="pending-item" *ngIf="stats.pendingLieux > 0">
                <mat-chip class="pending-chip">{{ stats.pendingLieux }}</mat-chip>
                <span>Lieux à valider</span>
                <button mat-icon-button color="primary" routerLink="/admin/validation">
                  <mat-icon>arrow_forward</mat-icon>
                </button>
              </div>
              <div class="pending-item" *ngIf="stats.pendingReservations > 0">
                <mat-chip class="pending-chip">{{ stats.pendingReservations }}</mat-chip>
                <span>Réservations en attente</span>
                <button mat-icon-button color="primary">
                  <mat-icon>arrow_forward</mat-icon>
                </button>
              </div>
            </div>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-dashboard {
      min-height: 100vh;
      background: #ffffff;
      font-family: 'Inter', sans-serif;
    }

    .premium-header {
      position: relative;
      padding: 48px 32px;
      margin-bottom: 32px;
      overflow: hidden;
      background: rgba(102, 126, 234, 0.05);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(102, 126, 234, 0.1);
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
      background: rgba(102, 126, 234, 0.08);
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
      background: rgba(102, 126, 234, 0.1);
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
      color: rgba(102, 126, 234, 0.7);
      font-size: 1.1rem;
      margin: 8px 0 0 0;
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

    .dashboard-content {
      padding: 0 32px 32px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .stat-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 16px;
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 20px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
    }

    .stat-icon {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 32px;
    }

    .users .stat-icon { background: linear-gradient(135deg, #667eea, #764ba2); }
    .lieux .stat-icon { background: linear-gradient(135deg, #f093fb, #f5576c); }
    .reservations .stat-icon { background: linear-gradient(135deg, #4facfe, #00f2fe); }
    .revenue .stat-icon { background: linear-gradient(135deg, #43e97b, #38f9d7); }

    .stat-content h3 {
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0;
      color: #2d3748;
    }

    .stat-content p {
      margin: 4px 0 8px 0;
      color: #718096;
      font-weight: 500;
    }

    .stat-trend {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .stat-trend.positive { color: #48bb78; }
    .stat-trend.negative { color: #f56565; }
    .stat-trend.neutral { color: #ed8936; }

    .management-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .management-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .management-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 24px 24px 16px;
    }

    .card-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .users-icon { background: linear-gradient(135deg, #667eea, #764ba2); }
    .lieux-icon { background: linear-gradient(135deg, #f093fb, #f5576c); }
    .stats-icon { background: linear-gradient(135deg, #4facfe, #00f2fe); }

    .card-header h3 {
      margin: 0;
      color: #2d3748;
      font-weight: 600;
    }

    .card-content {
      padding: 0 24px 16px;
    }

    .card-content p {
      color: #718096;
      line-height: 1.5;
      margin-bottom: 16px;
    }

    .card-stats {
      display: flex;
      gap: 24px;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #718096;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #2d3748;
    }

    .stat-value.highlight {
      color: #f56565;
    }

    .card-actions {
      padding: 16px 24px 24px;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
    }

    .card-actions button {
      width: 100%;
      padding: 12px 24px;
      font-weight: 600;
    }

    .health-section, .pending-actions {
      margin-bottom: 24px;
    }

    .health-card, .pending-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .health-content {
      padding: 24px;
    }

    .health-indicator {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
      font-weight: 600;
    }

    .health-indicator.good { color: #48bb78; }

    .health-stats {
      display: flex;
      flex-wrap: wrap;
      gap: 24px;
    }

    .health-stat {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #4a5568;
    }

    .pending-content {
      padding: 24px;
    }

    .pending-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px 0;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }

    .pending-item:last-child {
      border-bottom: none;
    }

    .pending-chip {
      background: #f56565;
      color: white;
      font-weight: 600;
    }

    .health-icon, .pending-icon {
      color: #667eea;
    }

    ::ng-deep .mat-mdc-raised-button {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  loading = true;
  stats: AdminStats = {
    totalUsers: 0,
    totalLieux: 0,
    validatedLieux: 0,
    pendingLieux: 0,
    totalReservations: 0,
    confirmedReservations: 0,
    pendingReservations: 0,
    totalReviews: 0,
    averageRating: 0
  };
  
  healthStats: SystemHealth = {
    activeUsers: 0,
    activeLieux: 0,
    recentReservations: 0
  };

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    
    // Load dashboard stats and system health in parallel
    Promise.all([
      this.adminService.getDashboardStats().toPromise(),
      this.adminService.getSystemHealth().toPromise()
    ]).then(([stats, health]) => {
      if (stats) this.stats = stats;
      if (health) this.healthStats = health;
      this.loading = false;
      this.cdr.detectChanges();
    }).catch(error => {
      console.error('Error loading dashboard data:', error);
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  refreshData(): void {
    this.loadData();
  }
}