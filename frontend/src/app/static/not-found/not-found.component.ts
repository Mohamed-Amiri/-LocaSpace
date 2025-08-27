import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="not-found-page">
      <div class="container">
        <div class="not-found-content">
          <div class="error-code">404</div>
          <h1>Page non trouvée</h1>
          <p>Désolé, la page que vous recherchez n'existe pas ou a été déplacée.</p>
          
          <div class="actions">
            <a routerLink="/" class="btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
              Retour à l'accueil
            </a>
            
            <a routerLink="/search" class="btn-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
              Rechercher un espace
            </a>
          </div>

          <div class="help-section">
            <h3>Vous cherchez quelque chose ?</h3>
            <div class="help-links">
              <a routerLink="/contact">Contact</a>
              <a routerLink="/about">À propos</a>
              <a routerLink="/terms">Conditions d'utilisation</a>
              <a routerLink="/privacy">Politique de confidentialité</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .not-found-page {
      padding: 40px 0;
      background: #f8fafc;
      min-height: 100vh;
      display: flex;
      align-items: center;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .not-found-content {
      text-align: center;
      background: white;
      border-radius: 12px;
      padding: 60px 40px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    .error-code {
      font-size: 6rem;
      font-weight: 700;
      color: #3b82f6;
      line-height: 1;
      margin-bottom: 24px;
    }

    .not-found-content h1 {
      font-size: 2rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 16px;
    }

    .not-found-content p {
      font-size: 1.125rem;
      color: #6b7280;
      margin-bottom: 40px;
      line-height: 1.6;
    }

    .actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      margin-bottom: 40px;
      flex-wrap: wrap;
    }

    .btn-primary,
    .btn-secondary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.2s;
    }

    .btn-primary {
      background: #3b82f6;
      color: white;
    }

    .btn-primary:hover {
      background: #2563eb;
      transform: translateY(-1px);
    }

    .btn-secondary {
      background: white;
      color: #374151;
      border: 1px solid #d1d5db;
    }

    .btn-secondary:hover {
      background: #f9fafb;
      border-color: #9ca3af;
      transform: translateY(-1px);
    }

    .help-section {
      border-top: 1px solid #e5e7eb;
      padding-top: 32px;
    }

    .help-section h3 {
      font-size: 1.125rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 16px;
    }

    .help-links {
      display: flex;
      gap: 24px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .help-links a {
      color: #6b7280;
      text-decoration: none;
      font-size: 0.875rem;
      transition: color 0.2s;
    }

    .help-links a:hover {
      color: #3b82f6;
    }

    @media (max-width: 768px) {
      .not-found-content {
        padding: 40px 24px;
      }

      .error-code {
        font-size: 4rem;
      }

      .not-found-content h1 {
        font-size: 1.5rem;
      }

      .actions {
        flex-direction: column;
        align-items: center;
      }

      .btn-primary,
      .btn-secondary {
        width: 100%;
        max-width: 300px;
        justify-content: center;
      }

      .help-links {
        flex-direction: column;
        gap: 12px;
      }
    }
  `]
})
export class NotFoundComponent {} 