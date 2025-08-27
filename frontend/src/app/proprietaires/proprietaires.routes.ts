import { Routes } from '@angular/router';

export const proprietairesRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./owner-dashboard/owner-dashboard.component').then(m => m.OwnerDashboardComponent)
  },
  {
    path: 'add-property',
    loadComponent: () => import('./add-property/add-property.component').then(m => m.AddPropertyComponent)
  },
  {
    path: 'manage-properties',
    loadComponent: () => import('./manage-properties/manage-properties.component').then(m => m.ManagePropertiesComponent)
  },
  {
    path: 'edit-property/:id',
    loadComponent: () => import('./edit-property/edit-property.component').then(m => m.EditPropertyComponent)
  },
  {
    path: 'booking-requests',
    loadComponent: () => import('./booking-requests/booking-requests.component').then(m => m.BookingRequestsComponent)
  },
  {
    path: 'calendar/:id',
    loadComponent: () => import('./property-calendar/property-calendar.component').then(m => m.PropertyCalendarComponent)
  }
];