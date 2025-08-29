import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { Place } from '../services/locataires.service';
import { ReservationService } from '../services/reservation.service';
import { AuthService } from '../../auth/auth.service';

@Component({
    selector: 'app-booking-confirm',
    standalone: true,
    imports: [CommonModule, FormsModule, MaterialModule],
    templateUrl: './booking-confirm.component.html',
    styleUrls: ['./booking-confirm.component.scss']
})
export class BookingConfirmComponent implements OnInit {
    place: Place | null = null;
    checkInDate = '';
    checkOutDate = '';
    guests = 1;

    // Guest information
    guestName = '';
    guestEmail = '';
    guestPhone = '';
    specialRequests = '';

    // Payment information (optional)
    paymentMethod = 'card';
    cardNumber = '';
    expiryDate = '';
    cvv = '';

    loading = false;
    isProcessing = false;
    currentStep = 1; // 1: Guest Info, 2: Payment (optional), 3: Confirmation
    bookingNumber = ''; // Store booking number to avoid ExpressionChangedAfterItHasBeenCheckedError

    constructor(
        private route: ActivatedRoute,
        public router: Router, // Make router public for template access
        private reservationService: ReservationService,
        private cdr: ChangeDetectorRef,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        // Initialize booking number once to avoid ExpressionChangedAfterItHasBeenCheckedError
        this.bookingNumber = '#' + Date.now().toString().slice(-6);
        
        // Get booking data from query params
        this.route.queryParams.subscribe(params => {
            if (params['placeData']) {
                try {
                    const bookingData = JSON.parse(decodeURIComponent(params['placeData']));
                    this.place = bookingData.place;
                    this.checkInDate = bookingData.checkInDate;
                    this.checkOutDate = bookingData.checkOutDate;
                    this.guests = bookingData.guests;
                    
                    // Debug authentication status
                    console.log('Component initialized - Auth status:', {
                        isAuthenticated: this.authService.isAuthenticated,
                        currentUser: this.authService.currentUser,
                        tokenExists: !!localStorage.getItem('authToken') || !!sessionStorage.getItem('authToken')
                    });
                } catch (error) {
                    console.error('Error parsing booking data:', error);
                    this.router.navigate(['/locataire/search']);
                }
            } else {
                this.router.navigate(['/locataire/search']);
            }
        });
    }

    calculateNights(): number {
        if (!this.checkInDate || !this.checkOutDate) return 0;

        const startDate = new Date(this.checkInDate);
        const endDate = new Date(this.checkOutDate);
        // Ensure start date is strictly after today to match backend rules
        const today = new Date();
        today.setHours(0,0,0,0);
        if (startDate <= today) {
            this.isProcessing = false;
            alert('La date d\'arrivée doit être postérieure à aujourd\'hui');
            return 0;
        }
        const timeDiff = endDate.getTime() - startDate.getTime();
        return Math.ceil(timeDiff / (1000 * 3600 * 24));
    }

    calculateTotalPrice(): number {
        if (!this.place) return 0;

        const nights = this.calculateNights();
        const subtotal = this.place.price * nights;
        const serviceFee = 15;
        const taxes = Math.round(subtotal * 0.1); // 10% taxes
        return subtotal + serviceFee + taxes;
    }

    get subtotal(): number {
        if (!this.place) return 0;
        return this.place.price * this.calculateNights();
    }

    get serviceFee(): number {
        return 15;
    }

    get taxes(): number {
        return Math.round(this.subtotal * 0.1); // 10% taxes
    }

    nextStep(): void {
        if (this.currentStep === 1) {
            if (!this.guestName || !this.guestEmail) {
                alert('Veuillez remplir les informations obligatoires');
                return;
            }
            this.currentStep = 2;
        } else if (this.currentStep === 2) {
            this.confirmBooking();
        }
    }

    previousStep(): void {
        if (this.currentStep > 1) {
            this.currentStep--;
        }
    }

    skipPayment(): void {
        this.confirmBooking();
    }

    confirmBooking(): void {
        if (!this.place) return;

        // Check authentication status with detailed logging
        if (!this.checkAuthenticationStatus()) {
            console.log('Authentication failed - redirecting to login');
            alert('Vous devez être connecté pour effectuer une réservation. Veuillez vous reconnecter.');
            this.router.navigate(['/auth/login'], {
                queryParams: { returnUrl: this.router.url }
            });
            return;
        }

        this.isProcessing = true;

        const startDate = new Date(this.checkInDate);
        const endDate = new Date(this.checkOutDate);
        const totalPrice = this.calculateTotalPrice();

        // Additional validation for dates
        if (startDate >= endDate) {
            this.isProcessing = false;
            alert('La date de départ doit être postérieure à la date d\'arrivée');
            return;
        }

        const today = new Date();
        today.setHours(0,0,0,0);
        if (startDate <= today) {
            this.isProcessing = false;
            alert('La date d\'arrivée doit être postérieure à aujourd\'hui');
            return;
        }

        console.log('Creating booking with dates:', {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            place: this.place.id,
            guests: this.guests,
            totalPrice
        });

        this.reservationService.createBooking({
            place: this.place,
            startDate,
            endDate,
            guests: this.guests,
            totalPrice,
            guestInfo: {
                name: this.guestName,
                email: this.guestEmail,
                phone: this.guestPhone,
                specialRequests: this.specialRequests
            },
            paymentMethod: this.paymentMethod
        }).subscribe({
            next: (booking) => {
                this.isProcessing = false;
                console.log('Booking created successfully:', booking);
                // Defer step change to next tick to avoid NG0100
                setTimeout(() => {
                    this.currentStep = 3;
                    this.cdr.detectChanges();
                }, 0);

                // Redirect to reservations after 3 seconds
                setTimeout(() => {
                    this.router.navigate(['/locataire/reservations']);
                }, 3000);
            },
            error: (error) => {
                this.isProcessing = false;
                console.error('Erreur lors de la réservation:', error);
                
                // More specific error handling
                if (error.status === 401) {
                    alert('Votre session a expiré. Veuillez vous reconnecter.');
                    this.router.navigate(['/auth/login'], {
                        queryParams: { returnUrl: this.router.url }
                    });
                } else if (error.status === 400) {
                    const errorMsg = error.error?.message || error.message || 'Données invalides';
                    alert(`Erreur de validation: ${errorMsg}. Vérifiez les dates et les informations saisies.`);
                } else if (error.status === 409) {
                    alert('Ces dates ne sont pas disponibles. Veuillez choisir d\'autres dates.');
                } else if (error.status === 500) {
                    alert('Erreur serveur. Veuillez réessayer plus tard ou contactez le support.');
                } else {
                    const errorMsg = error.message || 'Erreur inconnue';
                    alert(`Erreur lors de la création de la réservation: ${errorMsg}`);
                }
            }
        });
    }

    goBack(): void {
        if (this.place) {
            this.router.navigate(['/locataire/place', this.place.id]);
        } else {
            this.router.navigate(['/locataire/search']);
        }
    }

    formatDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
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

    getBookingNumber(): string {
        // Return the pre-generated booking number to avoid ExpressionChangedAfterItHasBeenCheckedError
        return this.bookingNumber;
    }

    navigateToReservations(): void {
        this.router.navigate(['/locataire/reservations']);
    }

    checkAuthenticationStatus(): boolean {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        const user = this.authService.currentUser;
        const isAuthenticated = this.authService.isAuthenticated;
        
        console.log('Authentication Status Check:', {
            hasToken: !!token,
            hasUser: !!user,
            isAuthenticated: isAuthenticated,
            token: token ? token.substring(0, 20) + '...' : 'none'
        });
        
        return isAuthenticated && !!token && !!user;
    }
}