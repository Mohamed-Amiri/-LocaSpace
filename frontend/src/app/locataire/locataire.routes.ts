import { Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

export const LOCATAIRE_ROUTES: Routes = [
    // Simple test route
    {
        path: 'simple-test',
        loadComponent: () => import('./simple-test/simple-test.component').then(m => m.SimpleTestComponent),
        title: 'Simple Test - LocaSpace'
    },
    // Direct routes for easier access
    {
        path: 'tenant-search',
        loadComponent: () => import('../search/search').then(m => m.SearchComponent),
        title: 'Recherche de logements - LocaSpace'
    },
    {
        path: 'place-details/:id',
        loadComponent: () => import('./place-details/place-details.component').then(m => m.PlaceDetailsComponent),
        title: 'Détails du logement - LocaSpace'
    },
    {
        path: 'booking-confirm',
        loadComponent: () => import('./booking-confirm/booking-confirm.component').then(m => m.BookingConfirmComponent),
        title: 'Confirmer la réservation - LocaSpace'
    },
    {
        path: 'reservations',
        loadComponent: () => import('./reservations/reservations.component').then(m => m.ReservationsComponent),
        title: 'Mes réservations - LocaSpace'
    }
];

// Separate route for the locataire module
export const LOCATAIRE_MODULE_ROUTE: Routes = [
    {
        path: 'locataire',
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./tenant-dashboard/tenant-dashboard.component').then(m => m.TenantDashboardComponent),
                canActivate: [AuthGuard],
                data: { roles: ['tenant'] },
                title: 'Tableau de bord - LocaSpace'
            },
            {
                path: 'search',
                loadComponent: () => import('../search/search').then(m => m.SearchComponent),
                title: 'Recherche de logements - LocaSpace'
            },
            {
                path: 'place/:id',
                loadComponent: () => import('./place-details/place-details.component').then(m => m.PlaceDetailsComponent),
                title: 'Détails du logement - LocaSpace'
            },
            {
                path: 'booking-confirm',
                loadComponent: () => import('./booking-confirm/booking-confirm.component').then(m => m.BookingConfirmComponent),
                title: 'Confirmer la réservation - LocaSpace'
            },
            {
                path: 'reservations',
                loadComponent: () => import('./reservations/reservations.component').then(m => m.ReservationsComponent),
                canActivate: [AuthGuard],
                data: { roles: ['tenant'] },
                title: 'Mes réservations - LocaSpace'
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    }
];