import { Component } from '@angular/core';

@Component({
  selector: 'app-lieu-list',
  templateUrl: './lieu-list.html',
  styleUrls: ['./lieu-list.scss']
})
export class LieuListComponent {
  lieux = [
    {
      image: 'assets/appartement.jpg',
      title: 'Appartement Moderne',
      location: 'Casablanca',
      price: '500 MAD/jour'
    },
    {
      image: 'assets/salle-reunion.jpg',
      title: 'Salle de Réunion',
      location: 'Rabat',
      price: '750 MAD/jour'
    },
    {
      image: 'assets/villa.jpg',
      title: 'Villa avec Piscine',
      location: 'Marrakech',
      price: '1200 MAD/jour'
    }
  ];
} 