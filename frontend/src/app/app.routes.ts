import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { AUTH_ROUTES } from './auth/auth.routes';
import { LOCATAIRE_ROUTES } from './locataire/locataire.routes';
import { proprietairesRoutes } from './proprietaires/proprietaires.routes';


const Home = () => import('./home/home.component').then(m => m.HomeComponent);
const LieuSearch = () => import('./lieux/lieu-search/lieu-search.component').then(m => m.LieuSearchComponent);
const LieuList = () => import('./lieux/lieu-list/lieu-list.component').then(m => m.LieuListComponent);
const LieuDetail = () => import('./lieux/lieu-detail/lieu-detail.component').then(m => m.LieuDetailComponent);
const ReservationWizard = () => import('./reservation/reservation-wizard/reservation-wizard.component').then(m => m.ReservationWizardComponent);



const AvailabilityCalendar = () => import('./availability-calendar/availability-calendar.component').then(m => m.AvailabilityCalendarComponent);
const About = () => import('./static/about/about.component').then(m => m.AboutComponent);
const Contact = () => import('./static/contact/contact.component').then(m => m.ContactComponent);
const Terms = () => import('./static/terms/terms.component').then(m => m.TermsComponent);
const Privacy = () => import('./static/privacy/privacy.component').then(m => m.PrivacyComponent);
const NotFound = () => import('./static/not-found/not-found.component').then(m => m.NotFoundComponent);

export const routes: Routes = [
  {
    path: '',
    loadComponent: Home,
    title: 'Accueil - LocaSpace'
  },
  {
    path: 'search',
    redirectTo: '/locataire/search',
    pathMatch: 'full'
  },
  {
    path: 'lieux',
    loadComponent: LieuSearch,
    title: 'Explorer les lieux - LocaSpace'
  },
  {
    path: 'lieux/:id',
    loadComponent: LieuDetail,
    title: 'Détails du lieu - LocaSpace'
  },
  {
    path: 'reservation/:id',
    loadComponent: ReservationWizard,
    canActivate: [AuthGuard],
    title: 'Réservation - LocaSpace'
  },

  // Routes locataire
  ...LOCATAIRE_ROUTES,

  // Routes propriétaires
  {
    path: 'proprietaires',
    children: proprietairesRoutes,
    canActivate: [AuthGuard],
    data: { roles: ['owner'] },
    title: 'Espace Propriétaire - LocaSpace'
  },



  // Routes d'authentification
  ...AUTH_ROUTES,

  // Global Profile Route
  {
    path: 'profil',
    loadComponent: () => import('./shared/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [AuthGuard],
    title: 'Mon Profil - LocaSpace'
  },

  // Pages statiques
  {
    path: 'about',
    loadComponent: About,
    title: 'À propos - LocaSpace'
  },
  {
    path: 'contact',
    loadComponent: Contact,
    title: 'Contact - LocaSpace'
  },
  {
    path: 'terms',
    loadComponent: Terms,
    title: 'Conditions d\'utilisation - LocaSpace'
  },
  {
    path: 'privacy',
    loadComponent: Privacy,
    title: 'Politique de confidentialité - LocaSpace'
  },
  // Page 404
  {
    path: '**',
    loadComponent: NotFound,
    title: 'Page non trouvée - LocaSpace'
  }
];