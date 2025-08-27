import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { fadeInAnimation } from '../../animations/fade.animation';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  animations: [fadeInAnimation],
  template: `
    <button
      class="btn"
      [class.btn-primary]="variant === 'primary'"
      [class.btn-secondary]="variant === 'secondary'"
      [class.btn-ghost]="variant === 'ghost'"
      [class.btn-danger]="variant === 'danger'"
      [class.btn-sm]="size === 'sm'"
      [class.btn-lg]="size === 'lg'"
      [class.btn-loading]="loading"
      [disabled]="disabled || loading"
      (click)="onClick($event)"
              [@fadeIn]>
      <div class="btn-content" [class.invisible]="loading">
        <ng-content></ng-content>
      </div>
      <div *ngIf="loading" class="btn-loader">
        <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    </button>
  `,
  styles: [`
    .btn {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      font-weight: 500;
      transition: all 0.2s;
      cursor: pointer;
      border: none;
      outline: none;
      
      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }
      
      &:focus-visible {
        outline: 2px solid currentColor;
        outline-offset: 2px;
      }
      
      &:active:not(:disabled) {
        transform: scale(0.98);
      }
    }

    .btn-primary {
      background: linear-gradient(90deg, #2563EB 0%, #7C3AED 100%);
      color: white;
      
      &:hover:not(:disabled) {
        background: linear-gradient(90deg, #1D4ED8 0%, #6D28D9 100%);
      }
    }

    .btn-secondary {
      background: #f3f4f6;
      color: #1f2937;
      
      &:hover:not(:disabled) {
        background: #e5e7eb;
      }
    }

    .btn-ghost {
      background: transparent;
      color: #1f2937;
      border: 1px solid #e5e7eb;
      
      &:hover:not(:disabled) {
        background: #f3f4f6;
      }
    }

    .btn-danger {
      background: #ef4444;
      color: white;
      
      &:hover:not(:disabled) {
        background: #dc2626;
      }
    }

    .btn-sm {
      padding: 0.375rem 0.75rem;
      font-size: 0.875rem;
    }

    .btn-lg {
      padding: 0.75rem 1.5rem;
      font-size: 1.125rem;
    }

    .btn-loading {
      cursor: wait;
    }

    .btn-loader {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .invisible {
      visibility: hidden;
    }

    .animate-spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    :host-context(.dark-theme) {
      .btn-secondary {
        background: #374151;
        color: #f3f4f6;
        
        &:hover:not(:disabled) {
          background: #4b5563;
        }
      }

      .btn-ghost {
        color: #f3f4f6;
        border-color: #4b5563;
        
        &:hover:not(:disabled) {
          background: #374151;
        }
      }
    }
  `]
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() loading = false;
  @Input() disabled = false;
  @Output() buttonClick = new EventEmitter<MouseEvent>();

  onClick(event: MouseEvent) {
    if (!this.disabled && !this.loading) {
      this.buttonClick.emit(event);
    }
  }
}