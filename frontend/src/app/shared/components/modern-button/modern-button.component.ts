import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-modern-button',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <button 
      *ngIf="!routerLink"
      [type]="type"
      [disabled]="disabled || loading"
      [class]="buttonClasses"
      (click)="handleClick($event)">
      
      <div class="button-content">
        <svg *ngIf="loading" class="loading-spinner" width="20" height="20" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" opacity="0.3"/>
          <path d="M12 2 A10 10 0 0 1 22 12" stroke="currentColor" stroke-width="2" fill="none">
            <animateTransform attributeName="transform" type="rotate" dur="1s" repeatCount="indefinite" values="0 12 12;360 12 12"/>
          </path>
        </svg>
        
        <ng-container *ngIf="!loading">
          <ng-content select="[slot=icon-left]"></ng-content>
          <span class="button-text">
            <ng-content></ng-content>
          </span>
          <ng-content select="[slot=icon-right]"></ng-content>
        </ng-container>
      </div>
      
      <div class="button-ripple" #ripple></div>
    </button>
    
    <a 
      *ngIf="routerLink"
      [routerLink]="routerLink"
      [queryParams]="queryParams"
      [class]="buttonClasses">
      
      <div class="button-content">
        <ng-content select="[slot=icon-left]"></ng-content>
        <span class="button-text">
          <ng-content></ng-content>
        </span>
        <ng-content select="[slot=icon-right]"></ng-content>
      </div>
    </a>
  `,
  styles: [`
    .modern-button {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 16px;
      font-family: 'Inter', sans-serif;
      font-weight: 600;
      font-size: 1rem;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
      user-select: none;
      
      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        pointer-events: none;
      }
      
      .button-content {
        position: relative;
        z-index: 2;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      
      .button-ripple {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1;
        pointer-events: none;
      }
      
      .loading-spinner {
        animation: spin 1s linear infinite;
      }
      
      // Primary variant - Enhanced
      &--primary {
        background: linear-gradient(135deg, #2563EB 0%, #7C3AED 50%, #EC4899 100%);
        color: white;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        position: relative;
        
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
          z-index: 1;
        }
        
        &:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(37, 99, 235, 0.4);
          filter: brightness(1.1);
          
          &::before {
            left: 100%;
          }
        }
        
        &:active {
          transform: translateY(-1px);
          transition: transform 0.1s ease;
        }
      }
      
      // Secondary variant - Enhanced
      &--secondary {
        background: linear-gradient(135deg, #F59E0B 0%, #F97316 100%);
        color: white;
        box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        position: relative;
        
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
          z-index: 1;
        }
        
        &:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
          filter: brightness(1.1);
          
          &::before {
            left: 100%;
          }
        }
        
        &:active {
          transform: translateY(-1px);
          transition: transform 0.1s ease;
        }
      }
      
      // Ghost variant - Enhanced
      &--ghost {
        background: transparent;
        color: #2563EB;
        border: 2px solid rgba(37, 99, 235, 0.6);
        backdrop-filter: blur(10px);
        position: relative;
        
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(124, 58, 237, 0.1));
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 1;
        }
        
        &:hover:not(:disabled) {
          background: linear-gradient(135deg, #2563EB 0%, #7C3AED 100%);
          color: white;
          border-color: transparent;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(37, 99, 235, 0.3);
          
          &::before {
            opacity: 1;
          }
        }
        
        &:active {
          transform: translateY(-1px);
        }
      }
      
      // Glass variant - Enhanced
      &--glass {
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        position: relative;
        
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 1;
        }
        
        &:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.25);
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
          
          &::before {
            opacity: 1;
          }
        }
        
        &:active {
          transform: translateY(-1px);
        }
      }
      
      // Success variant
      &--success {
        background: linear-gradient(135deg, #10B981 0%, #059669 100%);
        color: white;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        position: relative;
        
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
          z-index: 1;
        }
        
        &:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
          filter: brightness(1.1);
          
          &::before {
            left: 100%;
          }
        }
        
        &:active {
          transform: translateY(-1px);
        }
      }
      
      // Warning variant
      &--warning {
        background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
        color: white;
        box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        position: relative;
        
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
          z-index: 1;
        }
        
        &:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
          filter: brightness(1.1);
          
          &::before {
            left: 100%;
          }
        }
        
        &:active {
          transform: translateY(-1px);
        }
      }
      
      // Danger variant
      &--danger {
        background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
        color: white;
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        position: relative;
        
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
          z-index: 1;
        }
        
        &:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
          filter: brightness(1.1);
          
          &::before {
            left: 100%;
          }
        }
        
        &:active {
          transform: translateY(-1px);
        }
      }
      
      // Size variants
      &--sm {
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
        border-radius: 12px;
      }
      
      &--lg {
        padding: 1rem 2rem;
        font-size: 1.125rem;
        border-radius: 20px;
      }
      
      &--xl {
        padding: 1.25rem 2.5rem;
        font-size: 1.25rem;
        border-radius: 24px;
      }
    }
    
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `]
})
export class ModernButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'ghost' | 'glass' | 'success' | 'warning' | 'danger' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() routerLink: string | null = null;
  @Input() queryParams: any = null;

  @Output() clicked = new EventEmitter<Event>();

  get buttonClasses(): string {
    return `modern-button modern-button--${this.variant} modern-button--${this.size}`;
  }

  handleClick(event: Event): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit(event);
    }
  }
}