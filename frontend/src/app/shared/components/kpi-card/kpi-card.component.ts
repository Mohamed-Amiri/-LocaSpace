import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface KpiData {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    label?: string;
  };
  icon?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  subtitle?: string;
}

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="kpi-card" [class]="'kpi-card--' + color" [attr.data-aos]="'fade-up'">
      <div class="kpi-icon" *ngIf="icon">
        <div class="icon-wrapper" [innerHTML]="icon"></div>
      </div>
      
      <div class="kpi-content">
        <div class="kpi-header">
          <h3 class="kpi-title">{{ data.title }}</h3>
          <div class="kpi-trend" *ngIf="data.trend" [class]="'trend--' + data.trend.direction">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline *ngIf="data.trend.direction === 'up'" points="23,6 13.5,15.5 8.5,10.5 1,18"/>
              <polyline *ngIf="data.trend.direction === 'up'" points="17,6 23,6 23,12"/>
              <polyline *ngIf="data.trend.direction === 'down'" points="23,18 13.5,8.5 8.5,13.5 1,6"/>
              <polyline *ngIf="data.trend.direction === 'down'" points="17,18 23,18 23,12"/>
              <line *ngIf="data.trend.direction === 'neutral'" x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            <span class="trend-value">
              {{ data.trend.direction === 'up' ? '+' : data.trend.direction === 'down' ? '-' : '' }}{{ data.trend.value }}%
            </span>
          </div>
        </div>
        
        <div class="kpi-value">{{ formatValue(data.value) }}</div>
        
        <div class="kpi-subtitle" *ngIf="data.subtitle">
          {{ data.subtitle }}
        </div>
        
        <div class="kpi-trend-label" *ngIf="data.trend?.label">
          {{ data.trend?.label }}
        </div>
      </div>
      
      <div class="kpi-background-pattern"></div>
    </div>
  `,
  styles: [`
    .kpi-card {
      background: white;
      border-radius: 24px;
      padding: 2rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      border: 1px solid rgba(0, 0, 0, 0.05);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      min-height: 160px;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
      }

      &--primary {
        border-left: 4px solid #2563EB;
        
        .kpi-icon .icon-wrapper {
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(37, 99, 235, 0.2));
          color: #2563EB;
        }
      }

      &--secondary {
        border-left: 4px solid #F59E0B;
        
        .kpi-icon .icon-wrapper {
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.2));
          color: #F59E0B;
        }
      }

      &--success {
        border-left: 4px solid #10B981;
        
        .kpi-icon .icon-wrapper {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.2));
          color: #10B981;
        }
      }

      &--warning {
        border-left: 4px solid #F59E0B;
        
        .kpi-icon .icon-wrapper {
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.2));
          color: #F59E0B;
        }
      }

      &--danger {
        border-left: 4px solid #EF4444;
        
        .kpi-icon .icon-wrapper {
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.2));
          color: #EF4444;
        }
      }
    }

    .kpi-icon {
      align-self: flex-start;

      .icon-wrapper {
        width: 56px;
        height: 56px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;

        :deep(svg) {
          width: 24px;
          height: 24px;
          stroke-width: 2;
        }
      }
    }

    .kpi-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .kpi-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
    }

    .kpi-title {
      font-size: 0.9rem;
      font-weight: 500;
      color: #6B7280;
      margin: 0;
      line-height: 1.4;
      font-family: 'Inter', sans-serif;
    }

    .kpi-trend {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      flex-shrink: 0;

      &.trend--up {
        background: rgba(16, 185, 129, 0.1);
        color: #059669;

        svg {
          color: #059669;
        }
      }

      &.trend--down {
        background: rgba(239, 68, 68, 0.1);
        color: #DC2626;

        svg {
          color: #DC2626;
        }
      }

      &.trend--neutral {
        background: rgba(107, 114, 128, 0.1);
        color: #6B7280;

        svg {
          color: #6B7280;
        }
      }

      svg {
        width: 14px;
        height: 14px;
        flex-shrink: 0;
      }
    }

    .kpi-value {
      font-size: 2.25rem;
      font-weight: 700;
      color: #111827;
      line-height: 1.1;
      font-family: 'Poppins', sans-serif;
      margin: 0.5rem 0;
    }

    .kpi-subtitle {
      font-size: 0.8rem;
      color: #9CA3AF;
      font-weight: 500;
      margin-top: auto;
    }

    .kpi-trend-label {
      font-size: 0.75rem;
      color: #6B7280;
      font-weight: 500;
      margin-top: 0.25rem;
    }

    .kpi-background-pattern {
      position: absolute;
      top: 0;
      right: 0;
      width: 100px;
      height: 100px;
      background: radial-gradient(circle at center, rgba(37, 99, 235, 0.05) 0%, transparent 70%);
      border-radius: 50%;
      transform: translate(30px, -30px);
      pointer-events: none;
    }

    // Hover effects
    .kpi-card:hover {
      .kpi-icon .icon-wrapper {
        transform: scale(1.05);
      }

      .kpi-background-pattern {
        transform: translate(30px, -30px) scale(1.2);
      }
    }

    // Dark mode support
    :host-context(.dark) .kpi-card {
      background: #1E1E1E;
      border-color: rgba(255, 255, 255, 0.1);

      .kpi-title {
        color: rgba(255, 255, 255, 0.7);
      }

      .kpi-value {
        color: white;
      }

      .kpi-subtitle {
        color: rgba(255, 255, 255, 0.5);
      }

      .kpi-trend-label {
        color: rgba(255, 255, 255, 0.6);
      }
    }

    // Responsive design
    @media (max-width: 768px) {
      .kpi-card {
        padding: 1.5rem;
        min-height: 140px;
      }

      .kpi-icon .icon-wrapper {
        width: 48px;
        height: 48px;

        :deep(svg) {
          width: 20px;
          height: 20px;
        }
      }

      .kpi-value {
        font-size: 1.875rem;
      }

      .kpi-header {
        flex-direction: column;
        gap: 0.5rem;
        align-items: flex-start;
      }
    }

    // Animation
    @keyframes countUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .kpi-value {
      animation: countUp 0.6s ease-out;
    }
  `]
})
export class KpiCardComponent {
  @Input() data!: KpiData;
  @Input() color: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' = 'primary';
  @Input() icon?: string;

  formatValue(value: string | number): string {
    if (typeof value === 'number') {
      // Format large numbers
      if (value >= 1000000) {
        return (value / 1000000).toFixed(1) + 'M';
      } else if (value >= 1000) {
        return (value / 1000).toFixed(1) + 'K';
      }
      return value.toLocaleString();
    }
    return value;
  }
}