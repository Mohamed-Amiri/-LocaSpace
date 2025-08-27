import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LieuService } from '../lieu.service';
import { LightboxComponent } from '../../shared/lightbox/lightbox.component';
import flatpickr from 'flatpickr';
import * as L from 'leaflet';
import { Lieu } from '../lieu.model';
import { FavoritesService } from '../../shared/favorites/favorites.service';
import { DatePipe } from '@angular/common';
import { GlassCardComponent } from '../../shared/components/glass-card/glass-card.component';
import { ModernButtonComponent } from '../../shared/components/modern-button/modern-button.component';
import { fadeInUpAnimation } from '../../shared/animations/fade.animation';

interface Review {
  user: string;
  avatar: string;
  rating: number;
  comment: string;
  date?: Date;
}

interface RatingCategory {
  name: string;
  score: number;
}

@Component({
  selector: 'app-lieu-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LightboxComponent, DatePipe],
  animations: [fadeInUpAnimation],
  templateUrl: './lieu-detail.component.html',
  styleUrls: ['./lieu-detail.component.scss']
})
export class LieuDetailComponent implements OnInit, AfterViewInit {
  @ViewChild('datePickerInput') datePickerInput!: ElementRef;
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  @ViewChild('calendarContainer') calendarContainer!: ElementRef;
  @ViewChild('datePickerContainer') datePickerContainer!: ElementRef;
  @ViewChild('bookingSidebar') bookingSidebar!: ElementRef;

  // Sticky sidebar state
  isSidebarSticky = false;

  lieu: Lieu | undefined;
  isLightboxOpen = false;
  selectedImageIndex = 0;
  private map: L.Map | undefined;
  private flatpickrInstance: any;
  private bookingFlatpickr: any;

  // Booking properties
  startDate: Date | null = null;
  endDate: Date | null = null;
  totalNights = 0;
  totalPrice = 0;
  checkInFormatted: string = '';
  checkOutFormatted: string = '';
  isValidBooking: boolean = false;
  
  // Guests properties
  adults: number = 1;
  children: number = 0;
  infants: number = 0;
  isGuestsDropdownOpen: boolean = false;
  
  // Review properties
  averageRating = 0;
  ratingCategories: RatingCategory[] = [];
  displayedReviews: Review[] = [];
  showAllReviewsFlag: boolean = false;
  
  // UI state properties
  isSaved: boolean = false;
  showFullDescription: boolean = false;
  displayedAmenities: string[] = [];

  // Photo gallery properties
  selectedImage: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private lieuService: LieuService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.lieu = this.lieuService.getLieuById(+id);
      if (this.lieu) {
        // Initialize reviews
        if (this.lieu.reviews?.length > 0) {
          this.calculateAverageRating();
          this.generateRatingCategories();
          this.displayedReviews = this.lieu.reviews.slice(0, 6);
          
          // Add dates to reviews if not present
          this.lieu.reviews.forEach(review => {
            if (!review.date) {
              // Generate a random date within the last year
              const today = new Date();
              const randomDaysAgo = Math.floor(Math.random() * 365);
              review.date = new Date(today.setDate(today.getDate() - randomDaysAgo));
            }
          });
        }
        
        // Initialize photos
        if (this.lieu.photos.length > 0) {
          this.selectedImage = this.lieu.photos[0];
        }
        
        // Initialize amenities
        if (this.lieu.equipements?.length > 0) {
          this.displayedAmenities = this.lieu.equipements.slice(0, 8);
        }
      }
    }
  }

  ngAfterViewInit(): void {
    this.setupDatePicker();
    this.initMap();
  }

  private initMap(): void {
    if (this.map || !this.lieu || !this.mapContainer) {
      return; // Map is already initialized or no lieu data
    }

    this.map = L.map(this.mapContainer.nativeElement).setView([this.lieu.lat, this.lieu.lng], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: ' OpenStreetMap contributors'
    }).addTo(this.map);

    // Create a custom marker icon
    const customIcon = L.divIcon({
      className: 'custom-map-marker',
      html: `<div class="marker-content">
              <div class="marker-price">${this.lieu.prix}€</div>
            </div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 40]
    });

    L.marker([this.lieu.lat, this.lieu.lng], { icon: customIcon }).addTo(this.map)
      .bindPopup(`<strong>${this.lieu.titre}</strong><br>${this.lieu.ville}, France`)
      .openPopup();
  }

  setupDatePicker(): void {
    // Setup the calendar in the main content
    if (this.calendarContainer) {
      this.flatpickrInstance = flatpickr(this.calendarContainer.nativeElement, {
        inline: true,
        mode: 'range',
        dateFormat: 'd/m/Y',
        minDate: 'today',
        showMonths: 2,
        disable: this.getDisabledDates(),
        onChange: (selectedDates) => {
          if (selectedDates.length === 2) {
            this.startDate = selectedDates[0];
            this.endDate = selectedDates[1];
            this.updateFormattedDates();
            this.calculatePrice();
            this.isValidBooking = true;
          }
        }
      });
    }
    
    // Setup the date picker in the booking sidebar
    if (this.datePickerContainer) {
      this.bookingFlatpickr = flatpickr(this.datePickerContainer.nativeElement, {
        inline: true,
        mode: 'range',
        dateFormat: 'd/m/Y',
        minDate: 'today',
        disable: this.getDisabledDates(),
        onChange: (selectedDates) => {
          if (selectedDates.length === 2) {
            this.startDate = selectedDates[0];
            this.endDate = selectedDates[1];
            this.updateFormattedDates();
            this.calculatePrice();
            this.isValidBooking = true;
          }
        }
      });
    }
  }
  
  private getDisabledDates(): Date[] {
    // Simulate some random booked dates
    const disabledDates: Date[] = [];
    const today = new Date();
    
    // Add some random dates in the next 3 months
    for (let i = 0; i < 15; i++) {
      const randomDays = Math.floor(Math.random() * 90) + 1;
      const bookedDate = new Date(today);
      bookedDate.setDate(today.getDate() + randomDays);
      disabledDates.push(bookedDate);
    }
    
    return disabledDates;
  }
  
  updateFormattedDates(): void {
    if (this.startDate) {
      this.checkInFormatted = this.formatDate(this.startDate);
    } else {
      this.checkInFormatted = '';
    }
    
    if (this.endDate) {
      this.checkOutFormatted = this.formatDate(this.endDate);
    } else {
      this.checkOutFormatted = '';
    }
  }
  
  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  
  openDatePicker(): void {
    if (this.bookingFlatpickr) {
      this.bookingFlatpickr.open();
    }
  }

  calculatePrice(): void {
    if (this.startDate && this.endDate && this.lieu) {
      const diffTime = Math.abs(this.endDate.getTime() - this.startDate.getTime());
      this.totalNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      this.totalPrice = this.totalNights * this.lieu.prix;
    } else {
      this.totalNights = 0;
      this.totalPrice = 0;
    }
  }

  calculateAverageRating(): void {
    if (!this.lieu || !this.lieu.reviews || this.lieu.reviews.length === 0) {
      this.averageRating = 0;
      return;
    }
    const total = this.lieu.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.averageRating = total / this.lieu.reviews.length;
  }

  getStarArray(rating: number): number[] {
    return Array(Math.round(rating)).fill(0);
  }

  openLightbox(index: number): void {
    this.selectedImageIndex = index;
    this.isLightboxOpen = true;
  }

  closeLightbox(): void {
    this.isLightboxOpen = false;
  }

  selectImage(image: string): void {
    this.selectedImage = image;
  }

  // Guest management methods
  toggleGuestsDropdown(): void {
    this.isGuestsDropdownOpen = !this.isGuestsDropdownOpen;
  }
  
  closeGuestsDropdown(): void {
    this.isGuestsDropdownOpen = false;
  }
  
  updateGuests(type: 'adults' | 'children' | 'infants', change: number): void {
    if (type === 'adults') {
      this.adults = Math.max(1, this.adults + change);
    } else if (type === 'children') {
      this.children = Math.max(0, this.children + change);
    } else if (type === 'infants') {
      this.infants = Math.max(0, this.infants + change);
    }
  }
  
  get totalGuests(): number {
    return this.adults + this.children;
  }
  
  // UI interaction methods
  toggleSave(): void {
    this.isSaved = !this.isSaved;
  }
  
  sharePlace(): void {
    // In a real app, this would open a share dialog
    if (navigator.share) {
      navigator.share({
        title: this.lieu?.titre,
        text: `Découvrez ${this.lieu?.titre} sur LocaSpace`,
        url: window.location.href
      }).catch(err => console.error('Error sharing:', err));
    } else {
      // Fallback for browsers that don't support the Web Share API
      alert('Lien copié dans le presse-papier !');
    }
  }
  
  toggleFullDescription(): void {
    this.showFullDescription = !this.showFullDescription;
  }
  
  showAllAmenities(): void {
    if (this.lieu?.equipements) {
      this.displayedAmenities = [...this.lieu.equipements];
    }
  }
  
  showAllReviews(): void {
    if (this.lieu?.reviews) {
      this.displayedReviews = [...this.lieu.reviews];
      this.showAllReviewsFlag = true;
    }
  }
  
  contactHost(): void {
    // In a real app, this would open a messaging interface
    alert('Fonctionnalité de messagerie en cours de développement');
  }
  
  reportListing(): void {
    // In a real app, this would open a report dialog
    alert('Merci de nous signaler ce problème. Notre équipe va examiner cette annonce.');
  }
  
  // Helper methods
  generateRatingCategories(): void {
    if (!this.lieu) return;
    
    this.ratingCategories = [
      { name: 'Propreté', score: this.generateRandomScore() },
      { name: 'Précision', score: this.generateRandomScore() },
      { name: 'Communication', score: this.generateRandomScore() },
      { name: 'Emplacement', score: this.generateRandomScore() },
      { name: 'Arrivée', score: this.generateRandomScore() },
      { name: 'Qualité-prix', score: this.generateRandomScore() }
    ];
  }
  
  private generateRandomScore(): number {
    // Generate a random score between 4.0 and 5.0
    return +(4 + Math.random()).toFixed(1);
  }
  
  getAmenityIcon(amenity: string): string {
    // Return SVG path data based on amenity type
    const amenityIcons: {[key: string]: string} = {
      'WiFi': 'M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01',
      'Cuisine': 'M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z M12 8v8 M8 12h8',
      'Parking': 'M5 17h14v2H5v-2z M14 13h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1 M5 5h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5 M8 5v14',
      'Piscine': 'M2 12h20 M2 20h20 M2 4h20 M6 20c1.5 0 3-2 3-6 0-4-1.5-6-3-6s-3 2-3 6c0 4 1.5 6 3 6z M18 20c1.5 0 3-2 3-6 0-4-1.5-6-3-6s-3 2-3 6c0 4 1.5 6 3 6z',
      'Climatisation': 'M9.5 6.5v3a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2z M21 6.5v3a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2z M21 16.5v3a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2z M9.5 16.5v3a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2z',
      'TV': 'M2 7.5v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z M17 2l-5 5.5L7 2',
      'Lave-linge': 'M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5z M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M12 12v.01',
      'Sèche-linge': 'M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5z M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M12 12v.01',
      'Chauffage': 'M8 13.5V7a4 4 0 0 1 8 0v6.5 M8 13.5a4 4 0 0 0 8 0 M12 17v4 M8 17h8',
      'Salle de sport': 'M6 5v14 M18 5v14 M6 9h12 M6 15h12 M9 5v14 M15 5v14',
      'Jacuzzi': 'M7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M17 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M7 16h10 M12 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4z M3.5 11h17a2 2 0 0 1 0 4h-17a2 2 0 0 1 0-4z',
      'Barbecue': 'M8 18l-2 3 M12 18l-1 3 M16 18l1 3 M12 4a8 8 0 0 0-8 8h16a8 8 0 0 0-8-8z M18 12v6 M6 12v6',
      'Terrasse': 'M4 4h16v16H4z M4 12h16 M12 4v16',
      'Jardin': 'M12 22a9 9 0 0 0 9-9 9 9 0 0 0-9 9z M9 6c0 3-4 6-4 6s-4-3-4-6a4 4 0 0 1 8 0z M19 6c0 3-4 6-4 6s-4-3-4-6a4 4 0 0 1 8 0z',
      'Vue': 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'
    };
    
    // Default icon if amenity not found in the map
    return amenityIcons[amenity] || 'M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20z M12 16v.01 M12 8v4';
  }
  
  goToReservation(): void {
    if (!this.lieu || !this.isValidBooking) {
      return;
    }
    
    const query: any = {
      adults: this.adults,
      children: this.children,
      infants: this.infants
    };
    
    if (this.startDate && this.endDate) {
      query.start = this.startDate.toISOString();
      query.end = this.endDate.toISOString();
    }
    
    this.router.navigate(['/reservation', this.lieu.id], { queryParams: query });
  }

  // Scroll listener for sticky sidebar
  @HostListener('window:scroll')
  onWindowScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    this.isSidebarSticky = scrollTop > 400;
  }

  // Smooth scroll to section
  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
