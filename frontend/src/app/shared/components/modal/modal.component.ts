import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { fadeInAnimation, fadeInUpAnimation } from '../../animations/fade.animation';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  animations: [fadeInAnimation, fadeInUpAnimation],
  template: `
    <div 
      *ngIf="isOpen"
      class="modal-overlay"
              [@fadeIn]
      (click)="onOverlayClick($event)">
      <div 
        class="modal-container"
        [class.modal-sm]="size === 'sm'"
        [class.modal-lg]="size === 'lg'"
        [@fadeInUp]
        (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3 class="modal-title">{{ title }}</h3>
          <button class="modal-close" (click)="close()">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <ng-content></ng-content>
        </div>
        <div *ngIf="showFooter" class="modal-footer">
          <app-button 
            variant="ghost" 
            (buttonClick)="close()">{{ cancelText }}</app-button>
          <app-button 
            variant="primary" 
            [loading]="loading"
            (buttonClick)="confirm()">{{ confirmText }}</app-button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 1rem;
    }

    .modal-container {
      background: white;
      border-radius: 1rem;
      box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
      width: 100%;
      max-width: 32rem;
      max-height: calc(100vh - 2rem);
      display: flex;
      flex-direction: column;
      
      &.modal-sm {
        max-width: 24rem;
      }
      
      &.modal-lg {
        max-width: 48rem;
      }
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .modal-title {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: #111827;
    }

    .modal-close {
      background: transparent;
      border: none;
      padding: 0.5rem;
      cursor: pointer;
      color: #6b7280;
      border-radius: 0.375rem;
      transition: all 0.2s;
      
      &:hover {
        background: #f3f4f6;
        color: #111827;
      }
      
      &:focus-visible {
        outline: 2px solid #2563eb;
        outline-offset: 2px;
      }
    }

    .modal-body {
      padding: 1.5rem;
      overflow-y: auto;
    }

    .modal-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.75rem;
      padding: 1.25rem 1.5rem;
      border-top: 1px solid #e5e7eb;
    }

    :host-context(.dark-theme) {
      .modal-container {
        background: #1f2937;
      }

      .modal-header {
        border-bottom-color: #374151;
      }

      .modal-title {
        color: #f3f4f6;
      }

      .modal-close {
        color: #9ca3af;
        
        &:hover {
          background: #374151;
          color: #f3f4f6;
        }
      }

      .modal-footer {
        border-top-color: #374151;
      }
    }
  `]
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() showFooter = true;
  @Input() cancelText = 'Cancel';
  @Input() confirmText = 'Confirm';
  @Input() loading = false;

  @Output() closeModal = new EventEmitter<void>();
  @Output() confirmModal = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  onEscapePress() {
    if (this.isOpen) {
      this.close();
    }
  }

  onOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  close() {
    this.closeModal.emit();
  }

  confirm() {
    this.confirmModal.emit();
  }
}