import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';

export interface ReviewFormData {
  rating: number;
  comment: string;
}

@Component({
  selector: 'app-avis-form',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './avis-form.html',
  styleUrl: './avis-form.scss'
})
export class AvisForm {
  @Input() placeName: string = '';
  @Input() disabled: boolean = false;
  @Output() reviewSubmit = new EventEmitter<ReviewFormData>();
  @Output() cancel = new EventEmitter<void>();

  rating: number = 0;
  comment: string = '';
  hoveredRating: number = 0;

  setRating(rating: number): void {
    this.rating = rating;
  }

  setHoveredRating(rating: number): void {
    this.hoveredRating = rating;
  }

  clearHoveredRating(): void {
    this.hoveredRating = 0;
  }

  getStarClass(starIndex: number): string {
    const currentRating = this.hoveredRating || this.rating;
    return starIndex <= currentRating ? 'filled' : 'empty';
  }

  onSubmit(): void {
    if (this.rating === 0) {
      return;
    }

    this.reviewSubmit.emit({
      rating: this.rating,
      comment: this.comment.trim()
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }

  get isValid(): boolean {
    return this.rating > 0 && this.comment.trim().length >= 10;
  }
}
