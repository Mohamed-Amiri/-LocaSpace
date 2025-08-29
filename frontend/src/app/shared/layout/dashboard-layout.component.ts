import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';

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
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss']
})
export class DashboardLayoutComponent implements OnInit {
  @Input() userRole: 'admin' | 'tenant' = 'tenant';
  @Input() showSearch: boolean = false;
  
  sidebarCollapsed = false;
  searchQuery = '';
  pageTitle = 'Dashboard';
  
  currentUser: User = {
    name: 'Pierre Martin',
    role: 'Propriétaire',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  };

  // Menu items based on user role
  get menuItems(): MenuItem[] {
    const baseItems: MenuItem[] = [];
    
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

    } else { // tenant
      return [
        { label: 'Rechercher', route: '/locataire/search', icon: 'fas fa-search' },
        { label: 'Mes Réservations', route: '/locataire/reservations', icon: 'fas fa-calendar-check' },
        { label: 'Favoris', route: '/tenant/favorites', icon: 'fas fa-heart' },
        { label: 'Messages', route: '/tenant/messages', icon: 'fas fa-envelope' },
        { label: 'Profil', route: '/tenant/profile', icon: 'fas fa-user' }
      ];
    }
  }

  constructor(private router: Router, private authService: AuthService) {}

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

  isActiveRoute(route: string): boolean {
    return this.router.url.includes(route);
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

    } else if (url.includes('/tenant') || url.includes('/locataire')) {
      if (url.includes('/search')) {
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

    } else if (this.router.url.includes('/tenant') || this.router.url.includes('/locataire')) {
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