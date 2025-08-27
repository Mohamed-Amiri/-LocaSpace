import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AdminService, AdminUser } from '../services/admin.service';

@Component({
  selector: 'app-admin-user-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <div class="user-management">
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
              <mat-icon class="header-icon">people</mat-icon>
            </div>
            <div class="header-text">
              <h1 class="page-title">Gestion des Utilisateurs</h1>
              <p>Gérez les comptes utilisateurs du système</p>
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
        <p>Chargement des utilisateurs...</p>
      </div>

      <!-- Content -->
      <div *ngIf="!loading" class="content-container">
        <!-- Stats Cards -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon total">
              <mat-icon>people</mat-icon>
            </div>
            <div class="stat-content">
              <h3>{{ totalUsers }}</h3>
              <p>Total Utilisateurs</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon proprietaires">
              <mat-icon>business</mat-icon>
            </div>
            <div class="stat-content">
              <h3>{{ proprietaireCount }}</h3>
              <p>Propriétaires</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon locataires">
              <mat-icon>person</mat-icon>
            </div>
            <div class="stat-content">
              <h3>{{ locataireCount }}</h3>
              <p>Locataires</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon blocked">
              <mat-icon>block</mat-icon>
            </div>
            <div class="stat-content">
              <h3>{{ blockedCount }}</h3>
              <p>Bloqués</p>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="filters-section">
          <mat-card class="filters-card">
            <div class="filters-content">
              <mat-form-field appearance="outline">
                <mat-label>Rechercher</mat-label>
                <input matInput [(ngModel)]="searchTerm" (input)="filterUsers()" placeholder="Nom ou email">
                <mat-icon matSuffix>search</mat-icon>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Filtrer par rôle</mat-label>
                <mat-select [(ngModel)]="roleFilter" (selectionChange)="filterUsers()">
                  <mat-option value="">Tous</mat-option>
                  <mat-option value="LOCATAIRE">Locataires</mat-option>
                  <mat-option value="PROPRIETAIRE">Propriétaires</mat-option>
                  <mat-option value="ADMIN">Administrateurs</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Statut</mat-label>
                <mat-select [(ngModel)]="statusFilter" (selectionChange)="filterUsers()">
                  <mat-option value="">Tous</mat-option>
                  <mat-option value="active">Actifs</mat-option>
                  <mat-option value="blocked">Bloqués</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
          </mat-card>
        </div>

        <!-- Users List -->
        <div class="users-grid">
          <mat-card *ngFor="let user of filteredUsers" class="user-card">
            <div class="user-header">
              <div class="user-avatar">
                <mat-icon>person</mat-icon>
              </div>
              <div class="user-info">
                <h3>{{ user.nom }}</h3>
                <p>{{ user.email }}</p>
              </div>
              <div class="user-status">
                <mat-chip 
                  [class.role-admin]="user.role === 'ADMIN'"
                  [class.role-proprietaire]="user.role === 'PROPRIETAIRE'"
                  [class.role-locataire]="user.role === 'LOCATAIRE'">
                  {{ getRoleLabel(user.role) }}
                </mat-chip>
                <mat-chip 
                  *ngIf="user.blocked" 
                  class="status-blocked">
                  Bloqué
                </mat-chip>
              </div>
            </div>

            <div class="user-details">
              <div class="detail-row">
                <mat-icon>event</mat-icon>
                <span>Inscrit le {{ formatDate(user.createdAt) }}</span>
              </div>
              <div class="detail-row" *ngIf="user.lastLogin">
                <mat-icon>schedule</mat-icon>
                <span>Dernière connexion: {{ formatDate(user.lastLogin) }}</span>
              </div>
            </div>

            <div class="user-actions">
              <button 
                mat-stroked-button 
                [color]="user.blocked ? 'primary' : 'warn'"
                (click)="toggleBlockUser(user)"
                [disabled]="processingUsers.has(user.id)">
                <mat-icon>{{ user.blocked ? 'check_circle' : 'block' }}</mat-icon>
                {{ user.blocked ? 'Débloquer' : 'Bloquer' }}
              </button>
              
              <button 
                mat-stroked-button 
                color="accent"
                (click)="changeRole(user)"
                [disabled]="processingUsers.has(user.id) || user.role === 'ADMIN'">
                <mat-icon>admin_panel_settings</mat-icon>
                Changer Rôle
              </button>
              
              <button 
                mat-stroked-button 
                color="warn"
                (click)="confirmDeleteUser(user)"
                [disabled]="processingUsers.has(user.id) || user.role === 'ADMIN'">
                <mat-icon>delete</mat-icon>
                Supprimer
              </button>
            </div>
          </mat-card>
        </div>

        <!-- Empty State -->
        <div *ngIf="filteredUsers.length === 0" class="empty-state">
          <mat-icon class="empty-icon">people_outline</mat-icon>
          <h2>Aucun utilisateur trouvé</h2>
          <p>Aucun utilisateur ne correspond aux critères de recherche.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .user-management {
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
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .stat-icon.total { background: linear-gradient(135deg, #667eea, #764ba2); }
    .stat-icon.proprietaires { background: linear-gradient(135deg, #f093fb, #f5576c); }
    .stat-icon.locataires { background: linear-gradient(135deg, #4facfe, #00f2fe); }
    .stat-icon.blocked { background: linear-gradient(135deg, #fa709a, #fee140); }

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

    .filters-section {
      margin-bottom: 32px;
    }

    .filters-card {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(20px);
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .filters-content {
      padding: 24px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .users-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 24px;
    }

    .user-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .user-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
    }

    .user-header {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 24px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }

    .user-avatar {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .user-info {
      flex: 1;
    }

    .user-info h3 {
      margin: 0 0 4px 0;
      color: #2d3748;
      font-weight: 600;
    }

    .user-info p {
      margin: 0;
      color: #718096;
      font-size: 0.875rem;
    }

    .user-status {
      display: flex;
      flex-direction: column;
      gap: 4px;
      align-items: flex-end;
    }

    .role-admin { background: #667eea; color: white; }
    .role-proprietaire { background: #f093fb; color: white; }
    .role-locataire { background: #4facfe; color: white; }
    .status-blocked { background: #f56565; color: white; }

    .user-details {
      padding: 16px 24px;
    }

    .detail-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      color: #4a5568;
      font-size: 0.875rem;
    }

    .detail-row:last-child {
      margin-bottom: 0;
    }

    .user-actions {
      display: flex;
      gap: 8px;
      padding: 16px 24px;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      flex-wrap: wrap;
    }

    .user-actions button {
      flex: 1;
      min-width: 120px;
      padding: 8px 16px;
      font-size: 0.875rem;
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
      color: #cbd5e0;
      margin-bottom: 16px;
    }

    .empty-state h2 {
      color: #2d3748;
      margin-bottom: 8px;
    }

    .empty-state p {
      color: #718096;
    }

    ::ng-deep .mat-mdc-form-field {
      margin-bottom: 0;
    }

    ::ng-deep .mat-mdc-raised-button {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
    }
  `]
})
export class AdminUserManagementComponent implements OnInit {
  loading = true;
  users: AdminUser[] = [];
  filteredUsers: AdminUser[] = [];
  processingUsers = new Set<number>();
  
  searchTerm = '';
  roleFilter = '';
  statusFilter = '';

  constructor(
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  get totalUsers(): number {
    return this.users.length;
  }

  get proprietaireCount(): number {
    return this.users.filter(u => u.role === 'PROPRIETAIRE').length;
  }

  get locataireCount(): number {
    return this.users.filter(u => u.role === 'LOCATAIRE').length;
  }

  get blockedCount(): number {
    return this.users.filter(u => u.blocked).length;
  }

  loadUsers(): void {
    this.loading = true;
    this.adminService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filterUsers();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loading = false;
        this.snackBar.open('Erreur lors du chargement des utilisateurs', 'Fermer', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.cdr.detectChanges();
      }
    });
  }

  filterUsers(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = !this.searchTerm || 
        user.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesRole = !this.roleFilter || user.role === this.roleFilter;
      
      const matchesStatus = !this.statusFilter || 
        (this.statusFilter === 'active' && !user.blocked) ||
        (this.statusFilter === 'blocked' && user.blocked);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }

  toggleBlockUser(user: AdminUser): void {
    this.processingUsers.add(user.id);
    this.adminService.blockUser(user.id).subscribe({
      next: () => {
        user.blocked = !user.blocked;
        this.processingUsers.delete(user.id);
        this.snackBar.open(
          `Utilisateur ${user.blocked ? 'bloqué' : 'débloqué'} avec succès`,
          'Fermer',
          { duration: 3000, panelClass: ['success-snackbar'] }
        );
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error toggling user block:', error);
        this.processingUsers.delete(user.id);
        this.snackBar.open('Erreur lors de la modification du statut', 'Fermer', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.cdr.detectChanges();
      }
    });
  }

  changeRole(user: AdminUser): void {
    // Implementation for role change dialog would go here
    this.snackBar.open('Fonctionnalité de changement de rôle en développement', 'Fermer', {
      duration: 3000
    });
  }

  confirmDeleteUser(user: AdminUser): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${user.nom}" ? Cette action est irréversible.`)) {
      this.deleteUser(user);
    }
  }

  deleteUser(user: AdminUser): void {
    this.processingUsers.add(user.id);
    this.adminService.deleteUser(user.id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== user.id);
        this.filterUsers();
        this.processingUsers.delete(user.id);
        this.snackBar.open(`Utilisateur "${user.nom}" supprimé avec succès`, 'Fermer', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error deleting user:', error);
        this.processingUsers.delete(user.id);
        this.snackBar.open('Erreur lors de la suppression', 'Fermer', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.cdr.detectChanges();
      }
    });
  }

  getRoleLabel(role: string): string {
    const labels: { [key: string]: string } = {
      'ADMIN': 'Admin',
      'PROPRIETAIRE': 'Propriétaire',
      'LOCATAIRE': 'Locataire'
    };
    return labels[role] || role;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR');
  }

  refreshData(): void {
    this.loadUsers();
  }
}