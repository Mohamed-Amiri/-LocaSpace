import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Booking, Place } from './locataires.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = `${environment.apiUrl}/reservations`;

  constructor(private http: HttpClient) {}

  // Method to clear reviews for testing (call from browser console)
  clearAllReviews(): void {
    localStorage.removeItem('user_reviews');
    console.log('All reviews cleared');
  }

  // Map backend -> frontend booking shape
  private mapReservationToBooking(r: any): Booking {
    return {
      id: r.id,
      placeId: r.lieu?.id,
      userId: r.locataire?.id,
      startDate: new Date(r.dateDebut),
      endDate: new Date(r.dateFin),
      totalPrice: r.totalPrice || 0,
      status: this.mapBackendStatusToFrontend(r.statut),
      place: r.lieu ? {
        id: r.lieu.id,
        title: r.lieu.titre,
        description: r.lieu.description,
        price: r.lieu.prix,
        location: r.lieu.adresse,
        images: r.lieu.photos || [],
        amenities: r.lieu.amenities || [],
        rating: r.lieu.averageRating || 0,
        reviews: [],
        availability: r.lieu.valide
      } : undefined
    };
  }

  // Map backend status to frontend status
  private mapBackendStatusToFrontend(backendStatus: string): Booking['status'] {
    const statusMap: { [key: string]: Booking['status'] } = {
      'EN_ATTENTE': 'pending',
      'CONFIRMEE': 'confirmed', 
      'REFUSEE': 'cancelled',
      'ANNULEE': 'cancelled'
    };
    return statusMap[backendStatus] || 'pending';
  }

  // Map frontend status to backend status
  private mapFrontendStatusToBackend(frontendStatus: Booking['status']): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'EN_ATTENTE',
      'confirmed': 'CONFIRMEE',
      'cancelled': 'ANNULEE'
    };
    return statusMap[frontendStatus] || 'EN_ATTENTE';
  }

  createBooking(bookingData: {
    place: Place;
    startDate: Date;
    endDate: Date;
    guests: number;
    totalPrice: number;
    guestInfo?: {
      name: string;
      email: string;
      phone?: string;
      specialRequests?: string;
    };
    paymentMethod?: string;
  }): Observable<Booking> {
    const payload = {
      placeId: bookingData.place.id,
      startDate: bookingData.startDate.toISOString(),
      endDate: bookingData.endDate.toISOString(),
      guests: bookingData.guests,
      totalPrice: bookingData.totalPrice
    };
    console.log('Creating reservation with payload:', payload);
    return this.http.post<any>(`${this.apiUrl}`, payload).pipe(
      map(r => this.mapReservationToBooking(r)),
      catchError(error => {
        console.error('Error creating reservation:', error);
        throw error;
      })
    );
  }

  getUserBookings(): Observable<Booking[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my`).pipe(map(list => list.map(r => this.mapReservationToBooking(r))));
  }

  cancelBooking(bookingId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${bookingId}/cancel`);
  }

  getBookingById(bookingId: number): Observable<Booking | undefined> {
    return this.getUserBookings().pipe(map(list => list.find(b => b.id === bookingId)));
  }

  updateBookingStatus(bookingId: number, status: 'pending' | 'confirmed' | 'cancelled'): Observable<Booking | undefined> {
    // Optional: implement when backend supports tenant status update
    return of(undefined);
  }

  confirmBooking(bookingId: number): Observable<void> {
    // For tenant, confirming may be N/A; keep placeholder
    return of(void 0);
  }
}