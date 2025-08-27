import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Review } from '../../lieux/lieu.model';

@Component({
  selector: 'app-avis-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="review-form-overlay" (click)="onBackdrop($event)">
      <div class="review-form-container">
        <div class="review-form-header">
          <h2>Laisser un avis</h2>
          <button class="close-btn" (click)="close.emit()">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form [formGroup]="reviewForm" (ngSubmit)="onSubmit()" class="review-form">
          <!-- Rating Section -->
          <div class="form-group">
            <label>Note générale *</label>
            <div class="rating-input">
              <button 
                type="button"
                *ngFor="let star of [1,2,3,4,5]" 
                class="star-btn"
                [class.active]="star <= selectedRating"
                (click)="setRating(star)"
                (mouseenter)="hoverRating = star"
                (mouseleave)="hoverRating = 0">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                </svg>
              </button>
              <span class="rating-text">{{ getRatingText() }}</span>
            </div>
          </div>

          <!-- Category Ratings -->
          <div class="form-group">
            <label>Évaluations détaillées</label>
            <div class="category-ratings">
              <div class="category-rating" *ngFor="let category of categories">
                <span class="category-name">{{ category.name }}</span>
                <div class="category-stars">
                  <button 
                    type="button"
                    *ngFor="let star of [1,2,3,4,5]" 
                    class="star-btn small"
                    [class.active]="star <= category.rating"
                    (click)="setCategoryRating(category.key, star)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Comment Section -->
          <div class="form-group">
            <label for="comment">Votre commentaire *</label>
            <textarea 
              id="comment"
              formControlName="comment"
              placeholder="Partagez votre expérience..."
              rows="4"
              [class.error]="submitted && reviewForm.get('comment')?.invalid">
            </textarea>
            <div class="char-count">{{ commentLength }}/500</div>
            <div class="error-message" *ngIf="submitted && reviewForm.get('comment')?.invalid">
              Un commentaire est requis (minimum 10 caractères)
            </div>
          </div>

          <!-- Photos Upload -->
          <div class="form-group">
            <label>Ajouter des photos (optionnel)</label>
            <div class="photo-upload">
              <input 
                type="file" 
                #fileInput 
                multiple 
                accept="image/*" 
                (change)="onPhotosSelected($event)"
                style="display: none">
              <button type="button" class="upload-btn" (click)="fileInput.click()">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="9" cy="9" r="2"/>
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                </svg>
                Ajouter des photos
              </button>
              <div class="photo-previews" *ngIf="selectedPhotos.length > 0">
                <div class="photo-preview" *ngFor="let photo of selectedPhotos; let i = index">
                  <img [src]="photo.url" [alt]="photo.name">
                  <button type="button" class="remove-photo" (click)="removePhoto(i)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Anonymous Option -->
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" formControlName="anonymous">
              <span class="checkmark"></span>
              Publier anonymement
            </label>
          </div>

          <!-- Form Actions -->
          <div class="form-actions">
            <button type="button" class="btn-secondary" (click)="close.emit()">
              Annuler
            </button>
            <button type="submit" class="btn-primary" [disabled]="isSubmitting">
              <span *ngIf="isSubmitting" class="spinner"></span>
              {{ isSubmitting ? 'Publication...' : 'Publier l\'avis' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .review-form-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 20px;
    }

    .review-form-container {
      background: white;
      border-radius: 12px;
      width: 100%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }

    .review-form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 24px 0;
      border-bottom: 1px solid #e5e7eb;
      margin-bottom: 24px;
    }

    .review-form-header h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: #1f2937;
    }

    .close-btn {
      background: none;
      border: none;
      padding: 8px;
      cursor: pointer;
      color: #6b7280;
      border-radius: 6px;
      transition: all 0.2s;
    }

    .close-btn:hover {
      background: #f3f4f6;
      color: #1f2937;
    }

    .review-form {
      padding: 0 24px 24px;
    }

    .form-group {
      margin-bottom: 24px;
    }

    .form-group label {
      display: block;
      font-weight: 500;
      color: #374151;
      margin-bottom: 8px;
    }

    .rating-input {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .star-btn {
      background: none;
      border: none;
      padding: 4px;
      cursor: pointer;
      color: #d1d5db;
      transition: color 0.2s;
    }

    .star-btn.active,
    .star-btn:hover {
      color: #fbbf24;
    }

    .star-btn.small {
      padding: 2px;
    }

    .rating-text {
      font-size: 0.875rem;
      color: #6b7280;
      font-weight: 500;
    }

    .category-ratings {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .category-rating {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      background: #f9fafb;
      border-radius: 8px;
    }

    .category-name {
      font-size: 0.875rem;
      color: #374151;
      font-weight: 500;
    }

    .category-stars {
      display: flex;
      gap: 4px;
    }

    textarea {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 1rem;
      resize: vertical;
      min-height: 100px;
      font-family: inherit;
    }

    textarea:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    textarea.error {
      border-color: #ef4444;
    }

    .char-count {
      text-align: right;
      font-size: 0.75rem;
      color: #6b7280;
      margin-top: 4px;
    }

    .error-message {
      color: #ef4444;
      font-size: 0.875rem;
      margin-top: 4px;
    }

    .photo-upload {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .upload-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background: white;
      border: 2px dashed #d1d5db;
      border-radius: 8px;
      color: #6b7280;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 0.875rem;
    }

    .upload-btn:hover {
      border-color: #3b82f6;
      color: #3b82f6;
    }

    .photo-previews {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
      gap: 12px;
    }

    .photo-preview {
      position: relative;
      aspect-ratio: 1;
      border-radius: 8px;
      overflow: hidden;
    }

    .photo-preview img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .remove-photo {
      position: absolute;
      top: 4px;
      right: 4px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      border: none;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background 0.2s;
    }

    .remove-photo:hover {
      background: rgba(0, 0, 0, 0.9);
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      font-size: 0.875rem;
    }

    .checkbox-label input[type="checkbox"] {
      margin: 0;
    }

    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      padding-top: 24px;
      border-top: 1px solid #e5e7eb;
    }

    .btn-secondary {
      padding: 12px 24px;
      background: white;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      color: #374151;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-secondary:hover {
      background: #f9fafb;
    }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .btn-primary:hover:not(:disabled) {
      background: #2563eb;
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 640px) {
      .review-form-overlay {
        padding: 10px;
      }

      .category-rating {
        flex-direction: column;
        gap: 8px;
        align-items: flex-start;
      }

      .form-actions {
        flex-direction: column;
      }
    }
  `]
})
export class AvisFormComponent implements OnInit {
  @Input() lieuId!: number;
  @Output() close = new EventEmitter<void>();
  @Output() reviewSubmitted = new EventEmitter<Review>();

  reviewForm!: FormGroup;
  submitted = false;
  isSubmitting = false;
  selectedRating = 0;
  hoverRating = 0;
  selectedPhotos: { file: File; url: string; name: string }[] = [];

  categories = [
    { key: 'cleanliness', name: 'Propreté', rating: 0 },
    { key: 'accuracy', name: 'Précision', rating: 0 },
    { key: 'communication', name: 'Communication', rating: 0 },
    { key: 'location', name: 'Emplacement', rating: 0 },
    { key: 'checkin', name: 'Arrivée', rating: 0 },
    { key: 'value', name: 'Qualité-prix', rating: 0 }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.reviewForm = this.fb.group({
      comment: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      anonymous: [false]
    });
  }

  get commentLength(): number {
    return this.reviewForm.get('comment')?.value?.length || 0;
  }

  setRating(rating: number) {
    this.selectedRating = rating;
  }

  setCategoryRating(categoryKey: string, rating: number) {
    const category = this.categories.find(c => c.key === categoryKey);
    if (category) {
      category.rating = rating;
    }
  }

  getRatingText(): string {
    const texts = ['', 'Très mauvais', 'Mauvais', 'Correct', 'Bon', 'Excellent'];
    return texts[this.hoverRating || this.selectedRating] || '';
  }

  onPhotosSelected(event: any) {
    const files = Array.from(event.target.files) as File[];
    
    files.forEach(file => {
      if (file.type.startsWith('image/') && this.selectedPhotos.length < 5) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.selectedPhotos.push({
            file,
            url: e.target?.result as string,
            name: file.name
          });
        };
        reader.readAsDataURL(file);
      }
    });
  }

  removePhoto(index: number) {
    this.selectedPhotos.splice(index, 1);
  }

  onBackdrop(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('review-form-overlay')) {
      this.close.emit();
    }
  }

  onSubmit() {
    this.submitted = true;

    if (this.reviewForm.invalid || this.selectedRating === 0) {
      return;
    }

    this.isSubmitting = true;

    // Simulate API call
    setTimeout(() => {
      const review: Review = {
        user: this.reviewForm.value.anonymous ? 'Utilisateur anonyme' : 'Utilisateur',
        avatar: this.reviewForm.value.anonymous ? 'https://i.pravatar.cc/150?u=anonymous' : 'https://i.pravatar.cc/150?u=user',
        rating: this.selectedRating,
        comment: this.reviewForm.value.comment,
        date: new Date()
      };

      this.reviewSubmitted.emit(review);
      this.isSubmitting = false;
      this.close.emit();
    }, 1500);
  }
}