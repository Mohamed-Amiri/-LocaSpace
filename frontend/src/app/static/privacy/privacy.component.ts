import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="privacy-page">
      <div class="container">
        <div class="privacy-header">
          <h1>Politique de confidentialité</h1>
          <p>Dernière mise à jour : 1er janvier 2024</p>
        </div>

        <div class="privacy-content">
          <section class="privacy-section">
            <h2>1. Collecte des informations</h2>
            <p>Nous collectons les informations suivantes :</p>
            <ul>
              <li>Informations d'identification (nom, email, téléphone)</li>
              <li>Informations de paiement (traitées de manière sécurisée)</li>
              <li>Données d'utilisation et de navigation</li>
              <li>Informations sur les réservations et préférences</li>
            </ul>
          </section>

          <section class="privacy-section">
            <h2>2. Utilisation des informations</h2>
            <p>Nous utilisons vos informations pour :</p>
            <ul>
              <li>Fournir et améliorer nos services</li>
              <li>Traiter les réservations et paiements</li>
              <li>Communiquer avec vous concernant votre compte</li>
              <li>Personnaliser votre expérience utilisateur</li>
              <li>Assurer la sécurité de notre plateforme</li>
            </ul>
          </section>

          <section class="privacy-section">
            <h2>3. Partage des informations</h2>
            <p>Nous ne vendons pas vos données personnelles. Nous pouvons partager vos informations avec :</p>
            <ul>
              <li>Les propriétaires d'espaces pour faciliter les réservations</li>
              <li>Nos prestataires de services de paiement</li>
              <li>Les autorités légales si requis par la loi</li>
            </ul>
          </section>

          <section class="privacy-section">
            <h2>4. Sécurité des données</h2>
            <p>Nous mettons en place des mesures de sécurité appropriées pour protéger vos données personnelles contre l'accès non autorisé, la modification, la divulgation ou la destruction.</p>
          </section>

          <section class="privacy-section">
            <h2>5. Cookies et technologies similaires</h2>
            <p>Nous utilisons des cookies et des technologies similaires pour améliorer votre expérience, analyser l'utilisation du site et personnaliser le contenu.</p>
          </section>

          <section class="privacy-section">
            <h2>6. Vos droits</h2>
            <p>Vous avez le droit de :</p>
            <ul>
              <li>Accéder à vos données personnelles</li>
              <li>Corriger les informations inexactes</li>
              <li>Demander la suppression de vos données</li>
              <li>Vous opposer au traitement de vos données</li>
              <li>Demander la portabilité de vos données</li>
            </ul>
          </section>

          <section class="privacy-section">
            <h2>7. Conservation des données</h2>
            <p>Nous conservons vos données personnelles aussi longtemps que nécessaire pour fournir nos services et respecter nos obligations légales.</p>
          </section>

          <section class="privacy-section">
            <h2>8. Transferts internationaux</h2>
            <p>Vos données peuvent être transférées et traitées dans des pays autres que votre pays de résidence, conformément aux lois applicables sur la protection des données.</p>
          </section>

          <section class="privacy-section">
            <h2>9. Modifications de cette politique</h2>
            <p>Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. Les modifications seront publiées sur cette page avec une nouvelle date d'effet.</p>
          </section>

          <section class="privacy-section">
            <h2>10. Contact</h2>
            <p>Pour toute question concernant cette politique de confidentialité, contactez-nous à privacy&#64;locaspace.com</p>
          </section>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .privacy-page {
      padding: 40px 0;
      background: #f8fafc;
      min-height: 100vh;
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .privacy-header {
      text-align: center;
      margin-bottom: 60px;
    }

    .privacy-header h1 {
      font-size: 2.5rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 16px;
    }

    .privacy-header p {
      font-size: 1.125rem;
      color: #6b7280;
    }

    .privacy-content {
      background: white;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    .privacy-section {
      margin-bottom: 40px;
    }

    .privacy-section:last-child {
      margin-bottom: 0;
    }

    .privacy-section h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 16px;
    }

    .privacy-section p {
      color: #4b5563;
      line-height: 1.7;
      margin-bottom: 16px;
    }

    .privacy-section ul {
      color: #4b5563;
      line-height: 1.7;
      padding-left: 20px;
    }

    .privacy-section li {
      margin-bottom: 8px;
    }

    @media (max-width: 768px) {
      .privacy-header h1 {
        font-size: 2rem;
      }

      .privacy-content {
        padding: 24px;
      }
    }
  `]
})
export class PrivacyComponent {} 