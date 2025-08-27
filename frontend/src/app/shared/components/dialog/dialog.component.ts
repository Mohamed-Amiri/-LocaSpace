import { Component, Input, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="dialog-backdrop"
      [@backdropAnimation]
      (click)="onBackdropClick()"
    ></div>

    <div
      class="dialog"
      [@dialogAnimation]
      [class.dialog-sm]="size === 'sm'"
      [class.dialog-lg]="size === 'lg'"
      [class.dialog-xl]="size === 'xl'"
      [class.dialog-fullscreen]="fullscreen"
      role="dialog"
      aria-modal="true"
      [attr.aria-labelledby]="titleId"
    >
      <div class="dialog-header" *ngIf="showHeader">
        <h2 [id]="titleId" class="dialog-title">
          <ng-content select="[dialogTitle]"></ng-content>
        </h2>

        <button
          *ngIf="showCloseButton"
          type="button"
          class="dialog-close"
          aria-label="Close dialog"
          (click)="close()"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="dialog-content">
        <ng-content></ng-content>
      </div>

      <div class="dialog-footer" *ngIf="showFooter">
        <ng-content select="[dialogFooter]"></ng-content>
      </div>
    </div>
  `,
  styleUrls: ['./dialog.component.scss'],
  animations: [
    trigger('backdropAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('dialogAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'scale(0.95)' }))
      ])
    ])
  ]
})
export class DialogComponent {
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() fullscreen = false;
  @Input() showHeader = true;
  @Input() showFooter = true;
  @Input() showCloseButton = true;
  @Input() closeOnBackdropClick = true;
  @Input() closeOnEscape = true;

  @Output() closed = new EventEmitter<void>();

  titleId = `dialog-${Math.random().toString(36).substr(2, 9)}`;

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:keydown.escape')
  onEscapePress() {
    if (this.closeOnEscape) {
      this.close();
    }
  }

  onBackdropClick() {
    if (this.closeOnBackdropClick) {
      this.close();
    }
  }

  close() {
    this.closed.emit();
  }

  // Prevent clicks within dialog from closing it
  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    event.stopPropagation();
  }
}