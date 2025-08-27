import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { LocatairesService, Booking } from '../services/locataires.service';
import { ReservationService } from '../services/reservation.service';
import { ReviewService } from '../services/review.service';
import { CancelBookingDialogComponent } from '../../shared/cancel-booking-dialog/cancel-booking-dialog.component';
import { AddReviewDialogComponent } from '../../shared/add-review-dialog/add-review-dialog.component';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterModule],
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.scss']
})
export class ReservationsComponent implements OnInit {
  bookings: Booking[] = [];
  loading = true;
  cancellingBookingId: number | null = null;
  confirmingBookingId: number | null = null;
  
  statusFilters = [
    { value: 'all', label: 'Toutes' },
    { value: 'pending', label: 'En attente' },
    { value: 'confirmed', label: 'Acceptées' },
    { value: 'cancelled', label: 'Refusées/Annulées' }
  ];
  
  selectedFilter = 'all';
  filteredBookings: Booking[] = [];

  constructor(
    private locatairesService: LocatairesService,
    private reservationService: ReservationService,
    private reviewService: ReviewService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadBookings();
    // Set up automatic refresh every 30 seconds to catch status updates from proprietaires
    setInterval(() => {
      this.refreshBookings();
    }, 30000);
  }

  loadBookings(): void {
    this.loading = true;
    this.reservationService.getUserBookings().subscribe({
      next: (bookings) => {
        this.bookings = bookings;
        this.applyFilter();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des réservations:', error);
        this.loading = false;
      }
    });
  }

  // Refresh bookings without showing loading state
  refreshBookings(): void {
    this.reservationService.getUserBookings().subscribe({
      next: (bookings) => {
        const previousCount = this.bookings.length;
        const previousStatuses = this.bookings.map(b => ({ id: b.id, status: b.status }));
        
        this.bookings = bookings;
        this.applyFilter();
        
        // Check for status changes and show notification
        const currentStatuses = this.bookings.map(b => ({ id: b.id, status: b.status }));
        const statusChanges = currentStatuses.filter(current => {
          const previous = previousStatuses.find(p => p.id === current.id);
          return previous && previous.status !== current.status;
        });
        
        if (statusChanges.length > 0) {
          const changeMessages = statusChanges.map(change => {
            const booking = this.bookings.find(b => b.id === change.id);
            return `Réservation ${booking?.place?.title || change.id}: ${this.getStatusLabel(change.status)}`;
          });
          
          // You could show a snack bar notification here if needed
          console.log('Status changes detected:', changeMessages);
        }
      },
      error: (error) => {
        console.error('Erreur lors du rafraîchissement des réservations:', error);
      }
    });
  }

  applyFilter(): void {
    if (this.selectedFilter === 'all') {
      this.filteredBookings = this.bookings;
    } else {
      this.filteredBookings = this.bookings.filter(
        booking => booking.status === this.selectedFilter
      );
    }
  }

  onFilterChange(): void {
    this.applyFilter();
  }

  cancelBooking(booking: Booking): void {
    const dialogRef = this.dialog.open(CancelBookingDialogComponent, {
      width: '450px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: { booking },
      disableClose: true,
      panelClass: 'cancel-booking-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.cancellingBookingId = booking.id;
        
        this.reservationService.cancelBooking(booking.id).subscribe({
          next: () => {
            console.log('Booking cancelled successfully:', booking.id);
            
            // Update the booking status immediately for instant feedback
            booking.status = 'cancelled';
            
            // Switch to "Annulées" filter to show the cancelled booking (next tick to avoid NG0100)
            setTimeout(() => {
              this.onFilterSelect('cancelled');
              this.cdr.detectChanges();
            }, 0);
            
            this.cancellingBookingId = null;
            
            this.snackBar.open('Réservation annulée avec succès. Basculement vers les réservations annulées.', 'Fermer', {
              duration: 5000,
              panelClass: ['success-snackbar']
            });
          },
          error: (error) => {
            console.error('Erreur lors de l\'annulation:', error);
            this.cancellingBookingId = null;
            
            this.snackBar.open('Erreur lors de l\'annulation de la réservation', 'Fermer', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }

  isCancelling(bookingId: number): boolean {
    return this.cancellingBookingId === bookingId;
  }

  isConfirming(bookingId: number): boolean {
    return this.confirmingBookingId === bookingId;
  }

  confirmBooking(booking: Booking): void {
    this.confirmingBookingId = booking.id;
    
    this.reservationService.confirmBooking(booking.id).subscribe({
      next: () => {
        // Update the booking status locally
        booking.status = 'confirmed';
        
        // Switch to "Confirmées" filter to show the confirmed booking
        this.onFilterSelect('confirmed');
        
        this.confirmingBookingId = null;
        
        this.snackBar.open('Réservation confirmée avec succès !', 'Fermer', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      },
      error: (error) => {
        console.error('Erreur lors de la confirmation:', error);
        this.confirmingBookingId = null;
        
        this.snackBar.open('Erreur lors de la confirmation de la réservation', 'Fermer', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  getCancellationMessage(booking: Booking): string {
    if (booking.status === 'cancelled') {
      return 'Réservation déjà annulée';
    }
    
    // For testing purposes, this should rarely be shown
    // since we allow cancellation of all non-cancelled bookings
    return 'Annulation non disponible';
    
    // Original time-based messages (uncomment for production):
    /*
    const startDate = new Date(booking.startDate);
    const now = new Date();
    const timeDiff = startDate.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);
    
    if (hoursDiff <= 0) {
      return 'Le séjour a déjà commencé';
    }
    
    if (hoursDiff <= 24) {
      return 'Annulation non disponible (moins de 24h)';
    }
    
    return 'Annulation non disponible';
    */
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'confirmed': return 'primary';
      case 'pending': return 'accent';
      case 'cancelled': return 'warn';
      default: return '';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'confirmed': return 'Acceptée';
      case 'pending': return 'En attente';
      case 'cancelled': return 'Refusée/Annulée';
      default: return status;
    }
  }

  canCancelBooking(booking: Booking): boolean {
    // For testing purposes, allow cancellation of any non-cancelled booking
    // In production, you might want to add time-based restrictions
    return booking.status !== 'cancelled';
    
    // Original time-based rule (uncomment for production):
    /*
    if (booking.status === 'cancelled') return false;
    
    const startDate = new Date(booking.startDate);
    const now = new Date();
    const timeDiff = startDate.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);
    
    return hoursDiff > 24; // Can cancel if more than 24 hours before start
    */
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getDuration(startDate: Date, endDate: Date): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  get confirmedBookingsCount(): number {
    return this.bookings.filter(b => b.status === 'confirmed').length;
  }

  get currentFilterLabel(): string {
    const filter = this.statusFilters.find(f => f.value === this.selectedFilter);
    return filter ? filter.label.toLowerCase() : '';
  }

  onFilterSelect(filterValue: string): void {
    this.selectedFilter = filterValue;
    this.onFilterChange();
  }

  getFilterIcon(filterValue: string): string {
    const icons: { [key: string]: string } = {
      'all': '📋',
      'pending': '⏳',
      'confirmed': '✅',
      'cancelled': '❌'
    };
    return icons[filterValue] || '📋';
  }

  canAddReview(booking: Booking): boolean {
    // Can add review if booking is confirmed and in the past
    if (booking.status !== 'confirmed') return false;
    
    const endDate = new Date(booking.endDate);
    const now = new Date();
    return endDate < now; // Booking has ended
  }

  addReview(booking: Booking): void {
    const dialogRef = this.dialog.open(AddReviewDialogComponent, {
      width: '500px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: { booking },
      disableClose: true,
      panelClass: 'add-review-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.reviewService.addReview({
          placeId: booking.placeId,
          bookingId: booking.id,
          rating: result.rating,
          comment: result.comment
        }).subscribe({
          next: (review) => {
            this.snackBar.open('Avis publié avec succès ! Merci pour votre retour.', 'Fermer', {
              duration: 5000,
              panelClass: ['success-snackbar']
            });
          },
          error: (error) => {
            console.error('Erreur lors de la publication de l\'avis:', error);
            this.snackBar.open('Erreur lors de la publication de l\'avis', 'Fermer', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }
}