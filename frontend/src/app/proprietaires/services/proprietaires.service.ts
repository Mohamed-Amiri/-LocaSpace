import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, retry, delay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Property {
  id?: number;
  title: string;
  description: string;
  price: number;
  location: string;
  photos: string[];
  amenities: string[];
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  isActive: boolean;
  ownerId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BookingRequest {
  id: number;
  propertyId: number;
  propertyTitle: string;
  tenantId: number;
  tenantName: string;
  tenantEmail: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  message?: string;
  createdAt: Date;
}

export interface CalendarEvent {
  id?: number;
  propertyId: number;
  startDate: Date;
  endDate: Date;
  type: 'booked' | 'blocked' | 'available';
  title?: string;
  bookingId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProprietairesService {
  private apiUrl = `${environment.apiUrl}/lieux`;
  private propertiesSubject = new BehaviorSubject<Property[]>([]);
  public properties$ = this.propertiesSubject.asObservable();

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {
    console.log('ProprietairesService initialized with API URL:', this.apiUrl);
  }

  // Enhanced error handling
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('ProprietairesService error:', error);
    
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Erreur client: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 0:
          errorMessage = 'Impossible de contacter le serveur. Vérifiez que le backend est démarré.';
          break;
        case 400:
          errorMessage = 'Données invalides';
          break;
        case 401:
          errorMessage = 'Non autorisé. Veuillez vous reconnecter.';
          break;
        case 403:
          errorMessage = 'Accès refusé';
          break;
        case 404:
          errorMessage = 'Ressource non trouvée';
          break;
        case 409:
          errorMessage = 'Conflit de données';
          break;
        case 500:
          errorMessage = 'Erreur serveur interne';
          break;
        default:
          errorMessage = `Erreur HTTP ${error.status}: ${error.statusText}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }

  // Property Management
  getOwnerProperties(): Observable<Property[]> {
    console.log('Fetching owner properties from:', `${this.apiUrl}/my`);
    return this.http.get<any[]>(`${this.apiUrl}/my`, this.httpOptions).pipe(
      retry(2),
      map(lieuResponses => {
        console.log('Received lieu responses:', lieuResponses);
        if (!Array.isArray(lieuResponses)) {
          console.warn('Expected array but received:', lieuResponses);
          return [];
        }
        return lieuResponses.map(lieu => this.transformLieuToProperty(lieu));
      }),
      catchError(this.handleError.bind(this))
    );
  }

  getPropertyById(id: number): Observable<Property> {
    console.log('Fetching property by ID:', id);
    return this.http.get<any>(`${this.apiUrl}/${id}`, this.httpOptions).pipe(
      retry(1),
      map(lieu => {
        console.log('Received lieu for ID', id, ':', lieu);
        return this.transformLieuToProperty(lieu);
      }),
      catchError(this.handleError.bind(this))
    );
  }

  createProperty(property: Omit<Property, 'id'>): Observable<Property> {
    // Transform frontend property to backend LieuRequest format
    const lieuRequest = {
      titre: property.title,
      description: property.description,
      type: this.mapPropertyTypeToBackend(property.propertyType),
      prix: property.price,
      adresse: property.location,
      photos: property.photos || [],
      // Enhanced property details
      maxGuests: property.maxGuests,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      amenities: property.amenities || [],
      // Additional metadata
      valide: property.isActive !== false // Default to true if not specified
    };
    
    console.log('Sending property creation request:', lieuRequest);
    
    return this.http.post<any>(`${this.apiUrl}`, lieuRequest, this.httpOptions).pipe(
      map(lieu => {
        console.log('Received property creation response:', lieu);
        const transformedProperty = this.transformLieuToProperty(lieu);
        // Update the properties list
        this.refreshProperties();
        return transformedProperty;
      }),
      catchError(this.handleError.bind(this))
    );
  }

  updateProperty(id: number, property: Partial<Property>): Observable<Property> {
    const lieuRequest: any = {};
    
    // Only include fields that are provided
    if (property.title !== undefined) lieuRequest.titre = property.title;
    if (property.description !== undefined) lieuRequest.description = property.description;
    if (property.propertyType !== undefined) lieuRequest.type = this.mapPropertyTypeToBackend(property.propertyType);
    if (property.price !== undefined) lieuRequest.prix = property.price;
    if (property.location !== undefined) lieuRequest.adresse = property.location;
    if (property.photos !== undefined) lieuRequest.photos = property.photos;
    if (property.maxGuests !== undefined) lieuRequest.maxGuests = property.maxGuests;
    if (property.bedrooms !== undefined) lieuRequest.bedrooms = property.bedrooms;
    if (property.bathrooms !== undefined) lieuRequest.bathrooms = property.bathrooms;
    if (property.amenities !== undefined) lieuRequest.amenities = property.amenities;
    if (property.isActive !== undefined) lieuRequest.valide = property.isActive;
    
    console.log('Sending property update request for ID', id, ':', lieuRequest);
    
    return this.http.put<any>(`${this.apiUrl}/${id}`, lieuRequest, this.httpOptions).pipe(
      map(lieu => {
        console.log('Received property update response:', lieu);
        const transformedProperty = this.transformLieuToProperty(lieu);
        // Update the properties list
        this.refreshProperties();
        return transformedProperty;
      }),
      catchError(this.handleError.bind(this))
    );
  }

  deleteProperty(id: number): Observable<void> {
    console.log('Deleting property with ID:', id);
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.httpOptions).pipe(
      map(() => {
        console.log('Property deleted successfully:', id);
        // Update the properties list
        this.refreshProperties();
      }),
      catchError(this.handleError.bind(this))
    );
  }

  uploadPropertyPhotos(propertyId: number, photos: File[]): Observable<string[]> {
    console.log('Uploading', photos.length, 'photos for property', propertyId);
    const formData = new FormData();
    photos.forEach((photo, index) => {
      console.log(`Adding photo ${index + 1}:`, photo.name, 'Size:', photo.size);
      formData.append('photos', photo);
    });
    
    return this.http.post<string[]>(`${this.apiUrl}/${propertyId}/photos`, formData).pipe(
      map(urls => {
        console.log('Photos uploaded successfully:', urls);
        return urls;
      }),
      catchError(this.handleError.bind(this))
    );
  }

  deletePropertyPhoto(propertyId: number, url: string): Observable<void> {
    console.log('Deleting photo for property', propertyId, ':', url);
    return this.http.delete<void>(`${this.apiUrl}/${propertyId}/photos`, {
      params: { url }
    }).pipe(
      map(() => {
        console.log('Photo deleted successfully');
      }),
      catchError(this.handleError.bind(this))
    );
  }

  reorderPropertyPhotos(propertyId: number, orderedUrls: string[]): Observable<void> {
    console.log('Reordering photos for property', propertyId, ':', orderedUrls);
    return this.http.put<void>(`${this.apiUrl}/${propertyId}/photos/order`, orderedUrls, this.httpOptions).pipe(
      map(() => {
        console.log('Photos reordered successfully');
      }),
      catchError(this.handleError.bind(this))
    );
  }

  private mapPropertyTypeToBackend(frontendType: string): string {
    const typeMap: { [key: string]: string } = {
      'apartment': 'Appartement',
      'house': 'Maison',
      'villa': 'Villa',
      'studio': 'Studio',
      'loft': 'Loft',
      'chalet': 'Chambre' // Mapping chalet to chambre as backend doesn't have chalet
    };
    return typeMap[frontendType] || 'Appartement';
  }

  private mapPropertyTypeToFrontend(backendType: string): string {
    const typeMap: { [key: string]: string } = {
      'Appartement': 'apartment',
      'Maison': 'house',
      'Villa': 'villa',
      'Studio': 'studio',
      'Loft': 'loft',
      'Chambre': 'chalet'
    };
    return typeMap[backendType] || 'apartment';
  }

  private transformLieuToProperty(lieu: any): Property {
    // Enhanced transformation with better error handling and data mapping
    const property: Property = {
      id: lieu.id,
      title: lieu.titre || '',
      description: lieu.description || '',
      price: this.parseNumber(lieu.prix, 0),
      location: lieu.adresse || '',
      photos: Array.isArray(lieu.photos) ? lieu.photos : [],
      // Enhanced field handling with backend data or fallbacks
      amenities: Array.isArray(lieu.amenities) ? lieu.amenities : [],
      maxGuests: this.parseNumber(lieu.maxGuests, 2), // Default to 2 guests
      bedrooms: this.parseNumber(lieu.bedrooms, 1), // Default to 1 bedroom
      bathrooms: this.parseNumber(lieu.bathrooms, 1), // Default to 1 bathroom
      propertyType: this.mapPropertyTypeToFrontend(lieu.type || 'Appartement'),
      isActive: lieu.valide !== false, // Default to true unless explicitly false
      ownerId: lieu.owner?.id || lieu.ownerId || 0,
      createdAt: lieu.createdAt ? new Date(lieu.createdAt) : undefined,
      updatedAt: lieu.updatedAt ? new Date(lieu.updatedAt) : undefined
    };
    
    console.log('Transformed backend lieu to frontend property:', { lieu, property });
    return property;
  }

  // Helper method to safely parse numbers
  private parseNumber(value: any, defaultValue: number = 0): number {
    if (typeof value === 'number' && !isNaN(value)) {
      return value;
    }
    if (typeof value === 'string') {
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? defaultValue : parsed;
    }
    return defaultValue;
  }

  // Booking Requests Management
  getBookingRequests(): Observable<BookingRequest[]> {
    console.log('Fetching booking requests from:', `${environment.apiUrl}/reservations/owner`);
    console.log('Using headers:', this.httpOptions.headers);
    
    // First check if we have a valid token
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('No auth token found');
      return throwError(() => new Error('No authentication token'));
    }
    
    // Fetch owner reservations and map to BookingRequest shape expected by UI
    return this.http.get<any[]>(`${environment.apiUrl}/reservations/owner`, this.httpOptions).pipe(
      retry(1),
      map((reservations) => {
        console.log('Raw API response:', reservations);
        console.log('Response type:', typeof reservations);
        console.log('Is array:', Array.isArray(reservations));
        
        if (!Array.isArray(reservations)) {
          console.warn('Expected array but received:', reservations);
          return [];
        }
        
        const mappedRequests = reservations.map((r: any) => {
          console.log('Mapping reservation:', r);
          const mapped = this.mapReservationToBookingRequest(r);
          console.log('Mapped to booking request:', mapped);
          return mapped;
        });
        
        console.log('Final mapped booking requests:', mappedRequests);
        return mappedRequests;
      }),
      catchError((error) => {
        console.error('API call failed:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        console.error('Error URL:', error.url);
        
        // Re-throw the error for the component to handle
        return throwError(() => error);
      })
    );
  }

  // Map backend reservation to frontend BookingRequest
  private mapReservationToBookingRequest(r: any): BookingRequest {
    console.log('Mapping reservation data:', r);
    
    if (!r) {
      console.warn('Null reservation data received');
      return {} as BookingRequest;
    }
    
    const mapped: BookingRequest = {
      id: r.id || 0,
      propertyId: r.lieu?.id || 0,
      propertyTitle: r.lieu?.titre || 'Titre non disponible',
      tenantId: r.locataire?.id || 0,
      tenantName: r.locataire?.nom || 'Nom non disponible',
      tenantEmail: r.locataire?.email || 'Email non disponible',
      checkIn: r.dateDebut ? new Date(r.dateDebut) : new Date(),
      checkOut: r.dateFin ? new Date(r.dateFin) : new Date(),
      guests: this.parseNumber(r.guests, 1),
      totalPrice: this.parseNumber(r.totalPrice, 0),
      status: this.mapBackendStatusToFrontend(r.statut),
      message: r.message || '',
      createdAt: r.createdAt ? new Date(r.createdAt) : (r.dateDebut ? new Date(r.dateDebut) : new Date())
    };
    
    console.log('Mapped booking request:', mapped);
    return mapped;
  }

  // Map backend status to frontend status for BookingRequest
  private mapBackendStatusToFrontend(backendStatus: string): BookingRequest['status'] {
    const statusMap: { [key: string]: BookingRequest['status'] } = {
      'EN_ATTENTE': 'pending',
      'CONFIRMEE': 'approved',
      'REFUSEE': 'rejected',
      'ANNULEE': 'cancelled'
    };
    return statusMap[backendStatus] || 'pending';
  }

  // Map frontend response to backend status
  private mapFrontendResponseToBackend(response: 'approved' | 'rejected'): string {
    const statusMap: { [key: string]: string } = {
      'approved': 'CONFIRMEE',
      'rejected': 'REFUSEE'
    };
    return statusMap[response];
  }

  respondToBookingRequest(requestId: number, response: 'approved' | 'rejected', message?: string): Observable<BookingRequest> {
    // Map frontend status to backend
    const backendStatus = this.mapFrontendResponseToBackend(response);
    console.log('Responding to booking request', requestId, 'with status:', backendStatus);
    
    return this.http.put<any>(`${environment.apiUrl}/reservations/${requestId}/status`, {
      status: backendStatus,
      message
    }, this.httpOptions).pipe(
      map((r: any) => {
        console.log('Booking response updated:', r);
        return this.mapReservationToBookingRequest(r);
      }),
      catchError(this.handleError.bind(this))
    );
  }

  // Calendar Management
  getPropertyCalendar(propertyId: number, startDate: Date, endDate: Date): Observable<CalendarEvent[]> {
    console.log('Fetching calendar for property', propertyId, 'from', startDate, 'to', endDate);
    return this.http.get<CalendarEvent[]>(`${this.apiUrl}/properties/${propertyId}/calendar`, {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }
    }).pipe(
      retry(1),
      map(events => {
        console.log('Received calendar events:', events);
        return Array.isArray(events) ? events : [];
      }),
      catchError(this.handleError.bind(this))
    );
  }

  blockDates(propertyId: number, startDate: Date, endDate: Date, title?: string): Observable<CalendarEvent> {
    console.log('Blocking dates for property', propertyId, 'from', startDate, 'to', endDate);
    return this.http.post<CalendarEvent>(`${this.apiUrl}/properties/${propertyId}/calendar/block`, {
      startDate,
      endDate,
      title
    }, this.httpOptions).pipe(
      map(event => {
        console.log('Dates blocked successfully:', event);
        return event;
      }),
      catchError(this.handleError.bind(this))
    );
  }

  unblockDates(eventId: number): Observable<void> {
    console.log('Unblocking dates for event', eventId);
    return this.http.delete<void>(`${this.apiUrl}/calendar/events/${eventId}`, this.httpOptions).pipe(
      map(() => {
        console.log('Dates unblocked successfully');
      }),
      catchError(this.handleError.bind(this))
    );
  }

  // Statistics
  getOwnerStats(): Observable<any> {
    console.log('Fetching owner statistics');
    return this.http.get(`${this.apiUrl}/stats`, this.httpOptions).pipe(
      retry(1),
      map(stats => {
        console.log('Received owner stats:', stats);
        return stats;
      }),
      catchError(this.handleError.bind(this))
    );
  }

  refreshProperties(): void {
    console.log('Refreshing properties list');
    this.getOwnerProperties().subscribe({
      next: (properties) => {
        console.log('Properties refreshed successfully:', properties.length, 'properties');
        this.propertiesSubject.next(properties);
      },
      error: (error) => {
        console.error('Error refreshing properties:', error);
        // Don't update the subject if there's an error, keep existing data
      }
    });
  }

  // Health check method
  checkBackendHealth(): Observable<boolean> {
    console.log('Checking backend health');
    return this.http.get(`${environment.apiUrl}/health`, this.httpOptions).pipe(
      map(() => {
        console.log('Backend is healthy');
        return true;
      }),
      catchError((error) => {
        console.warn('Backend health check failed:', error);
        return throwError(() => false);
      })
    );
  }
}