import { Component, Input, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

export interface MenuItem {
  label: string;
  icon?: string;
  description?: string;
  disabled?: boolean;
  divider?: boolean;
  danger?: boolean;
  onClick?: () => void;
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="menu"
      [class.menu-sm]="size === 'sm'"
      [class.menu-lg]="size === 'lg'"
      [@menuAnimation]
      role="menu"
      [style.min-width.px]="minWidth"
      [style.max-width.px]="maxWidth"
      [style.max-height.px]="maxHeight"
    >
      <ng-container *ngFor="let item of items; let i = index">
        <div
          *ngIf="item.divider"
          class="menu-divider"
          role="separator"
        ></div>

        <button
          *ngIf="!item.divider"
          type="button"
          class="menu-item"
          [class.menu-item-danger]="item.danger"
          [class.disabled]="item.disabled"
          [attr.disabled]="item.disabled ? '' : null"
          role="menuitem"
          (click)="onItemClick(item, i)"
        >
          <svg
            *ngIf="item.icon"
            class="menu-item-icon"
            [innerHTML]="item.icon"
          ></svg>

          <div class="menu-item-content">
            <div class="menu-item-label">{{ item.label }}</div>
            <div
              *ngIf="item.description"
              class="menu-item-description"
            >{{ item.description }}</div>
          </div>
        </button>
      </ng-container>

      <div
        *ngIf="!items?.length"
        class="menu-empty"
      >{{ emptyMessage }}</div>
    </div>
  `,
  styleUrls: ['./menu.component.scss'],
  animations: [
    trigger('menuAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('150ms cubic-bezier(0.16, 1, 0.3, 1)',
          style({ opacity: 1, transform: 'scale(1)' })
        )
      ]),
      transition(':leave', [
        animate('100ms cubic-bezier(0.4, 0, 1, 1)',
          style({ opacity: 0, transform: 'scale(0.95)' })
        )
      ])
    ])
  ]
})
export class MenuComponent {
  @Input() items: MenuItem[] = [];
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() minWidth = 180;
  @Input() maxWidth = 320;
  @Input() maxHeight = 300;
  @Input() emptyMessage = 'No items available';

  @Output() itemClick = new EventEmitter<{ item: MenuItem; index: number }>();

  constructor(private elementRef: ElementRef) {}

  onItemClick(item: MenuItem, index: number) {
    if (item.disabled) return;

    if (item.onClick) {
      item.onClick();
    }

    this.itemClick.emit({ item, index });
  }

  // Close menu when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.itemClick.emit({ item: null as any, index: -1 });
    }
  }

  // Close menu on escape key
  @HostListener('document:keydown.escape')
  onEscapePress() {
    this.itemClick.emit({ item: null as any, index: -1 });
  }
}