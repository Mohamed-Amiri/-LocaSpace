import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../theme/theme.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(private theme: ThemeService, public authService: AuthService) {}
  isMenuOpen = false;

  get isDark() { return this.theme.isDarkMode(); }
  get isDarkMode() { return this.theme.isDarkMode(); }

  toggleTheme() {
    this.theme.toggleTheme();
    document.body.classList.toggle('dark-mode');
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  debugNavigation(page: string) {
    console.log(`Header - Attempting to navigate to ${page}`);
    console.log('Current URL:', window.location.href);
    console.log('Current user:', this.authService.currentUser);
    console.log('Is authenticated:', this.authService.isAuthenticated);
    console.log('LocalStorage currentUser:', localStorage.getItem('currentUser'));
    console.log('LocalStorage token:', localStorage.getItem('token'));
  }

  logout() {
    this.authService.logout();
  }
}
