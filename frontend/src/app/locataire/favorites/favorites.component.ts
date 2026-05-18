import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PlaceCardComponent, PlaceCardData } from '../../shared/components/place-card/place-card.component';
import { LocatairesService, Place } from '../services/locataires.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule, PlaceCardComponent],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  favorites: PlaceCardData[] = [];
  filteredFavorites: PlaceCardData[] = [];
  loading = true;
  activeFilter = 'Tous';
  
  filters = [
    { label: 'Tous', value: 'Tous' },
    { label: 'Villas', value: 'Villa' },
    { label: 'Appartements', value: 'Appartement' },
    { label: 'Bureaux', value: 'Bureau' },
    { label: 'Studios', value: 'Studio' }
  ];

  constructor(private locatairesService: LocatairesService) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.loading = true;
    this.locatairesService.getAllPlaces().subscribe({
      next: (places: Place[]) => {
        this.favorites = places.filter((_, index) => index % 3 === 0).map(p => ({
          id: p.id,
          name: p.title,
          location: p.location,
          price: p.price,
          rating: p.rating,
          image: p.images && p.images.length > 0 ? p.images[0] : 'assets/images/placeholder.jpg',
          capacity: 4, 
          type: 'Villa',
          isFavorite: true
        }));
        this.applyFilter();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading favorites', error);
        this.loading = false;
      }
    });
  }

  setFilter(filter: string): void {
    this.activeFilter = filter;
    this.applyFilter();
  }

  applyFilter(): void {
    if (this.activeFilter === 'Tous') {
      this.filteredFavorites = [...this.favorites];
    } else {
      this.filteredFavorites = this.favorites.filter(
        place => place.type === this.activeFilter
      );
    }
  }

  toggleFavorite(placeId: number): void {
    // Optimistic UI update
    this.favorites = this.favorites.filter(p => p.id !== placeId);
    this.applyFilter();
  }
}
