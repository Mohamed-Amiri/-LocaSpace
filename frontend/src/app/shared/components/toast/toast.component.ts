import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { fadeInAnimation, slideInOutAnimation } from '../../animations/fade.animation';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  animations: [fadeInAnimation, slideInOutAnimation],
  template: `
          <div class="toast-container" [@fadeIn]>
      <div 
        *ngFor="let toast of toasts"
        class="toast"
        [class.toast-success]="toast.type === 'success'"
        [class.toast-error]="toast.type === 'error'"
        [class.toast-info]="toast.type === 'info'"
        [class.toast-warning]="toast.type === 'warning'"
        [@slideInOut]>
        <div class="toast-icon">
          <svg *ngIf="toast.type === 'success'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          <svg *ngIf="toast.type === 'error'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
          </svg>
          <svg *ngIf="toast.type === 'info'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
          </svg>
          <svg *ngIf="toast.type === 'warning'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
        </div>
        <div class="toast-message">{{ toast.message }}</div>
        <button class="toast-close" (click)="removeToast(toast.id)">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <div class="toast-progress" [style.animation-duration]="(toast.duration || 5000) + 'ms'"></div>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 1rem;
      right: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      z-index: 9999;
      pointer-events: none;
    }

    .toast {
      position: relative;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      background: white;
      border-radius: 0.5rem;
      box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
      min-width: 300px;
      max-width: 400px;
      pointer-events: auto;
      overflow: hidden;

      &.toast-success {
        border-left: 4px solid #22c55e;
        .toast-icon { color: #22c55e; }
        .toast-progress { background: #22c55e; }
      }

      &.toast-error {
        border-left: 4px solid #ef4444;
        .toast-icon { color: #ef4444; }
        .toast-progress { background: #ef4444; }
      }

      &.toast-info {
        border-left: 4px solid #3b82f6;
        .toast-icon { color: #3b82f6; }
        .toast-progress { background: #3b82f6; }
      }

      &.toast-warning {
        border-left: 4px solid #f59e0b;
        .toast-icon { color: #f59e0b; }
        .toast-progress { background: #f59e0b; }
      }
    }

    .toast-message {
      flex: 1;
      font-size: 0.875rem;
      color: #1f2937;
    }

    .toast-close {
      background: transparent;
      border: none;
      padding: 0.25rem;
      cursor: pointer;
      color: #6b7280;
      border-radius: 0.375rem;
      transition: all 0.2s;
      
      &:hover {
        background: #f3f4f6;
        color: #111827;
      }
    }

    .toast-progress {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 3px;
      transform-origin: left;
      animation: progress linear forwards;
    }

    @keyframes progress {
      from { transform: scaleX(1); }
      to { transform: scaleX(0); }
    }

    :host-context(.dark-theme) {
      .toast {
        background: #1f2937;
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.2);
      }

      .toast-message {
        color: #f3f4f6;
      }

      .toast-close {
        color: #9ca3af;
        
        &:hover {
          background: #374151;
          color: #f3f4f6;
        }
      }
    }

    @media (max-width: 640px) {
      .toast-container {
        left: 1rem;
        right: 1rem;
        bottom: 1rem;
        align-items: stretch;
      }

      .toast {
        min-width: 0;
        max-width: none;
      }
    }
  `]
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  private timeouts: Map<number, number> = new Map();

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.timeouts.forEach(timeout => window.clearTimeout(timeout));
  }

  show(toast: Omit<Toast, 'id'>) {
    const id = Date.now();
    const newToast: Toast = { ...toast, id };
    
    // Use setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.toasts = [newToast, ...this.toasts];
      this.cdr.detectChanges();
    });

    const timeout = window.setTimeout(() => {
      this.removeToast(id);
    }, toast.duration || 5000);

    this.timeouts.set(id, timeout);
  }

  removeToast(id: number) {
    setTimeout(() => {
      this.toasts = this.toasts.filter(t => t.id !== id);
      this.cdr.detectChanges();
    });
    
    const timeout = this.timeouts.get(id);
    if (timeout) {
      window.clearTimeout(timeout);
      this.timeouts.delete(id);
    }
  }
}