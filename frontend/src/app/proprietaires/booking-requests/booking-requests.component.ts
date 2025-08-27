import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProprietairesService, BookingRequest } from '../services/proprietaires.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-booking-requests',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTabsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './booking-requests.component.html',
  styleUrls: ['./booking-requests.component.scss']
})
export class BookingRequestsComponent implements OnInit {
  allRequests: BookingRequest[] = [];
  pendingRequests: BookingRequest[] = [];
  approvedRequests: BookingRequest[] = [];
  rejectedRequests: BookingRequest[] = [];
  loading = true;

  constructor(
    private proprietairesService: ProprietairesService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadBookingRequests();
  }

  loadBookingRequests(): void {
    this.loading = true;
    console.log('Loading booking requests...');
    
    this.proprietairesService.getBookingRequests()
      .pipe(
        catchError((error) => {
          console.error('Error loading booking requests:', error);
          console.error('Error details:', {
            status: error.status,
            statusText: error.statusText,
            url: error.url,
            message: error.message
          });
          
          // Show specific error message based on status
          let errorMessage = 'Erreur lors du chargement des demandes';
          if (error.status === 401) {
            errorMessage = 'Non autorisé - Veuillez vous reconnecter';
          } else if (error.status === 403) {
            errorMessage = 'Accès refusé - Vérifiez vos permissions';
          } else if (error.status === 404) {
            errorMessage = 'Endpoint non trouvé';
          } else if (error.status === 0) {
            errorMessage = 'Erreur de connexion au serveur';
          }
          
          this.snackBar.open(errorMessage, 'Fermer', { 
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          
          // Return empty array instead of mock data
          return of([]);
        }),
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe((requests) => {
        console.log('Received booking requests:', requests);
        this.allRequests = requests || [];
        this.categorizeRequests();
        
        if (this.allRequests.length === 0) {
          console.log('No booking requests found');
          this.snackBar.open('Aucune demande de réservation trouvée', 'Fermer', {
            duration: 3000,
            panelClass: ['info-snackbar']
          });
        } else {
          console.log(`Found ${this.allRequests.length} booking requests`);
        }
      });
  }

  private categorizeRequests(): void {
    this.pendingRequests = this.allRequests.filter(r => r.status === 'pending');
    this.approvedRequests = this.allRequests.filter(r => r.status === 'approved');
    this.rejectedRequests = this.allRequests.filter(r => r.status === 'rejected');
  }

  respondToRequest(request: BookingRequest, response: 'approved' | 'rejected', message?: string): void {
    this.proprietairesService.respondToBookingRequest(request.id, response, message).subscribe({
      next: (updatedRequest) => {
        // Update the request in all arrays
        const index = this.allRequests.findIndex(r => r.id === request.id);
        if (index >= 0) {
          this.allRequests[index] = updatedRequest;
        }
        
        this.categorizeRequests();
        
        const action = response === 'approved' ? 'acceptée' : 'refusée';
        this.snackBar.open(`Demande ${action} avec succès`, 'Fermer', { 
          duration: 4000,
          panelClass: response === 'approved' ? ['success-snackbar'] : ['info-snackbar']
        });
      },
      error: (error) => {
        console.error('Error responding to booking request:', error);
        const action = response === 'approved' ? 'accepter' : 'refuser';
        this.snackBar.open(`Erreur lors de ${action} la demande. Veuillez réessayer.`, 'Fermer', { 
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  approveRequest(request: BookingRequest): void {
    this.respondToRequest(request, 'approved');
  }

  rejectRequest(request: BookingRequest): void {
    // Open a more sophisticated dialog for rejection reason
    const reason = prompt('Raison du refus (optionnel):');
    if (reason !== null) { // User didn't cancel the prompt
      this.respondToRequest(request, 'rejected', reason || 'Aucune raison spécifiée');
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'pending': return 'accent';
      case 'approved': return 'primary';
      case 'rejected': return 'warn';
      case 'cancelled': return 'warn';
      default: return '';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'pending': return 'En attente';
      case 'approved': return 'Acceptée';
      case 'rejected': return 'Refusée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'pending': return 'pending_actions';
      case 'approved': return 'check_circle';
      case 'rejected': return 'cancel';
      case 'cancelled': return 'cancel';
      default: return 'help';
    }
  }

  calculateNights(checkIn: Date, checkOut: Date): number {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }


}