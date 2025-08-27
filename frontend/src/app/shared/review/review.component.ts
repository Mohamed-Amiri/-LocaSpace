import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { LocatairesService, Review } from '../../locataire/services/locataires.service';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {
  @Input() placeId!: number;
  @Input() reviews: Review[] = [];
  
  reviewForm: FormGroup;
  showAddReview = false;
  loading = false;
  averageRating = 0;

  constructor(
    private fb: FormBuilder,
    private locatairesService: LocatairesService
  ) {
    this.reviewForm = this.fb.group({
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.calculateAverageRating();
  }

  calculateAverageRating(): void {
    if (this.reviews.length > 0) {
      const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
      this.averageRating = sum / this.reviews.length;
    }
  }

  toggleAddReview(): void {
    this.showAddReview = !this.showAddReview;
    if (!this.showAddReview) {
      this.reviewForm.reset({ rating: 5, comment: '' });
    }
  }

  submitReview(): void {
    if (this.reviewForm.valid) {
      this.loading = true;
      const reviewData = this.reviewForm.value;

      this.locatairesService.addReview(this.placeId, reviewData).subscribe({
        next: (newReview) => {
          this.reviews.unshift(newReview);
          this.calculateAverageRating();
          this.reviewForm.reset({ rating: 5, comment: '' });
          this.showAddReview = false;
          this.loading = false;
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout de l\'avis:', error);
          this.loading = false;
        }
      });
    }
  }

  getStarArray(rating: number): boolean[] {
    return Array(5).fill(false).map((_, i) => i < rating);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}