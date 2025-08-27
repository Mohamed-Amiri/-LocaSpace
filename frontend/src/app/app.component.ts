import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastService } from './shared/components/toast/toast.service';
import { ThemeService } from './shared/theme/theme.service';
import { routeSlideAnimation } from './shared/animations/slide.animation';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <app-header></app-header>
    <router-outlet></router-outlet>
    <button class="chat-button">Chat Support</button>
    <app-chat></app-chat>
    
    <!-- Toast Container -->
    <div class="toast-container">
        <app-toast></app-toast>
    </div>
  `,
  styles: [`
    @use './app.scss';

    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: var(--background);
      color: var(--text);
      transition: background-color 0.3s ease, color 0.3s ease;
    }

    main {
      flex: 1;
      position: relative;
      overflow-x: hidden;
    }

    .toast-container {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      z-index: 1000;
    }

    /* Dark theme styles */
    .dark {
      --background: var(--dark-background);
      --text: var(--dark-text);
    }
  `],
  animations: [routeSlideAnimation],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent implements OnInit {
  isDarkTheme = false;

  constructor(
    private themeService: ThemeService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    // Subscribe to theme changes
    this.themeService.isDarkTheme$.subscribe(
      isDark => this.isDarkTheme = isDark
    );

    // Initialize theme from local storage
    this.themeService.initializeTheme();
  }

  getRouteState(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['animation'] || 'initial';
  }
}
