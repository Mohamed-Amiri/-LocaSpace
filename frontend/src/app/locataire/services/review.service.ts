import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Review } from './locataires.service';

// Backend API interfaces
interface AvisRequest {
  note: number;
  commentaire: string;
}

interface AvisResponse {
  id: number;
  note: number;
  commentaire: string;
  dateCreation?: string;
  auteurId: number;
  auteurNom: string;
  lieuId: number;
  lieuTitre: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = 'http://localhost:8082/api';
  private reviewsSubject = new BehaviorSubject<Review[]>([]);
  public reviews$ = this.reviewsSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
  }

  private mapAvisResponseToReview(avis: AvisResponse): Review {
    return {
      id: avis.id,
      userId: avis.auteurId,
      userName: avis.auteurNom,
      placeId: avis.lieuId,
      rating: avis.note,
      comment: avis.commentaire,
      date: avis.dateCreation ? new Date(avis.dateCreation) : new Date()
    };
  }

  addReview(reviewData: {
    placeId: number;
    bookingId?: number;
    rating: number;
    comment: string;
  }): Observable<Review> {
    const avisRequest: AvisRequest = {
      note: reviewData.rating,
      commentaire: reviewData.comment
    };

    return this.http.post<AvisResponse>(
      `${this.apiUrl}/lieux/${reviewData.placeId}/avis`,
      avisRequest,
      { headers: this.getAuthHeaders() }
    ).pipe(
      map(response => this.mapAvisResponseToReview(response)),
      tap(review => {
        // Update local cache
        const currentReviews = this.reviewsSubject.value;
        this.reviewsSubject.next([...currentReviews, review]);
      }),
      catchError(error => {
        console.error('Error adding review:', error);
        // Fallback to localStorage for development
        return this.addReviewFallback(reviewData);
      })
    );
  }

  getReviewsForPlace(placeId: number): Observable<Review[]> {
    return this.http.get<AvisResponse[]>(
      `${this.apiUrl}/lieux/${placeId}/avis`
    ).pipe(
      map(responses => responses.map(avis => this.mapAvisResponseToReview(avis))),
      catchError(error => {
        console.error('Error fetching place reviews:', error);
        // Fallback to localStorage for development
        return this.getReviewsForPlaceFallback(placeId);
      })
    );
  }

  getUserReviews(): Observable<Review[]> {
    return this.http.get<AvisResponse[]>(
      `${this.apiUrl}/users/me/avis`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      map(responses => responses.map(avis => this.mapAvisResponseToReview(avis))),
      tap(reviews => this.reviewsSubject.next(reviews)),
      catchError(error => {
        console.error('Error fetching user reviews:', error);
        // Fallback to localStorage for development
        return this.getUserReviewsFallback();
      })
    );
  }

  updateReview(reviewId: number, reviewData: {
    rating: number;
    comment: string;
  }): Observable<Review> {
    const avisRequest: AvisRequest = {
      note: reviewData.rating,
      commentaire: reviewData.comment
    };

    return this.http.put<AvisResponse>(
      `${this.apiUrl}/avis/${reviewId}`,
      avisRequest,
      { headers: this.getAuthHeaders() }
    ).pipe(
      map(response => this.mapAvisResponseToReview(response)),
      catchError(error => {
        console.error('Error updating review:', error);
        return throwError(() => error);
      })
    );
  }

  deleteReview(reviewId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/avis/${reviewId}`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error deleting review:', error);
        return throwError(() => error);
      })
    );
  }

  hasUserReviewedBooking(bookingId: number): Observable<boolean> {
    return this.getUserReviews().pipe(
      map(reviews => reviews.some(review => review.bookingId === bookingId))
    );
  }

  getReviewByBookingId(bookingId: number): Observable<Review | undefined> {
    return this.getUserReviews().pipe(
      map(reviews => reviews.find(review => review.bookingId === bookingId))
    );
  }

  // Fallback methods for development (when backend is not available)
  private addReviewFallback(reviewData: {
    placeId: number;
    bookingId?: number;
    rating: number;
    comment: string;
  }): Observable<Review> {
    const stored = localStorage.getItem('user_reviews');
    const currentReviews = stored ? JSON.parse(stored) : [];
    
    const newReview: Review = {
      id: Date.now(),
      userId: 1,
      userName: 'Utilisateur',
      placeId: reviewData.placeId,
      bookingId: reviewData.bookingId,
      rating: reviewData.rating,
      comment: reviewData.comment,
      date: new Date()
    };

    const updatedReviews = [...currentReviews, newReview];
    localStorage.setItem('user_reviews', JSON.stringify(updatedReviews));
    this.reviewsSubject.next(updatedReviews);

    return of(newReview);
  }

  private getReviewsForPlaceFallback(placeId: number): Observable<Review[]> {
    const stored = localStorage.getItem('user_reviews');
    const reviews = stored ? JSON.parse(stored) : [];
    const placeReviews = reviews.filter((review: Review) => review.placeId === placeId);
    return of(placeReviews);
  }

  private getUserReviewsFallback(): Observable<Review[]> {
    const stored = localStorage.getItem('user_reviews');
    const reviews = stored ? JSON.parse(stored) : [];
    const userReviews = reviews.filter((review: Review) => review.userId === 1);
    this.reviewsSubject.next(userReviews);
    return of(userReviews);
  }
}