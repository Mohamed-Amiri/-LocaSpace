import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ModernButtonComponent } from '../shared/components/modern-button/modern-button.component';
import { GlassCardComponent } from '../shared/components/glass-card/glass-card.component';
import { TemplateDescriptionComponent } from '../shared/components/template-description/template-description.component';

interface PlaceCardData {
  id: number;
  name: string;
  location: string;
  price: number;
  rating: number;
  reviewCount?: number;
  capacity: number;
  type: string;
  image: string;
  badges: string[];
  isFavorite: boolean;
  amenities?: string[];
}

interface SearchFilters {
  location: string;
  priceMin: number;
  priceMax: number;
  type: string;
  capacity: number;
  amenities: string[];
  rating: number;
  availability: string;
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ModernButtonComponent,
    GlassCardComponent,
    TemplateDescriptionComponent
  ],
  templateUrl: './search.html',
  styleUrl: './search.scss'
})
export class SearchComponent implements OnInit, OnDestroy {
  Math = Math;
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  private destroy$ = new Subject<void>();
  
  // Search state
  searchQuery = '';
  isLoading = false;
  showFilters = false;
  viewMode: 'grid' | 'map' = 'grid';
  
  // Filters
  filters: SearchFilters = {
    location: '',
    priceMin: 0,
    priceMax: 1000,
    type: '',
    capacity: 1,
    amenities: [],
    rating: 0,
    availability: 'all'
  };

  // Available filter options
  placeTypes = [
    { value: '', label: 'Tous les types' },
    { value: 'apartment', label: 'Appartement' },
    { value: 'house', label: 'Maison' },
    { value: 'villa', label: 'Villa' },
    { value: 'office', label: 'Bureau' },
    { value: 'studio', label: 'Studio' },
    { value: 'event-space', label: 'Espace événementiel' }
  ];

  amenitiesList = [
    { id: 'wifi', label: 'WiFi', icon: '📶' },
    { id: 'parking', label: 'Parking', icon: '🚗' },
    { id: 'kitchen', label: 'Cuisine', icon: '🍳' },
    { id: 'pool', label: 'Piscine', icon: '🏊' },
    { id: 'gym', label: 'Salle de sport', icon: '💪' },
    { id: 'garden', label: 'Jardin', icon: '🌿' },
    { id: 'balcony', label: 'Balcon', icon: '🏡' },
    { id: 'ac', label: 'Climatisation', icon: '❄️' }
  ];

  // Results
  places: PlaceCardData[] = [];
  filteredPlaces: PlaceCardData[] = [];
  totalResults = 0;
  currentPage = 1;
  itemsPerPage = 12;

  // Favorites
  favoriteIds = new Set<number>();

  constructor(
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Load initial data
    this.loadPlaces();
    
    // Handle query parameters
    this.route.queryParams.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      if (params['location']) {
        this.filters.location = params['location'];
        this.searchQuery = params['location'];
      }
      if (params['type']) {
        this.filters.type = params['type'];
      }
      this.applyFilters();
    });

    // Load favorites from localStorage
    this.loadFavorites();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPlaces() {
    this.isLoading = true;
    
    // TODO: Replace with actual API call to backend service
    // Example: this.searchService.getPlaces(this.filters).subscribe(places => {
    //   this.places = places;
    //   this.applyFilters();
    //   this.isLoading = false;
    // });
    
    // For now, initialize empty until real API is connected
    setTimeout(() => {
      this.places = [];
      this.applyFilters();
      this.isLoading = false;
    }, 500);
  }

  applyFilters() {
    let filtered = [...this.places];

    // Location filter
    if (this.filters.location) {
      filtered = filtered.filter(place => 
        place.location.toLowerCase().includes(this.filters.location.toLowerCase())
      );
    }

    // Price filter
    filtered = filtered.filter(place => 
      place.price >= this.filters.priceMin && place.price <= this.filters.priceMax
    );

    // Type filter
    if (this.filters.type) {
      filtered = filtered.filter(place => 
        place.type.toLowerCase().includes(this.filters.type.toLowerCase())
      );
    }

    // Capacity filter
    filtered = filtered.filter(place => place.capacity >= this.filters.capacity);

    // Rating filter
    if (this.filters.rating > 0) {
      filtered = filtered.filter(place => place.rating >= this.filters.rating);
    }

    this.filteredPlaces = filtered;
    this.totalResults = filtered.length;
    this.currentPage = 1;
  }

  onSearch() {
    this.filters.location = this.searchQuery;
    this.applyFilters();
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  toggleViewMode() {
    this.viewMode = this.viewMode === 'grid' ? 'map' : 'grid';
  }

  toggleAmenity(amenityId: string) {
    const index = this.filters.amenities.indexOf(amenityId);
    if (index > -1) {
      this.filters.amenities.splice(index, 1);
    } else {
      this.filters.amenities.push(amenityId);
    }
    this.applyFilters();
  }

  clearFilters() {
    this.filters = {
      location: '',
      priceMin: 0,
      priceMax: 1000,
      type: '',
      capacity: 1,
      amenities: [],
      rating: 0,
      availability: 'all'
    };
    this.searchQuery = '';
    this.applyFilters();
  }

  toggleFavorite(placeId: number) {
    const place = this.places.find(p => p.id === placeId);
    if (place) {
      place.isFavorite = !place.isFavorite;
      
      if (place.isFavorite) {
        this.favoriteIds.add(placeId);
      } else {
        this.favoriteIds.delete(placeId);
      }
      
      this.saveFavorites();
    }
  }

  private loadFavorites() {
    const saved = localStorage.getItem('locaspace_favorites');
    if (saved) {
      this.favoriteIds = new Set(JSON.parse(saved));
      this.places.forEach(place => {
        place.isFavorite = this.favoriteIds.has(place.id);
      });
    }
  }

  private saveFavorites() {
    localStorage.setItem('locaspace_favorites', JSON.stringify([...this.favoriteIds]));
  }

  get paginatedPlaces(): PlaceCardData[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredPlaces.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.totalResults / this.itemsPerPage);
  }

  changePage(page: number) {
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  reservePlace(placeId: number) {
    console.log('Reserving place:', placeId);
    // TODO: Implement reservation logic or navigate to reservation page
  }

  getStarArray(rating: number): boolean[] {
    return Array(5).fill(false).map((_, i) => i < Math.floor(rating));
  }
}