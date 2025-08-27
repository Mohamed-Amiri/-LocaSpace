import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { fadeInUpAnimation } from '../../shared/animations/fade.animation';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  animations: [fadeInUpAnimation],
  template: `
    <div class="about-page" [@fadeInUp]>
      <div class="hero-section">
        <div class="container">
          <h1>À propos de LocaSpace</h1>
          <p class="hero-subtitle">Votre partenaire de confiance pour la location d'espaces uniques</p>
        </div>
      </div>

      <div class="content-section">
        <div class="container">
          <div class="about-grid">
            <div class="about-text">
              <h2>Notre Mission</h2>
              <p>
                LocaSpace révolutionne la façon dont vous trouvez et louez des espaces. 
                Nous connectons les propriétaires d'espaces uniques avec des personnes 
                à la recherche du lieu parfait pour leurs événements, réunions ou projets créatifs.
              </p>
              
              <h3>Nos Valeurs</h3>
              <ul>
                <li><strong>Confiance</strong> - Vérification rigoureuse de tous nos espaces</li>
                <li><strong>Simplicité</strong> - Processus de réservation en quelques clics</li>
                <li><strong>Qualité</strong> - Sélection d'espaces exceptionnels</li>
                <li><strong>Support</strong> - Accompagnement 24/7</li>
              </ul>
            </div>
            
            <div class="stats-grid">
              <div class="stat-card">
                <h3>10,000+</h3>
                <p>Espaces disponibles</p>
              </div>
              <div class="stat-card">
                <h3>50,000+</h3>
                <p>Réservations réussies</p>
              </div>
              <div class="stat-card">
                <h3>98%</h3>
                <p>Satisfaction client</p>
              </div>
              <div class="stat-card">
                <h3>24/7</h3>
                <p>Support client</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .about-page {
      min-height: 100vh;
    }

    .hero-section {
      background: linear-gradient(135deg, #2563EB, #7C3AED);
      color: white;
      padding: 6rem 0 4rem;
      text-align: center;

      h1 {
        font-size: 3rem;
        margin-bottom: 1rem;
        font-weight: 700;
      }

      .hero-subtitle {
        font-size: 1.25rem;
        opacity: 0.9;
      }
    }

    .content-section {
      padding: 4rem 0;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .about-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 4rem;
      align-items: start;
    }

    .about-text {
      h2 {
        font-size: 2rem;
        margin-bottom: 1.5rem;
        color: #1f2937;
      }

      h3 {
        font-size: 1.5rem;
        margin: 2rem 0 1rem;
        color: #374151;
      }

      p {
        font-size: 1.125rem;
        line-height: 1.7;
        color: #6b7280;
        margin-bottom: 1.5rem;
      }

      ul {
        list-style: none;
        padding: 0;

        li {
          padding: 0.5rem 0;
          font-size: 1.125rem;
          color: #6b7280;
        }
      }
    }

    .stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    .stat-card {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      text-align: center;

      h3 {
        font-size: 2.5rem;
        font-weight: 700;
        color: #2563EB;
        margin-bottom: 0.5rem;
      }

      p {
        color: #6b7280;
        font-size: 0.875rem;
        margin: 0;
      }
    }

    @media (max-width: 768px) {
      .about-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .hero-section h1 {
        font-size: 2rem;
      }
    }
  `]
})
export class AboutComponent {}