import { Component, Input, Output, EventEmitter, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-tab',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="tab-content"
      *ngIf="active"
      [@tabAnimation]
    >
      <ng-content></ng-content>
    </div>
  `,
  animations: [
    trigger('tabAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(10px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateX(-10px)' }))
      ])
    ])
  ]
})
export class TabComponent {
  @Input() label = '';
  @Input() icon?: string;
  @Input() disabled = false;
  @Input() active = false;
}

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tabs-container" [class.vertical]="vertical">
      <div 
        class="tabs-header"
        [class.scrollable]="scrollable"
        role="tablist"
      >
        <div 
          *ngFor="let tab of tabs; let i = index"
          class="tab-item"
          [class.active]="tab.active"
          [class.disabled]="tab.disabled"
          role="tab"
          [attr.aria-selected]="tab.active"
          [attr.aria-disabled]="tab.disabled"
          (click)="selectTab(i)"
        >
          <i *ngIf="tab.icon" [class]="tab.icon" class="tab-icon"></i>
          {{ tab.label }}
        </div>

        <div 
          class="tab-indicator"
          [style.--tab-width]="indicatorWidth + 'px'"
          [style.--tab-offset]="indicatorOffset + 'px'"
        ></div>
      </div>

      <div class="tabs-body">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements AfterContentInit {
  @ContentChildren(TabComponent) tabs!: QueryList<TabComponent>;

  @Input() vertical = false;
  @Input() scrollable = false;

  @Output() selectedIndexChange = new EventEmitter<number>();

  private _selectedIndex = 0;
  indicatorWidth = 0;
  indicatorOffset = 0;

  @Input()
  get selectedIndex(): number {
    return this._selectedIndex;
  }
  set selectedIndex(value: number) {
    if (this.tabs && value !== this._selectedIndex) {
      this.selectTab(value);
    }
  }

  ngAfterContentInit() {
    // Set initial active tab
    const activeTabs = this.tabs.filter(tab => tab.active);
    if (activeTabs.length === 0) {
      this.selectTab(0);
    }

    // Update indicator when tabs change
    this.tabs.changes.subscribe(() => {
      if (this._selectedIndex >= this.tabs.length) {
        this.selectTab(Math.max(0, this.tabs.length - 1));
      }
      this.updateIndicator();
    });

    // Initial indicator update
    setTimeout(() => this.updateIndicator(), 0);
  }

  selectTab(index: number) {
    if (
      !this.tabs ||
      index < 0 ||
      index >= this.tabs.length ||
      this.tabs.toArray()[index].disabled
    ) {
      return;
    }

    this.tabs.forEach((tab, i) => (tab.active = i === index));
    this._selectedIndex = index;
    this.selectedIndexChange.emit(index);
    this.updateIndicator();
  }

  private updateIndicator() {
    if (!this.tabs || this.vertical) return;

    const tabElements = Array.from(document.querySelectorAll('.tab-item'));
    if (tabElements.length === 0) return;

    const activeTab = tabElements[this._selectedIndex] as HTMLElement;
    this.indicatorWidth = activeTab.offsetWidth;
    this.indicatorOffset = activeTab.offsetLeft;
  }
}