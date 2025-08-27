import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="progress-container"
      [class.progress-sm]="size === 'sm'"
      [class.progress-lg]="size === 'lg'"
      [class.progress-striped]="striped"
      [class.progress-animated]="animated"
      role="progressbar"
      [attr.aria-valuenow]="value"
      [attr.aria-valuemin]="0"
      [attr.aria-valuemax]="100"
    >
      <div 
        class="progress-label"
        *ngIf="showLabel"
      >
        <span class="progress-text">{{ label }}</span>
        <span class="progress-value">{{ value }}%</span>
      </div>

      <div class="progress-track">
        <div
          class="progress-bar"
          [ngClass]="{
            'progress-primary': variant === 'primary',
            'progress-success': variant === 'success',
            'progress-warning': variant === 'warning',
            'progress-error': variant === 'error',
            'progress-info': variant === 'info'
          }"
          [style.width.%]="value"
        >
          <span class="progress-bar-label" *ngIf="showValueInBar">
            {{ value }}%
          </span>
        </div>

        <div 
          *ngIf="buffer !== undefined"
          class="progress-buffer"
          [style.width.%]="buffer"
        ></div>
      </div>
    </div>
  `,
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent {
  @Input() value = 0;
  @Input() buffer?: number;
  @Input() variant: 'primary' | 'success' | 'warning' | 'error' | 'info' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() striped = false;
  @Input() animated = false;
  @Input() showLabel = false;
  @Input() showValueInBar = false;
  @Input() label = 'Progress';
}