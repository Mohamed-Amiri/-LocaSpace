import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { LocatairesService, Place, Booking } from '../../locataire/services/locataires.service';

export interface BookingDialogData {
  place: Place;
}

@Component({
  selector: 'app-booking-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './booking-dialog.component.html',
  styleUrls: ['./booking-dialog.component.scss']
})
export class BookingDialogComponent implements OnInit {
  bookingForm: FormGroup;
  loading = false;
  totalPrice = 0;
  numberOfNights = 0;
  minDate = new Date();

  constructor(
    private fb: FormBuilder,
    private locatairesService: LocatairesService,
    public dialogRef: MatDialogRef<BookingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BookingDialogData
  ) {
    this.bookingForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      guests: [1, [Validators.required, Validators.min(1)]],
      specialRequests: ['']
    });
  }

  ngOnInit(): void {
    this.bookingForm.valueChanges.subscribe(() => {
      this.calculatePrice();
    });
  }

  calculatePrice(): void {
    const startDate = this.bookingForm.get('startDate')?.value;
    const endDate = this.bookingForm.get('endDate')?.value;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const timeDiff = end.getTime() - start.getTime();
      this.numberOfNights = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      if (this.numberOfNights > 0) {
        this.totalPrice = this.numberOfNights * this.data.place.price;
      } else {
        this.totalPrice = 0;
        this.numberOfNights = 0;
      }
    }
  }

  onSubmit(): void {
    if (this.bookingForm.valid && this.totalPrice > 0) {
      this.loading = true;
      
      const bookingData: Partial<Booking> = {
        placeId: this.data.place.id,
        startDate: this.bookingForm.get('startDate')?.value,
        endDate: this.bookingForm.get('endDate')?.value,
        totalPrice: this.totalPrice,
        status: 'pending'
      };

      this.locatairesService.createBooking(bookingData).subscribe({
        next: (booking) => {
          this.loading = false;
          this.dialogRef.close(booking);
        },
        error: (error) => {
          console.error('Erreur lors de la réservation:', error);
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  isFormValid(): boolean {
    return this.bookingForm.valid && this.totalPrice > 0;
  }
}