import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="isVisible"
      [@alertAnimation]
      class="alert"
      [class.alert-sm]="size === 'sm'"
      [class.alert-lg]="size === 'lg'"
      [class.alert-outline]="outline"
      [ngClass]="{
        'alert-info': variant === 'info',
        'alert-success': variant === 'success',
        'alert-warning': variant === 'warning',
        'alert-error': variant === 'error'
      }"
      role="alert"
    >
      <div class="alert-icon" *ngIf="showIcon">
        <!-- Info Icon -->
        <svg *ngIf="variant === 'info'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
        <!-- Success Icon -->
        <svg *ngIf="variant === 'success'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <!-- Warning Icon -->
        <svg *ngIf="variant === 'warning'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
        <!-- Error Icon -->
        <svg *ngIf="variant === 'error'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
      </div>

      <div class="alert-content">
        <div class="alert-title" *ngIf="title">{{ title }}</div>
        <div class="alert-message">
          <ng-content></ng-content>
        </div>
      </div>

      <button
        *ngIf="dismissible"
        type="button"
        class="alert-close"
        (click)="dismiss()"
        aria-label="Fermer l'alerte"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  `,
  animations: [
    trigger('alertAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-8px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'translateY(-8px)' }))
      ])
    ])
  ],
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent {
  @Input() variant: 'info' | 'success' | 'warning' | 'error' = 'info';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() title?: string;
  @Input() outline = false;
  @Input() dismissible = false;
  @Input() showIcon = true;
  @Input() isVisible = true;

  @Output() dismissed = new EventEmitter<void>();

  dismiss() {
    this.isVisible = false;
    this.dismissed.emit();
  }
}