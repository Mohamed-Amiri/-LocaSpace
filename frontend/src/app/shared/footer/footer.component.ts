import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  
  socialLinks = [
    { name: 'Facebook', icon: 'fab fa-facebook-f', url: '#' },
    { name: 'Twitter', icon: 'fab fa-twitter', url: '#' },
    { name: 'Instagram', icon: 'fab fa-instagram', url: '#' },
    { name: 'LinkedIn', icon: 'fab fa-linkedin-in', url: '#' }
  ];

  quickLinks = [
    { name: 'Accueil', url: '/' },
    { name: 'À propos', url: '/about' },
    { name: 'Services', url: '/services' },
    { name: 'Contact', url: '/contact' }
  ];

  legalLinks = [
    { name: 'Mentions légales', url: '/legal' },
    { name: 'Politique de confidentialité', url: '/privacy' },
    { name: 'CGU', url: '/terms' }
  ];
}