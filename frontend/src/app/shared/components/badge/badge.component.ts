import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="badge"
      [class.badge-dot]="dot"
      [class.badge-pill]="pill"
      [class.badge-outline]="outline"
      [ngClass]="{
        'badge-primary': variant === 'primary',
        'badge-success': variant === 'success',
        'badge-warning': variant === 'warning',
        'badge-error': variant === 'error',
        'badge-info': variant === 'info',
        'badge-sm': size === 'sm',
        'badge-lg': size === 'lg'
      }"
    >
      <ng-container *ngIf="!dot">
        <i *ngIf="icon" [class]="icon" class="badge-icon"></i>
        <ng-content></ng-content>
      </ng-container>
    </div>
  `,
  styleUrls: ['./badge.component.scss']
})
export class BadgeComponent {
  @Input() variant: 'primary' | 'success' | 'warning' | 'error' | 'info' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() dot = false;
  @Input() pill = false;
  @Input() outline = false;
  @Input() icon?: string;
}