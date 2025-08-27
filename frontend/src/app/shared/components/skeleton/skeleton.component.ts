import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skeleton" [class]="'skeleton-' + type" [style.width]="width" [style.height]="height">
      <div class="skeleton-shimmer"></div>
    </div>
  `,
  styles: [`
    .skeleton {
      position: relative;
      overflow: hidden;
      background: #e5e7eb;
      border-radius: 0.375rem;
    }

    .skeleton-text {
      height: 1rem;
      width: 100%;
    }

    .skeleton-title {
      height: 1.5rem;
      width: 75%;
    }

    .skeleton-avatar {
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
    }

    .skeleton-rectangle {
      width: 100%;
      height: 8rem;
    }

    .skeleton-circle {
      border-radius: 50%;
    }

    .skeleton-shimmer {
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.6),
        transparent
      );
      animation: shimmer 1.5s infinite;
    }

    @keyframes shimmer {
      0% {
        left: -100%;
      }
      100% {
        left: 100%;
      }
    }

    :host-context(.dark-theme) .skeleton {
      background: #374151;
    }

    :host-context(.dark-theme) .skeleton-shimmer {
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.1),
        transparent
      );
    }
  `]
})
export class SkeletonComponent {
  @Input() type: 'text' | 'title' | 'avatar' | 'rectangle' | 'circle' = 'text';
  @Input() width?: string;
  @Input() height?: string;
}