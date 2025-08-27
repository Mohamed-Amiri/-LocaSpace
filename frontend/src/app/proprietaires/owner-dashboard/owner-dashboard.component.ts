import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProprietairesService, Property, BookingRequest } from '../services/proprietaires.service';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './owner-dashboard.component.html',
  styleUrls: ['./owner-dashboard.component.scss']
})
export class OwnerDashboardComponent implements OnInit {
  properties: Property[] = [];
  recentBookingRequests: BookingRequest[] = [];
  stats: any = {};
  loading = true;

  constructor(private proprietairesService: ProprietairesService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }





  private loadDashboardData(): void {
    const properties$ = this.proprietairesService.getOwnerProperties().pipe(catchError(() => of([] as Property[])));
    const requests$ = this.proprietairesService.getBookingRequests().pipe(catchError(() => of([] as BookingRequest[])));

    forkJoin({
      properties: properties$,
      bookingRequests: requests$
    }).pipe(finalize(() => { this.loading = false; this.cdr.detectChanges(); }))
    .subscribe({
      next: (data) => {
        this.properties = data.properties;
        this.recentBookingRequests = (data.bookingRequests || []).slice(0, 5);
        
        // Calculate monthly revenue from approved bookings in current month
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthlyRevenue = (data.bookingRequests || [])
          .filter(r => {
            const bookingDate = new Date(r.checkIn);
            return r.status === 'approved' && 
                   bookingDate.getMonth() === currentMonth && 
                   bookingDate.getFullYear() === currentYear;
          })
          .reduce((total, booking) => total + (booking.totalPrice || 0), 0);
        
        // Initialize with calculated stats only
        this.stats = {
          totalProperties: this.properties.length,
          pendingRequests: (data.bookingRequests || []).filter(r => r.status === 'pending').length,
          monthlyRevenue: monthlyRevenue,
          activeBookings: (data.bookingRequests || []).filter(r => r.status === 'approved').length
        };
        
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        // Keep empty arrays and stats with zero values
        this.properties = [];
        this.recentBookingRequests = [];
        this.stats = {
          totalProperties: 0,
          pendingRequests: 0,
          monthlyRevenue: 0,
          activeBookings: 0
        };
        this.cdr.detectChanges();
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'pending': return 'accent';
      case 'approved': return 'primary';
      case 'rejected': return 'warn';
      default: return '';
    }
  }

  getPropertyStatusChip(property: Property): { text: string, color: string } {
    if (!property.isActive) {
      return { text: 'Inactif', color: 'warn' };
    }
    return { text: 'Actif', color: 'primary' };
  }

  calculateNights(checkIn: Date, checkOut: Date): number {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}