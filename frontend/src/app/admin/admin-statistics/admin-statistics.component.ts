import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AdminService, AdminStats, UserRoleDistribution, LieuTypeDistribution, SystemHealth } from '../services/admin.service';

@Component({
  selector: 'app-admin-statistics',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  template: `
    <div class="statistics-dashboard">
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
              <mat-icon class="header-icon">analytics</mat-icon>
            </div>
            <div class="header-text">
              <h1 class="page-title">Statistiques d'Utilisation</h1>
              <p>Analyses détaillées et métriques du système</p>
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

      <!-- Statistics Content -->
      <div *ngIf="!loading" class="statistics-content">
        <!-- Overview Stats -->
        <div class="overview-section">
          <h2 class="section-title">Vue d'Ensemble</h2>
          <div class="overview-grid">
            <div class="overview-card users">
              <div class="card-header">
                <mat-icon>people</mat-icon>
                <h3>Utilisateurs</h3>
              </div>
              <div class="card-stats">
                <div class="main-stat">{{ stats.totalUsers }}</div>
                <div class="sub-stats">
                  <div class="sub-stat">
                    <span class="label">Actifs:</span>
                    <span class="value">{{ healthStats.activeUsers }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="overview-card lieux">
              <div class="card-header">
                <mat-icon>home</mat-icon>
                <h3>Lieux</h3>
              </div>
              <div class="card-stats">
                <div class="main-stat">{{ stats.totalLieux }}</div>
                <div class="sub-stats">
                  <div class="sub-stat">
                    <span class="label">Validés:</span>
                    <span class="value">{{ stats.validatedLieux }}</span>
                  </div>
                  <div class="sub-stat">
                    <span class="label">En attente:</span>
                    <span class="value pending">{{ stats.pendingLieux }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="overview-card reservations">
              <div class="card-header">
                <mat-icon>event</mat-icon>
                <h3>Réservations</h3>
              </div>
              <div class="card-stats">
                <div class="main-stat">{{ stats.totalReservations }}</div>
                <div class="sub-stats">
                  <div class="sub-stat">
                    <span class="label">Confirmées:</span>
                    <span class="value">{{ stats.confirmedReservations }}</span>
                  </div>
                  <div class="sub-stat">
                    <span class="label">En attente:</span>
                    <span class="value pending">{{ stats.pendingReservations }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="overview-card reviews">
              <div class="card-header">
                <mat-icon>star</mat-icon>
                <h3>Avis</h3>
              </div>
              <div class="card-stats">
                <div class="main-stat">{{ stats.totalReviews }}</div>
                <div class="sub-stats">
                  <div class="sub-stat">
                    <span class="label">Note moyenne:</span>
                    <span class="value rating">{{ stats.averageRating.toFixed(1) }}/5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Distribution Charts -->
        <div class="distribution-section">
          <h2 class="section-title">Répartition</h2>
          <div class="distribution-grid">
            <!-- User Role Distribution -->
            <mat-card class="distribution-card">
              <div class="card-header">
                <mat-icon>people</mat-icon>
                <h3>Répartition par Rôle</h3>
              </div>
              <div class="distribution-content">
                <div class="distribution-chart">
                  <div class="chart-placeholder">
                    <div *ngFor="let role of getUserRoleEntries()" class="chart-item">
                      <div class="chart-bar" 
                           [style.width.%]="getPercentage(role.count, getTotalUsers())"
                           [class]="'role-' + role.role.toLowerCase()">
                      </div>
                      <div class="chart-label">
                        <span class="role-name">{{ getRoleLabel(role.role) }}</span>
                        <span class="role-count">{{ role.count }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </mat-card>

            <!-- Lieu Type Distribution -->
            <mat-card class="distribution-card">
              <div class="card-header">
                <mat-icon>home</mat-icon>
                <h3>Types de Lieux</h3>
              </div>
              <div class="distribution-content">
                <div class="distribution-chart">
                  <div class="chart-placeholder">
                    <div *ngFor="let type of getLieuTypeEntries()" class="chart-item">
                      <div class="chart-bar" 
                           [style.width.%]="getPercentage(type.count, getTotalLieux())"
                           [class]="'type-' + type.type.toLowerCase()">
                      </div>
                      <div class="chart-label">
                        <span class="type-name">{{ type.type }}</span>
                        <span class="type-count">{{ type.count }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </mat-card>
          </div>
        </div>

        <!-- System Health -->
        <div class="health-section">
          <h2 class="section-title">État du Système</h2>
          <mat-card class="health-card">
            <div class="health-content">
              <div class="health-indicator">
                <div class="indicator-icon good">
                  <mat-icon>health_and_safety</mat-icon>
                </div>
                <div class="indicator-text">
                  <h3>Système Opérationnel</h3>
                  <p>Tous les services fonctionnent correctement</p>
                </div>
              </div>
              
              <div class="health-metrics">
                <div class="metric">
                  <div class="metric-icon">
                    <mat-icon>people</mat-icon>
                  </div>
                  <div class="metric-content">
                    <span class="metric-value">{{ healthStats.activeUsers }}</span>
                    <span class="metric-label">Utilisateurs Actifs</span>
                  </div>
                </div>
                
                <div class="metric">
                  <div class="metric-icon">
                    <mat-icon>home</mat-icon>
                  </div>
                  <div class="metric-content">
                    <span class="metric-value">{{ healthStats.activeLieux }}</span>
                    <span class="metric-label">Lieux Actifs</span>
                  </div>
                </div>
                
                <div class="metric">
                  <div class="metric-icon">
                    <mat-icon>event</mat-icon>
                  </div>
                  <div class="metric-content">
                    <span class="metric-value">{{ healthStats.recentReservations }}</span>
                    <span class="metric-label">Réservations Récentes</span>
                  </div>
                </div>
              </div>
            </div>
          </mat-card>
        </div>

        <!-- Performance Metrics -->
        <div class="performance-section">
          <h2 class="section-title">Métriques de Performance</h2>
          <div class="performance-grid">
            <mat-card class="performance-card">
              <div class="card-header">
                <mat-icon>trending_up</mat-icon>
                <h3>Taux de Conversion</h3>
              </div>
              <div class="performance-content">
                <div class="performance-metric">
                  <div class="metric-value">{{ getConversionRate() }}%</div>
                  <div class="metric-description">Réservations confirmées / Total</div>
                </div>
              </div>
            </mat-card>

            <mat-card class="performance-card">
              <div class="card-header">
                <mat-icon>verified</mat-icon>
                <h3>Taux de Validation</h3>
              </div>
              <div class="performance-content">
                <div class="performance-metric">
                  <div class="metric-value">{{ getValidationRate() }}%</div>
                  <div class="metric-description">Lieux validés / Total</div>
                </div>
              </div>
            </mat-card>

            <mat-card class="performance-card">
              <div class="card-header">
                <mat-icon>star</mat-icon>
                <h3>Satisfaction Client</h3>
              </div>
              <div class="performance-content">
                <div class="performance-metric">
                  <div class="metric-value">{{ stats.averageRating.toFixed(1) }}/5</div>
                  <div class="metric-description">Note moyenne des avis</div>
                </div>
              </div>
            </mat-card>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .statistics-dashboard {
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

    .statistics-content {
      padding: 0 32px 32px;
    }

    .section-title {
      color: #667eea;
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 24px;
      text-shadow: 0 2px 4px rgba(102, 126, 234, 0.1);
    }

    .overview-section {
      margin-bottom: 48px;
    }

    .overview-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
    }

    .overview-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
    }

    .overview-card:hover {
      transform: translateY(-4px);
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .card-header mat-icon {
      font-size: 24px;
      color: #667eea;
    }

    .card-header h3 {
      margin: 0;
      color: #2d3748;
      font-weight: 600;
    }

    .main-stat {
      font-size: 2.5rem;
      font-weight: 700;
      color: #2d3748;
      margin-bottom: 12px;
    }

    .sub-stats {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .sub-stat {
      display: flex;
      justify-content: space-between;
      font-size: 0.875rem;
    }

    .sub-stat .label {
      color: #718096;
    }

    .sub-stat .value {
      color: #2d3748;
      font-weight: 600;
    }

    .sub-stat .value.pending {
      color: #f56565;
    }

    .sub-stat .value.rating {
      color: #ed8936;
    }

    .distribution-section, .health-section, .performance-section {
      margin-bottom: 48px;
    }

    .distribution-grid, .performance-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 24px;
    }

    .distribution-card, .health-card, .performance-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .distribution-content, .health-content, .performance-content {
      padding: 24px;
    }

    .chart-placeholder {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .chart-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .chart-bar {
      height: 20px;
      border-radius: 10px;
      transition: width 0.3s ease;
    }

    .chart-bar.role-admin { background: linear-gradient(135deg, #667eea, #764ba2); }
    .chart-bar.role-proprietaire { background: linear-gradient(135deg, #f093fb, #f5576c); }
    .chart-bar.role-locataire { background: linear-gradient(135deg, #4facfe, #00f2fe); }

    .chart-bar.type-appartement { background: linear-gradient(135deg, #667eea, #764ba2); }
    .chart-bar.type-maison { background: linear-gradient(135deg, #f093fb, #f5576c); }
    .chart-bar.type-villa { background: linear-gradient(135deg, #4facfe, #00f2fe); }
    .chart-bar.type-studio { background: linear-gradient(135deg, #43e97b, #38f9d7); }

    .chart-label {
      display: flex;
      justify-content: space-between;
      font-size: 0.875rem;
    }

    .role-name, .type-name {
      color: #4a5568;
      font-weight: 500;
    }

    .role-count, .type-count {
      color: #2d3748;
      font-weight: 600;
    }

    .health-indicator {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }

    .indicator-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .indicator-icon.good {
      background: linear-gradient(135deg, #48bb78, #38f9d7);
    }

    .indicator-text h3 {
      margin: 0 0 4px 0;
      color: #2d3748;
      font-weight: 600;
    }

    .indicator-text p {
      margin: 0;
      color: #718096;
    }

    .health-metrics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 24px;
    }

    .metric {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: rgba(0, 0, 0, 0.05);
      border-radius: 12px;
    }

    .metric-icon {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .metric-content {
      display: flex;
      flex-direction: column;
    }

    .metric-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #2d3748;
    }

    .metric-label {
      font-size: 0.875rem;
      color: #718096;
    }

    .performance-metric {
      text-align: center;
    }

    .performance-metric .metric-value {
      font-size: 3rem;
      font-weight: 700;
      color: #667eea;
      display: block;
      margin-bottom: 8px;
    }

    .metric-description {
      color: #718096;
      font-size: 0.875rem;
    }

    ::ng-deep .mat-mdc-raised-button {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
    }
  `]
})
export class AdminStatisticsComponent implements OnInit {
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
  
  userRoleDistribution: UserRoleDistribution = {};
  lieuTypeDistribution: LieuTypeDistribution = {};
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
    
    Promise.all([
      this.adminService.getDashboardStats().toPromise(),
      this.adminService.getUserRoleDistribution().toPromise(),
      this.adminService.getLieuTypeDistribution().toPromise(),
      this.adminService.getSystemHealth().toPromise()
    ]).then(([stats, userRoles, lieuTypes, health]) => {
      if (stats) this.stats = stats;
      if (userRoles) this.userRoleDistribution = userRoles;
      if (lieuTypes) this.lieuTypeDistribution = lieuTypes;
      if (health) this.healthStats = health;
      
      this.loading = false;
      this.cdr.detectChanges();
    }).catch(error => {
      console.error('Error loading statistics:', error);
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  getUserRoleEntries(): Array<{role: string, count: number}> {
    return Object.entries(this.userRoleDistribution).map(([role, count]) => ({
      role,
      count
    }));
  }

  getLieuTypeEntries(): Array<{type: string, count: number}> {
    return Object.entries(this.lieuTypeDistribution).map(([type, count]) => ({
      type,
      count
    }));
  }

  getTotalUsers(): number {
    return Object.values(this.userRoleDistribution).reduce((sum, count) => sum + count, 0);
  }

  getTotalLieux(): number {
    return Object.values(this.lieuTypeDistribution).reduce((sum, count) => sum + count, 0);
  }

  getPercentage(value: number, total: number): number {
    return total > 0 ? (value / total) * 100 : 0;
  }

  getRoleLabel(role: string): string {
    const labels: { [key: string]: string } = {
      'ADMIN': 'Administrateurs',
      'PROPRIETAIRE': 'Propriétaires',
      'LOCATAIRE': 'Locataires'
    };
    return labels[role] || role;
  }

  getConversionRate(): number {
    return this.stats.totalReservations > 0 
      ? Math.round((this.stats.confirmedReservations / this.stats.totalReservations) * 100)
      : 0;
  }

  getValidationRate(): number {
    return this.stats.totalLieux > 0 
      ? Math.round((this.stats.validatedLieux / this.stats.totalLieux) * 100)
      : 0;
  }

  refreshData(): void {
    this.loadData();
  }
}