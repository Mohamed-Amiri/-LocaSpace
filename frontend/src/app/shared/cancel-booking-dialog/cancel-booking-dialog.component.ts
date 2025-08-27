import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from '../../material.module';
import { Booking } from '../../locataire/services/locataires.service';

@Component({
  selector: 'app-cancel-booking-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './cancel-booking-dialog.component.html',
  styleUrls: ['./cancel-booking-dialog.component.scss']
})
export class CancelBookingDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CancelBookingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { booking: Booking }
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getDuration(): number {
    const start = new Date(this.data.booking.startDate);
    const end = new Date(this.data.booking.endDate);
    const timeDiff = end.getTime() - start.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }
}