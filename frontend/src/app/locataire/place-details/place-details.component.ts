import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../material.module';
import { LocatairesService, Place, Review, Booking } from '../services/locataires.service';
import { ReservationService } from '../services/reservation.service';
import { ReviewService } from '../services/review.service';
import { AddReviewDialogComponent } from '../../shared/add-review-dialog/add-review-dialog.component';

@Component({
  selector: 'app-place-details',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './place-details.component.html',
  styleUrls: ['./place-details.component.scss']
})
export class PlaceDetailsComponent implements OnInit {
  place: Place | null = null;
  loading = true;
  selectedImageIndex = 0;
  showAllAmenities = false;
  showAllReviews = false;
  
  // Booking form data
  checkInDate = '';
  checkOutDate = '';
  guests = 1;
  isBooking = false;
  
  // Booking status
  userBookings: Booking[] = [];
  hasActiveBooking = false;
  activeBooking: Booking | null = null;
  
  // Navigation tracking
  cameFromReservations = false;
  
  // Review functionality
  userReviews: Review[] = [];
  hasUserReviewed = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private locatairesService: LocatairesService,
    private reservationService: ReservationService,
    private reviewService: ReviewService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    // Set default dates (today + 1 day for check-in, today + 4 days for check-out)
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const checkOut = new Date(today);
    checkOut.setDate(today.getDate() + 4);
    
    this.checkInDate = tomorrow.toISOString().split('T')[0];
    this.checkOutDate = checkOut.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    const placeId = Number(this.route.snapshot.paramMap.get('id'));
    
    // Check if user came from reservations page
    const navigation = this.router.getCurrentNavigation();
    const previousUrl = navigation?.previousNavigation?.finalUrl?.toString();
    this.cameFromReservations = previousUrl?.includes('/reservations') || false;
    
    this.loadPlaceDetails(placeId);
    this.checkUserBookings(placeId);
    this.checkUserReviews(placeId);
  }

  loadPlaceDetails(placeId: number): void {
    this.loading = true;
    
    // Load place data from backend API
    this.locatairesService.getPlaceById(placeId).subscribe({
      next: (place) => {
        this.place = place;
        this.loading = false;
        
        // Load reviews separately
        this.loadPlaceReviews(placeId);
        
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading place details:', error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadPlaceReviews(placeId: number): void {
    this.reviewService.getReviewsForPlace(placeId).subscribe({
      next: (reviews) => {
        if (this.place) {
          this.place.reviews = reviews;
          // Recalculate average rating
          if (reviews.length > 0) {
            const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
            this.place.rating = totalRating / reviews.length;
          }
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error('Error loading place reviews:', error);
      }
    });
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  toggleAmenities(): void {
    this.showAllAmenities = !this.showAllAmenities;
  }

  toggleReviews(): void {
    this.showAllReviews = !this.showAllReviews;
  }

  bookPlace(): void {
    if (!this.place || !this.checkInDate || !this.checkOutDate) {
      alert('Veuillez remplir tous les champs requis');
      return;
    }

    const startDate = new Date(this.checkInDate);
    const endDate = new Date(this.checkOutDate);
    
    if (startDate >= endDate) {
      alert('La date de départ doit être après la date d\'arrivée');
      return;
    }

    // Backend requires start date strictly after today
    const today = new Date();
    today.setHours(0,0,0,0);
    if (startDate <= today) {
      alert('La date d\'arrivée ne peut pas être dans le passé');
      return;
    }

    // Navigate to booking confirmation page with booking data
    const bookingData = {
      place: this.place,
      checkInDate: this.checkInDate,
      checkOutDate: this.checkOutDate,
      guests: this.guests
    };

    const queryParams = {
      placeData: encodeURIComponent(JSON.stringify(bookingData))
    };

    this.router.navigate(['/locataire/booking-confirm'], { queryParams });
  }

  goBack(): void {
    if (this.cameFromReservations || this.hasActiveBooking) {
      this.router.navigate(['/locataire/reservations']);
    } else {
      this.router.navigate(['/locataire/search']);
    }
  }

  getBackButtonText(): string {
    if (this.cameFromReservations || this.hasActiveBooking) {
      return 'Retour à mes réservations';
    } else {
      return 'Retour à la recherche';
    }
  }

  getStarArray(rating: number): boolean[] {
    return Array(5).fill(false).map((_, i) => i < Math.floor(rating));
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
      'Salle de sport': '💪',
      'Machine à laver': '🧺',
      'Télévision': '📺',
      'Chauffage': '🔥'
    };
    return icons[amenity] || '✨';
  }

  calculateNights(): number {
    if (!this.checkInDate || !this.checkOutDate) return 0;
    
    const startDate = new Date(this.checkInDate);
    const endDate = new Date(this.checkOutDate);
    const timeDiff = endDate.getTime() - startDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  calculateTotalPrice(): number {
    if (!this.place) return 0;
    
    const nights = this.calculateNights();
    const subtotal = this.place.price * nights;
    const serviceFee = 15; // Fixed service fee
    return subtotal + serviceFee;
  }

  get subtotal(): number {
    if (!this.place) return 0;
    return this.place.price * this.calculateNights();
  }

  get serviceFee(): number {
    return 15; // Fixed service fee
  }

  getTomorrowDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }

  getMinCheckOutDate(): string {
    if (!this.checkInDate) return this.getTomorrowDate();
    
    const checkIn = new Date(this.checkInDate);
    checkIn.setDate(checkIn.getDate() + 1);
    return checkIn.toISOString().split('T')[0];
  }

  checkUserBookings(placeId: number): void {
    this.reservationService.getUserBookings().subscribe({
      next: (bookings) => {
        console.log('All bookings:', bookings);
        this.userBookings = bookings.filter(booking => 
          booking.placeId === placeId && booking.status !== 'cancelled'
        );
        console.log('Active bookings for place:', this.userBookings);
        
        this.hasActiveBooking = this.userBookings.length > 0;
        this.activeBooking = this.userBookings.find(booking => 
          booking.status === 'pending' || booking.status === 'confirmed'
        ) || null;
        
        console.log('Has active booking:', this.hasActiveBooking);
        console.log('Active booking:', this.activeBooking);
      },
      error: (error) => {
        console.error('Error checking user bookings:', error);
      }
    });
  }

  navigateToReservations(): void {
    this.router.navigate(['/locataire/reservations']);
  }

  formatBookingDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  checkUserReviews(placeId: number): void {
    this.reviewService.getUserReviews().subscribe({
      next: (reviews) => {
        this.userReviews = reviews.filter(review => review.placeId === placeId);
        this.hasUserReviewed = this.userReviews.length > 0;
        this.cdr.detectChanges(); // Force change detection
      },
      error: (error) => {
        console.error('Error checking user reviews:', error);
      }
    });
  }



  getAddReviewButtonText(): string {
    const completedBookings = this.userBookings.filter(booking => 
      booking.status === 'confirmed' && new Date(booking.endDate) < new Date()
    );
    const reviewedBookingIds = this.userReviews.map(review => review.bookingId);
    const unreviewedCount = completedBookings.filter(booking => 
      !reviewedBookingIds.includes(booking.id)
    ).length;

    if (unreviewedCount > 1) {
      return `Ajouter un avis (${unreviewedCount} séjours)`;
    }
    return 'Ajouter un avis';
  }

  getReviewStatusText(): string {
    const completedBookings = this.userBookings.filter(booking => 
      booking.status === 'confirmed' && new Date(booking.endDate) < new Date()
    );
    const reviewCount = this.userReviews.length;
    const totalBookings = completedBookings.length;

    if (reviewCount === totalBookings && totalBookings > 1) {
      return `Avis publiés (${reviewCount}/${totalBookings})`;
    } else if (reviewCount < totalBookings) {
      return `Avis publié (${reviewCount}/${totalBookings})`;
    }
    return 'Avis publié';
  }

  canAddReview(): boolean {
    // Get all completed bookings for this place
    const completedBookings = this.userBookings.filter(booking => 
      booking.status === 'confirmed' && new Date(booking.endDate) < new Date()
    );
    
    if (completedBookings.length === 0) return false;
    
    // Check if user has unreviewed completed bookings
    const reviewedBookingIds = this.userReviews.map(review => review.bookingId);
    const unreviewedBookings = completedBookings.filter(booking => 
      !reviewedBookingIds.includes(booking.id)
    );
    
    // User can add review if they have unreviewed completed bookings
    return unreviewedBookings.length > 0;
  }

  addReview(): void {
    if (!this.place) return;

    // Get all completed bookings
    const completedBookings = this.userBookings.filter(booking => 
      booking.status === 'confirmed' && new Date(booking.endDate) < new Date()
    );

    if (completedBookings.length === 0) {
      this.snackBar.open('Vous devez avoir séjourné dans ce logement pour laisser un avis', 'Fermer', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    // Find an unreviewed booking
    const reviewedBookingIds = this.userReviews.map(review => review.bookingId);
    const unreviewedBooking = completedBookings.find(booking => 
      !reviewedBookingIds.includes(booking.id)
    );

    if (!unreviewedBooking) {
      this.snackBar.open('Vous avez déjà laissé un avis pour tous vos séjours dans ce logement', 'Fermer', {
        duration: 3000,
        panelClass: ['info-snackbar']
      });
      return;
    }

    const completedBooking = unreviewedBooking;

    const dialogRef = this.dialog.open(AddReviewDialogComponent, {
      width: '500px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: { booking: completedBooking, place: this.place },
      disableClose: true,
      panelClass: 'add-review-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && completedBooking) {
        this.reviewService.addReview({
          placeId: this.place!.id,
          bookingId: completedBooking.id,
          rating: result.rating,
          comment: result.comment
        }).subscribe({
          next: (review) => {
            // Refresh reviews from backend to get updated data
            this.loadPlaceReviews(this.place!.id);
            
            // Update user review status
            this.checkUserReviews(this.place!.id);
            
            this.snackBar.open('Avis publié avec succès ! Merci pour votre retour.', 'Fermer', {
              duration: 5000,
              panelClass: ['success-snackbar']
            });
          },
          error: (error) => {
            console.error('Erreur lors de la publication de l\'avis:', error);
            let errorMessage = 'Erreur lors de la publication de l\'avis';
            
            if (error.status === 400) {
              errorMessage = error.error?.message || 'Vous avez déjà laissé un avis pour ce logement';
            } else if (error.status === 401) {
              errorMessage = 'Vous devez être connecté pour laisser un avis';
            }
            
            this.snackBar.open(errorMessage, 'Fermer', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }
}