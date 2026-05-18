import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { AuthService, User as AuthUser } from './auth/auth.service';

interface MenuItem {
  label: string;
  route: string;
  icon: string;
  roles?: string[];
}

interface LayoutUser {
  name: string;
  role: string;
  avatar: string;
  initials: string;
}

import { MessagingPanelComponent } from './shared/messaging-panel/messaging-panel.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MessagingPanelComponent],
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss']
})
export class AppLayoutComponent implements OnInit {
  sidebarCollapsed = false;
  mobileMenuOpen = false;
  searchQuery = '';
  pageTitle = 'Dashboard';
  showSearch = false;
  userRole: 'owner' | 'tenant' = 'owner';
  notificationCount = 0;
  messagesOpen = false;

  currentUser: LayoutUser = {
    name: '',
    role: '',
    avatar: '',
    initials: ''
  };

  // Menu items based on user role
  get menuItems(): MenuItem[] {
    if (this.userRole === 'owner') {
      return [
        { label: 'Tableau de bord', route: '/proprietaires/dashboard', icon: 'ph ph-squares-four' },
        { label: 'Mes Propriétés', route: '/proprietaires/manage-properties', icon: 'ph ph-house' },
        { label: 'Demandes', route: '/proprietaires/booking-requests', icon: 'ph ph-inbox' },
        { label: 'Ajouter', route: '/proprietaires/add-property', icon: 'ph ph-plus-circle' },
      ];
    } else { // tenant
      return [
        { label: 'Mon Espace', route: '/locataire/dashboard', icon: 'ph ph-squares-four' },
        { label: 'Rechercher', route: '/locataire/search', icon: 'ph ph-magnifying-glass' },
        { label: 'Réservations', route: '/locataire/reservations', icon: 'ph ph-calendar-check' },
        { label: 'Favoris', route: '/locataire/favorites', icon: 'ph ph-heart' },
      ];
    }
  }

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    // Subscribe to real user data from AuthService
    this.authService.currentUser$.subscribe((user: AuthUser | null) => {
      if (user) {
        const firstName = user.firstName || '';
        const lastName = user.lastName || '';
        const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
        
        this.currentUser = {
          name: `${firstName} ${lastName}`.trim(),
          role: user.role === 'owner' ? 'Propriétaire' : 'Locataire',
          avatar: '',
          initials: initials || '?'
        };
        this.userRole = user.role === 'owner' ? 'owner' : 'tenant';
      }
    });

    // Update page title based on current route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updatePageTitle(event.url);
      // Close mobile menu on navigation
      this.mobileMenuOpen = false;
    });

    // Set initial page title
    this.updatePageTitle(this.router.url);
  }

  toggleSidebar() {
    if (window.innerWidth <= 768) {
      this.mobileMenuOpen = !this.mobileMenuOpen;
    } else {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    }
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }

  toggleNotifications() {
    // TODO: implement notification panel
    console.log('Toggle notifications');
  }

  toggleMessages() {
    this.messagesOpen = !this.messagesOpen;
    if (this.messagesOpen) {
      this.closeMobileMenu();
    }
  }

  logout() {
    this.authService.logout();
  }

  private updatePageTitle(url: string) {
    if (url.includes('/proprietaire')) {
      if (url.includes('/dashboard')) {
        this.pageTitle = 'Tableau de bord';
      } else if (url.includes('/manage-properties') || url.includes('/properties')) {
        this.pageTitle = 'Mes Propriétés';
      } else if (url.includes('/booking-requests')) {
        this.pageTitle = 'Demandes de Réservation';
      } else if (url.includes('/add-property')) {
        this.pageTitle = 'Ajouter une Propriété';
      } else {
        this.pageTitle = 'Propriétaire';
      }
    } else if (url.includes('/locataire')) {
      if (url.includes('/dashboard')) {
        this.pageTitle = 'Mon Espace';
      } else if (url.includes('/search')) {
        this.pageTitle = 'Rechercher';
      } else if (url.includes('/reservations')) {
        this.pageTitle = 'Mes Réservations';
      } else {
        this.pageTitle = 'Locataire';
      }
    }
  }
}