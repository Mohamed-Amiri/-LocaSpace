import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { AuthService } from './auth/auth.service';

interface MenuItem {
  label: string;
  route: string;
  icon: string;
  roles?: string[];
}

interface User {
  name: string;
  role: string;
  avatar: string;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss']
})
export class AppLayoutComponent implements OnInit {
  sidebarCollapsed = false;
  searchQuery = '';
  pageTitle = 'Dashboard';
  showSearch = false;
  userRole: 'admin' | 'owner' | 'tenant' = 'owner';

  currentUser: User = {
    name: 'Pierre Martin',
    role: 'Propriétaire',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  };

  // Menu items based on user role
  get menuItems(): MenuItem[] {
    if (this.userRole === 'admin') {
      return [
        { label: 'Dashboard', route: '/admin/dashboard', icon: 'fas fa-tachometer-alt' },
        { label: 'Utilisateurs', route: '/admin/users', icon: 'fas fa-users' },
        { label: 'Espaces', route: '/admin/spaces', icon: 'fas fa-home' },
        { label: 'Réservations', route: '/admin/reservations', icon: 'fas fa-calendar-alt' },
        { label: 'Revenus', route: '/admin/earnings', icon: 'fas fa-euro-sign' },
        { label: 'Rapports', route: '/admin/reports', icon: 'fas fa-chart-bar' },
        { label: 'Paramètres', route: '/admin/settings', icon: 'fas fa-cog' }
      ];
    } else if (this.userRole === 'owner') {
      return [
        { label: 'Dashboard', route: '/proprietaire/dashboard', icon: 'fas fa-tachometer-alt' },
        { label: 'Mes Propriétés', route: '/proprietaire/properties', icon: 'fas fa-home' },
        { label: 'Réservations', route: '/proprietaire/reservations', icon: 'fas fa-calendar-check' },
        { label: 'Revenus', route: '/proprietaire/earnings', icon: 'fas fa-euro-sign' },
        { label: 'Disponibilité', route: '/proprietaire/availability', icon: 'fas fa-calendar' },
        { label: 'Outils de Prix', route: '/proprietaire/pricing', icon: 'fas fa-tags' },
        { label: 'Avis', route: '/proprietaire/reviews', icon: 'fas fa-star' },
        { label: 'Messages', route: '/proprietaire/messages', icon: 'fas fa-envelope' }
      ];
    } else { // tenant
      return [
        { label: 'Rechercher', route: '/locataire/dashboard', icon: 'fas fa-search' },
        { label: 'Mes Réservations', route: '/locataire/reservations', icon: 'fas fa-calendar-check' },
        { label: 'Favoris', route: '/locataire/favorites', icon: 'fas fa-heart' },
        { label: 'Messages', route: '/locataire/messages', icon: 'fas fa-envelope' },
        { label: 'Profil', route: '/locataire/profile', icon: 'fas fa-user' }
      ];
    }
  }

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    // Update page title based on current route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updatePageTitle(event.url);
      this.updateUserInfo();
    });

    // Set initial page title
    this.updatePageTitle(this.router.url);
    this.updateUserInfo();
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  logout() {
    // Use AuthService logout which now automatically redirects to home
    this.authService.logout();
  }

  private updatePageTitle(url: string) {
    if (url.includes('/admin')) {
      if (url.includes('/dashboard')) {
        this.pageTitle = 'Tableau de bord Administrateur';
      } else if (url.includes('/users')) {
        this.pageTitle = 'Gestion des Utilisateurs';
      } else if (url.includes('/spaces')) {
        this.pageTitle = 'Gestion des Espaces';
      } else {
        this.pageTitle = 'Administration';
      }
    } else if (url.includes('/proprietaire')) {
      if (url.includes('/dashboard')) {
        this.pageTitle = 'Tableau de bord Propriétaire';
      } else if (url.includes('/properties')) {
        this.pageTitle = 'Mes Propriétés';
      } else if (url.includes('/reservations')) {
        this.pageTitle = 'Mes Réservations';
      } else {
        this.pageTitle = 'Propriétaire';
      }
    } else if (url.includes('/locataire')) {
      if (url.includes('/dashboard')) {
        this.pageTitle = 'Rechercher des espaces';
      } else if (url.includes('/reservations')) {
        this.pageTitle = 'Mes Réservations';
      } else {
        this.pageTitle = 'Locataire';
      }
    }
  }

  private updateUserInfo() {
    // Update user info based on current role/route
    if (this.router.url.includes('/admin')) {
      this.currentUser = {
        name: 'Pierre Martin',
        role: 'Administrateur',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
      };
      this.userRole = 'admin';
    } else if (this.router.url.includes('/proprietaire')) {
      this.currentUser = {
        name: 'Pierre Martin',
        role: 'Propriétaire',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
      };
      this.userRole = 'owner';
    } else if (this.router.url.includes('/locataire')) {
      this.currentUser = {
        name: 'Pierre Martin',
        role: 'Locataire',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
      };
      this.userRole = 'tenant';
      this.showSearch = true;
    }
  }
}