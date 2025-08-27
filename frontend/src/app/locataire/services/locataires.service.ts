import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface Place {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  amenities: string[];
  rating: number;
  reviews: Review[];
  availability: boolean;
}

export interface Review {
  id: number;
  userId: number;
  userName: string;
  placeId: number;
  bookingId?: number;
  rating: number;
  comment: string;
  date: Date;
}

export interface Booking {
  id: number;
  placeId: number;
  userId: number;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  place?: Place;
  guests?: number;
  guestInfo?: {
    name: string;
    email: string;
    phone?: string;
    specialRequests?: string;
  };
  paymentMethod?: string;
}

export interface SearchFilters {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
  rating?: number;
}

// Backend API interfaces
interface LieuResponse {
  id: number;
  titre: string;
  description: string;
  type: string;
  prix: number;
  adresse: string;
  valide: boolean;
  photos: string[];
  owner?: {
    id: number;
    nom: string;
    email: string;
    role: string;
  };
  averageRating?: number;
  reviewCount?: number;
}

@Injectable({
  providedIn: 'root'
})
export class LocatairesService {
  private apiUrl = 'http://localhost:8082/api';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
  }

  private mapLieuResponseToPlace(lieu: LieuResponse): Place {
    return {
      id: lieu.id,
      title: lieu.titre,
      description: lieu.description,
      price: lieu.prix,
      location: lieu.adresse,
      images: lieu.photos || [],
      amenities: [], // Would need to add amenities to backend
      rating: lieu.averageRating || 0,
      reviews: [], // Reviews loaded separately
      availability: lieu.valide
    };
  }

  // Places API
  searchPlaces(filters: SearchFilters): Observable<Place[]> {
    let params = new URLSearchParams();
    
    if (filters.location) params.append('city', filters.location);
    if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    
    const queryString = params.toString();
    const url = queryString ? `${this.apiUrl}/lieux/search?${queryString}` : `${this.apiUrl}/lieux`;

    return this.http.get<LieuResponse[]>(url).pipe(
      map(responses => responses.map(lieu => this.mapLieuResponseToPlace(lieu)))
    );
  }

  getPlaceById(id: number): Observable<Place> {
    return this.http.get<LieuResponse>(`${this.apiUrl}/lieux/${id}`).pipe(
      map(lieu => this.mapLieuResponseToPlace(lieu))
    );
  }

  getAllPlaces(): Observable<Place[]> {
    return this.http.get<LieuResponse[]>(`${this.apiUrl}/lieux`).pipe(
      map(responses => responses.map(lieu => this.mapLieuResponseToPlace(lieu)))
    );
  }

  // Bookings API (using real API calls - reservation controller should be implemented)
  createBooking(booking: Partial<Booking>): Observable<Booking> {
    // TODO: Implement when reservation controller is ready
    return throwError(() => new Error('Booking creation not yet implemented'));
  }

  getUserBookings(): Observable<Booking[]> {
    // TODO: Implement when reservation controller is ready
    return throwError(() => new Error('Get user bookings not yet implemented'));
  }

  cancelBooking(bookingId: number): Observable<void> {
    // TODO: Implement when reservation controller is ready
    return throwError(() => new Error('Booking cancellation not yet implemented'));
  }

  // Reviews API (delegated to ReviewService)
  addReview(placeId: number, review: Partial<Review>): Observable<Review> {
    // This should use ReviewService instead
    return throwError(() => new Error('Use ReviewService.addReview() instead'));
  }

  getPlaceReviews(placeId: number): Observable<Review[]> {
    // This should use ReviewService instead
    return throwError(() => new Error('Use ReviewService.getReviewsForPlace() instead'));
  }


}