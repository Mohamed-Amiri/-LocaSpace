import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Booking, Place } from '../../locataire/services/locataires.service';

@Component({
  selector: 'app-add-review-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-review-dialog.component.html',
  styleUrls: ['./add-review-dialog.component.scss']
})
export class AddReviewDialogComponent {
  @Input() booking!: Booking;
  @Input() place?: Place;
  @Output() submitted = new EventEmitter<{ rating: number; comment: string; placeId: number; bookingId: number }>();
  @Output() cancelled = new EventEmitter<void>();

  rating = 0;
  comment = '';
  hoverRating = 0;

  onCancel(): void {
    this.cancelled.emit();
  }

  onSubmit(): void {
    if (this.rating === 0) return;

    this.submitted.emit({
      rating: this.rating,
      comment: this.comment.trim(),
      placeId: this.booking.placeId,
      bookingId: this.booking.id
    });
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