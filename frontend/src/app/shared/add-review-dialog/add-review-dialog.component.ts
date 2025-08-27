import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from '../../material.module';
import { Booking, Place } from '../../locataire/services/locataires.service';

@Component({
  selector: 'app-add-review-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './add-review-dialog.component.html',
  styleUrls: ['./add-review-dialog.component.scss']
})
export class AddReviewDialogComponent {
  rating = 0;
  comment = '';
  hoverRating = 0;

  constructor(
    public dialogRef: MatDialogRef<AddReviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { booking: Booking; place?: Place }
  ) {}

  onCancel(): void {
    this.dialogRef.close(null);
  }

  onSubmit(): void {
    if (this.rating === 0) {
      return; // Don't submit without rating
    }

    const review = {
      rating: this.rating,
      comment: this.comment.trim(),
      placeId: this.data.booking.placeId,
      bookingId: this.data.booking.id
    };

    this.dialogRef.close(review);
  }

  setRating(rating: number): void {
    this.rating = rating;
  }

  setHoverRating(rating: number): void {
    this.hoverRating = rating;
  }

  clearHoverRating(): void {
    this.hoverRating = 0;
  }

  getStarClass(starNumber: number): string {
    const activeRating = this.hoverRating || this.rating;
    return starNumber <= activeRating ? 'star-filled' : 'star-empty';
  }

  canSubmit(): boolean {
    return this.rating > 0 && this.comment.trim().length >= 10;
  }
}