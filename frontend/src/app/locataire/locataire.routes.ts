import { Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { Component } from '@angular/core';

@Component({
  selector: 'app-test-simple',
  standalone: true,
  template: '<h1>Test Route Works!</h1>'
})
class TestSimpleComponent {}

// Direct tenant routes - flat structure for better routing
export const LOCATAIRE_ROUTES: Routes = [
    {
        path: 'locataire/dashboard',
        loadComponent: () => import('./tenant-dashboard/tenant-dashboard.component').then(m => m.TenantDashboardComponent),
        canActivate: [AuthGuard],
        data: { roles: ['tenant'] },
        title: 'Tableau de bord - LocaSpace'
    },
    {
        path: 'locataire/search',
        loadComponent: () => import('./tenant-search/tenant-search.component').then(m => m.TenantSearchComponent),
        canActivate: [AuthGuard],
        data: { roles: ['tenant'] },
        title: 'Mes propriétés - LocaSpace'
    },
    {
        path: 'locataire/place/:id',
        loadComponent: () => import('./place-details/place-details.component').then(m => m.PlaceDetailsComponent),
        title: 'Détails du logement - LocaSpace'
    },
    {
        path: 'locataire/booking-confirm',
        loadComponent: () => import('./booking-confirm/booking-confirm.component').then(m => m.BookingConfirmComponent),
        title: 'Confirmer la réservation - LocaSpace'
    },
    {
        path: 'locataire/reservations',
        loadComponent: () => import('./reservations/reservations.component').then(m => m.ReservationsComponent),
        title: 'Mes réservations - LocaSpace'
    },
    {
        path: 'locataire/test-reservations',
        loadComponent: () => import('./reservations/reservations.component').then(m => m.ReservationsComponent),
        title: 'Test Mes réservations - LocaSpace'
    },
    {
        path: 'locataire/test-simple',
        component: TestSimpleComponent,
        title: 'Simple Test - LocaSpace'
    },
    {
        path: 'locataire',
        redirectTo: 'locataire/dashboard',
        pathMatch: 'full'
    }
];

// Export the same routes as the main module route for consistency
export const LOCATAIRE_MODULE_ROUTE = LOCATAIRE_ROUTES;