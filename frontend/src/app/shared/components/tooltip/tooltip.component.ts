import { Component, Input, ElementRef, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="tooltip-trigger"
      [class.tooltip-disabled]="disabled"
      (mouseenter)="show()"
      (mouseleave)="hide()"
      (focus)="show()"
      (blur)="hide()"
    >
      <ng-content></ng-content>
    </div>

    <div 
      *ngIf="isVisible"
      [@tooltipAnimation]
      class="tooltip"
      [class.tooltip-dark]="dark"
      [class.tooltip-error]="error"
      [style.--tooltip-max-width]="maxWidth + 'px'"
      [attr.role]="'tooltip'"
      [style.top.px]="positionCoords.top"
      [style.left.px]="positionCoords.left"
    >
      {{ content }}
      <div class="tooltip-arrow" [style.left.px]="arrowPosition"></div>
    </div>
  `,
  animations: [
    trigger('tooltipAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('150ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('100ms ease-in', style({ opacity: 0, transform: 'scale(0.8)' }))
      ])
    ])
  ],
  styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent implements OnDestroy {
  @Input() content: string = '';
  @Input() position: 'top' | 'bottom' | 'left' | 'right' = 'top';
  @Input() dark: boolean = false;
  @Input() error: boolean = false;
  @Input() disabled: boolean = false;
  @Input() maxWidth: number = 200;
  @Input() showDelay: number = 200;
  @Input() hideDelay: number = 0;

  isVisible = false;
  private showTimeout?: number;
  private hideTimeout?: number;
  public positionCoords = { top: 0, left: 0 };
  public arrowPosition = 0;

  constructor(private elementRef: ElementRef) {}

  ngOnDestroy() {
    this.clearTimeouts();
  }

  show() {
    if (this.disabled || !this.content) return;
    
    this.clearTimeouts();
    this.showTimeout = window.setTimeout(() => {
      this.isVisible = true;
      this.updatePosition();
    }, this.showDelay);
  }

  hide() {
    this.clearTimeouts();
    this.hideTimeout = window.setTimeout(() => {
      this.isVisible = false;
    }, this.hideDelay);
  }

  private clearTimeouts() {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = undefined;
    }
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = undefined;
    }
  }

  private updatePosition() {
    const triggerEl = this.elementRef.nativeElement.querySelector('.tooltip-trigger');
    const tooltipEl = this.elementRef.nativeElement.querySelector('.tooltip');
    
    if (!triggerEl || !tooltipEl) return;

    const triggerRect = triggerEl.getBoundingClientRect();
    const tooltipRect = tooltipEl.getBoundingClientRect();
    const spacing = 8; // Space between trigger and tooltip

    let top = 0;
    let left = 0;

    switch (this.position) {
      case 'top':
        top = triggerRect.top - tooltipRect.height - spacing;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        this.arrowPosition = tooltipRect.width / 2;
        break;
      case 'bottom':
        top = triggerRect.bottom + spacing;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        this.arrowPosition = tooltipRect.width / 2;
        break;
      case 'left':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.left - tooltipRect.width - spacing;
        break;
      case 'right':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.right + spacing;
        break;
    }

    // Ensure tooltip stays within viewport
    const viewport = {
      top: window.scrollY,
      left: window.scrollX,
      right: window.scrollX + window.innerWidth,
      bottom: window.scrollY + window.innerHeight
    };

    if (left < viewport.left) left = viewport.left + spacing;
    if (left + tooltipRect.width > viewport.right) {
      left = viewport.right - tooltipRect.width - spacing;
    }
    if (top < viewport.top) top = viewport.top + spacing;
    if (top + tooltipRect.height > viewport.bottom) {
      top = viewport.bottom - tooltipRect.height - spacing;
    }

    this.positionCoords = { top, left };
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  onWindowChange() {
    if (this.isVisible) {
      this.updatePosition();
    }
  }
}