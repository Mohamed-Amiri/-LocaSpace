import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    title: 'Tableau de bord Admin - LocaSpace'
  },
  {
    path: 'users',
    loadComponent: () => import('./admin-user-management/admin-user-management.component').then(m => m.AdminUserManagementComponent),
    title: 'Gestion des Utilisateurs - LocaSpace'
  },
  {
    path: 'validation',
    loadComponent: () => import('./admin-validation/admin-validation.component').then(m => m.AdminValidationComponent),
    title: 'Validation des Lieux - LocaSpace'
  },
  {
    path: 'statistics',
    loadComponent: () => import('./admin-statistics/admin-statistics.component').then(m => m.AdminStatisticsComponent),
    title: 'Statistiques - LocaSpace'
  }
];