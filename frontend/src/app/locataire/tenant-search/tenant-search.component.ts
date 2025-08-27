import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { LocatairesService, Place, SearchFilters } from '../services/locataires.service';

@Component({
  selector: 'app-tenant-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MaterialModule],
  templateUrl: './tenant-search.component.html',
  styleUrls: ['./tenant-search.component.scss']
})
export class TenantSearchComponent implements OnInit {
  searchForm: FormGroup;
  places: Place[] = [];
  loading = false;
  quickSearchLocation = '';
  
  amenitiesList = [
    'WiFi',
    'Parking',
    'Piscine',
    'Climatisation',
    'Cuisine équipée',
    'Balcon',
    'Jardin',
    'Salle de sport'
  ];

  constructor(
    private fb: FormBuilder,
    private locatairesService: LocatairesService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.searchForm = this.fb.group({
      location: [''],
      minPrice: [''],
      maxPrice: [''],
      amenities: [[]],
      rating: ['']
    });
  }



  ngOnInit(): void {
    // Load all available lieux from proprietaires
    this.loadAvailablePlaces();
  }

  loadAvailablePlaces(): void {
    this.loading = true;
    this.locatairesService.getAllPlaces().subscribe({
      next: (places) => {
        // Filter only validated/available places
        this.places = places.filter(place => place.availability);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading places:', error);
        // Keep empty array on error
        this.places = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }



  searchPlaces(): void {
    this.loading = true;
    this.cdr.detectChanges();
    
    const filters: SearchFilters = {
      location: this.searchForm.get('location')?.value || undefined,
      minPrice: this.searchForm.get('minPrice')?.value || undefined,
      maxPrice: this.searchForm.get('maxPrice')?.value || undefined,
      amenities: this.searchForm.get('amenities')?.value || [],
      rating: this.searchForm.get('rating')?.value || undefined
    };
    
    this.locatairesService.searchPlaces(filters).subscribe({
      next: (places) => {
        // Filter only validated/available places
        this.places = places.filter(place => place.availability);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error searching places:', error);
        // Fallback to current data if search fails
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onAmenityChange(amenity: string, checked: boolean): void {
    const amenities = this.searchForm.get('amenities')?.value || [];
    if (checked) {
      amenities.push(amenity);
    } else {
      const index = amenities.indexOf(amenity);
      if (index > -1) {
        amenities.splice(index, 1);
      }
    }
    this.searchForm.patchValue({ amenities });
  }

  viewPlaceDetails(placeId: number): void {
    this.router.navigate(['/place-details', placeId]);
  }

  resetFilters(): void {
    this.searchForm.reset();
    this.searchForm.patchValue({ amenities: [] });
    this.loadAvailablePlaces(); // Load all places again
  }

  getAmenityIcon(amenity: string): string {
    const icons: { [key: string]: string } = {
      'WiFi': '📶',
      'Parking': '🚗',
      'Piscine': '🏊',
      'Climatisation': '❄️',
      'Cuisine équipée': '🍳',
      'Balcon': '🏡',
      'Jardin': '🌿',
      'Salle de sport': '💪'
    };
    return icons[amenity] || '✨';
  }

  onRatingSelect(rating: number): void {
    this.searchForm.patchValue({ rating: rating.toString() });
  }

  ratingNumbers: number[] = [1, 2, 3, 4, 5];
}