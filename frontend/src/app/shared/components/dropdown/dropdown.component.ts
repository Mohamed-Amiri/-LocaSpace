import { Component, Input, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

export interface DropdownOption {
  id: string | number;
  label: string;
  icon?: string;
  disabled?: boolean;
  description?: string;
}

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dropdown-container" [class.disabled]="disabled">
      <button
        class="dropdown-trigger"
        [class.active]="isOpen"
        [attr.aria-expanded]="isOpen"
        [attr.aria-disabled]="disabled"
        (click)="toggleDropdown($event)"
      >
        <span class="trigger-content">
          <span *ngIf="selectedOption?.icon" class="trigger-icon">
            <i [class]="selectedOption!.icon"></i>
          </span>
          {{ selectedOption?.label || placeholder }}
        </span>
        <svg
          class="trigger-arrow"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      <div
        *ngIf="isOpen"
        class="dropdown-menu"
        [@menuAnimation]
        role="listbox"
        [attr.aria-label]="label"
      >
        <div *ngIf="options.length === 0" class="dropdown-empty">
          {{ emptyMessage }}
        </div>
        
        <div 
          *ngFor="let option of options"
          class="dropdown-option"
          [class.selected]="isSelected(option)"
          [class.disabled]="option.disabled"
          (click)="selectOption(option)"
          role="option"
          [attr.aria-selected]="isSelected(option)"
        >
          <i *ngIf="option.icon" [class]="option.icon" class="option-icon"></i>
          <div class="option-content">
            <div class="option-label">{{ option.label }}</div>
            <div *ngIf="option.description" class="option-description">
              {{ option.description }}
            </div>
          </div>
          <svg
            *ngIf="isSelected(option)"
            class="option-check"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
      </div>
    </div>
  `,
  animations: [
    trigger('menuAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-8px)' }),
        animate('150ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'translateY(-8px)' }))
      ])
    ])
  ],
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent {
  @Input() options: DropdownOption[] = [];
  @Input() selected?: string | number;
  @Input() placeholder = 'Select an option';
  @Input() label = 'Dropdown';
  @Input() disabled = false;
  @Input() emptyMessage = 'No options available';

  @Output() selectedChange = new EventEmitter<string | number>();

  isOpen = false;

  constructor(private elementRef: ElementRef) {}

  get selectedOption(): DropdownOption | undefined {
    return this.options.find(option => option.id === this.selected);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  toggleDropdown(event: MouseEvent) {
    event.stopPropagation();
    if (!this.disabled) {
      this.isOpen = !this.isOpen;
    }
  }

  selectOption(option: DropdownOption) {
    if (option.disabled) return;
    
    this.selected = option.id;
    this.selectedChange.emit(option.id);
    this.isOpen = false;
  }

  isSelected(option: DropdownOption): boolean {
    return option.id === this.selected;
  }
}