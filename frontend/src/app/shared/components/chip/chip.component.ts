import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="chip"
      [class.chip-sm]="size === 'sm'"
      [class.chip-lg]="size === 'lg'"
      [class.chip-outline]="outline"
      [class.chip-clickable]="clickable"
      [ngClass]="{
        'chip-primary': variant === 'primary',
        'chip-success': variant === 'success',
        'chip-warning': variant === 'warning',
        'chip-error': variant === 'error',
        'chip-info': variant === 'info'
      }"
      (click)="handleClick()"
      [attr.role]="clickable ? 'button' : undefined"
      [attr.tabindex]="clickable ? 0 : undefined"
    >
      <i *ngIf="icon" [class]="icon" class="chip-icon"></i>
      
      <span class="chip-label">
        <ng-content></ng-content>
      </span>

      <button
        *ngIf="removable"
        type="button"
        class="chip-remove"
        (click)="handleRemove($event)"
        [attr.aria-label]="'Supprimer ' + label"
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
  `,
  styleUrls: ['./chip.component.scss']
})
export class ChipComponent {
  @Input() variant: 'primary' | 'success' | 'warning' | 'error' | 'info' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() outline = false;
  @Input() removable = false;
  @Input() clickable = false;
  @Input() icon?: string;
  @Input() label = '';

  @Output() remove = new EventEmitter<void>();
  @Output() click = new EventEmitter<void>();

  handleRemove(event: MouseEvent) {
    event.stopPropagation();
    this.remove.emit();
  }

  handleClick() {
    if (this.clickable) {
      this.click.emit();
    }
  }
}