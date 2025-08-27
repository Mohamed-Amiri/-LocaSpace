import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables, ChartConfiguration, ChartType } from 'chart.js';

Chart.register(...registerables);

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    tension?: number;
    fill?: boolean;
  }[];
}

@Component({
  selector: 'app-modern-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modern-chart" [class]="'chart-' + type">
      <div class="chart-header" *ngIf="title">
        <h3 class="chart-title">{{ title }}</h3>
        <div class="chart-actions" *ngIf="showActions">
          <button class="chart-action-btn" (click)="exportChart()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7,10 12,15 17,10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          </button>
          <button class="chart-action-btn" (click)="refreshChart()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23,4 23,10 17,10"/>
              <polyline points="1,20 1,14 7,14"/>
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
            </svg>
          </button>
        </div>
      </div>
      <div class="chart-container" [style.height]="height">
        <canvas #chartCanvas></canvas>
      </div>
      <div class="chart-footer" *ngIf="showLegend && type === 'doughnut'">
        <div class="legend-items">
          <div 
            class="legend-item" 
            *ngFor="let item of legendItems; let i = index"
            [style.--legend-color]="item.color">
            <span class="legend-dot"></span>
            <span class="legend-label">{{ item.label }}</span>
            <span class="legend-value">{{ item.value }}%</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modern-chart {
      background: white;
      border-radius: 24px;
      padding: 1.5rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      border: 1px solid rgba(0, 0, 0, 0.05);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
      }
    }

    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;

      .chart-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: #111827;
        margin: 0;
        font-family: 'Poppins', sans-serif;
      }

      .chart-actions {
        display: flex;
        gap: 0.5rem;

        .chart-action-btn {
          background: rgba(37, 99, 235, 0.1);
          border: none;
          border-radius: 8px;
          padding: 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #2563EB;
          display: flex;
          align-items: center;
          justify-content: center;

          &:hover {
            background: rgba(37, 99, 235, 0.2);
            transform: scale(1.05);
          }
        }
      }
    }

    .chart-container {
      position: relative;
      width: 100%;
      
      canvas {
        max-width: 100%;
        height: auto !important;
      }
    }

    .chart-footer {
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(0, 0, 0, 0.05);

      .legend-items {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem;
          border-radius: 8px;
          transition: background 0.2s ease;

          &:hover {
            background: rgba(0, 0, 0, 0.02);
          }

          .legend-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: var(--legend-color);
            flex-shrink: 0;
          }

          .legend-label {
            flex: 1;
            font-size: 0.9rem;
            color: #6B7280;
            font-weight: 500;
          }

          .legend-value {
            font-size: 0.9rem;
            font-weight: 600;
            color: #111827;
          }
        }
      }
    }

    // Chart type specific styles
    .chart-line {
      .chart-container {
        background: linear-gradient(180deg, rgba(37, 99, 235, 0.02) 0%, transparent 100%);
        border-radius: 12px;
        padding: 1rem;
      }
    }

    .chart-doughnut {
      .chart-container {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .chart-bar {
      .chart-container {
        background: linear-gradient(180deg, rgba(245, 158, 11, 0.02) 0%, transparent 100%);
        border-radius: 12px;
        padding: 1rem;
      }
    }

    // Dark mode support
    :host-context(.dark) .modern-chart {
      background: #1E1E1E;
      border-color: rgba(255, 255, 255, 0.1);

      .chart-title {
        color: white;
      }

      .chart-footer {
        border-top-color: rgba(255, 255, 255, 0.1);

        .legend-label {
          color: rgba(255, 255, 255, 0.7);
        }

        .legend-value {
          color: white;
        }
      }
    }

    // Responsive design
    @media (max-width: 768px) {
      .modern-chart {
        padding: 1rem;
      }

      .chart-header {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;

        .chart-actions {
          align-self: flex-end;
        }
      }

      .chart-footer .legend-items {
        grid-template-columns: 1fr;
        gap: 0.5rem;
      }
    }
  `]
})
export class ModernChartComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  
  @Input() type: ChartType = 'line';
  @Input() data!: ChartData;
  @Input() title?: string;
  @Input() height = '300px';
  @Input() showActions = true;
  @Input() showLegend = true;
  @Input() options?: Partial<ChartConfiguration['options']>;

  private chart?: Chart;
  legendItems: { label: string; value: number; color: string }[] = [];

  ngOnInit() {
    if (this.type === 'doughnut' && this.showLegend) {
      this.generateLegendItems();
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initChart();
    }, 100);
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private initChart() {
    if (!this.chartCanvas || !this.data) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const defaultOptions: ChartConfiguration['options'] = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: this.type !== 'doughnut',
          position: 'bottom',
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              family: 'Inter, sans-serif',
              size: 12
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: 'white',
          bodyColor: 'white',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: true,
          titleFont: {
            family: 'Inter, sans-serif',
            size: 13,
            weight: 600
          },
          bodyFont: {
            family: 'Inter, sans-serif',
            size: 12
          }
        }
      },
      scales: this.type !== 'doughnut' ? {
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: {
              family: 'Inter, sans-serif',
              size: 11
            },
            color: '#6B7280'
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          },
          ticks: {
            font: {
              family: 'Inter, sans-serif',
              size: 11
            },
            color: '#6B7280'
          }
        }
      } : undefined
    };

    const mergedOptions = this.mergeOptions(defaultOptions, this.options);

    this.chart = new Chart(ctx, {
      type: this.type,
      data: this.data,
      options: mergedOptions
    });
  }

  private mergeOptions(defaultOptions: any, customOptions?: any): any {
    if (!customOptions) return defaultOptions;
    
    return {
      ...defaultOptions,
      ...customOptions,
      plugins: {
        ...defaultOptions.plugins,
        ...customOptions.plugins
      },
      scales: customOptions.scales || defaultOptions.scales
    };
  }

  private generateLegendItems() {
    if (!this.data.datasets[0] || !this.data.labels) return;

    const dataset = this.data.datasets[0];
    const total = dataset.data.reduce((sum, value) => sum + value, 0);
    const colors = Array.isArray(dataset.backgroundColor) 
      ? dataset.backgroundColor 
      : [dataset.backgroundColor || '#2563EB'];

    this.legendItems = this.data.labels.map((label, index) => ({
      label: label,
      value: Math.round((dataset.data[index] / total) * 100),
      color: colors[index] || colors[0] || '#2563EB'
    }));
  }

  exportChart() {
    if (this.chart) {
      const url = this.chart.toBase64Image();
      const link = document.createElement('a');
      link.download = `chart-${Date.now()}.png`;
      link.href = url;
      link.click();
    }
  }

  refreshChart() {
    if (this.chart) {
      this.chart.update();
    }
  }

  updateData(newData: ChartData) {
    this.data = newData;
    if (this.chart) {
      this.chart.data = newData;
      this.chart.update();
    }
    if (this.type === 'doughnut' && this.showLegend) {
      this.generateLegendItems();
    }
  }
}