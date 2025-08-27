import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="toggle-container"
      [class.disabled]="disabled"
    >
      <label 
        *ngIf="label"
        [for]="id"
        class="toggle-label"
      >{{ label }}</label>

      <button
        type="button"
        [id]="id"
        class="toggle"
        [class.toggle-sm]="size === 'sm'"
        [class.toggle-lg]="size === 'lg'"
        [class.checked]="checked"
        [class.disabled]="disabled"
        [attr.aria-checked]="checked"
        [attr.aria-disabled]="disabled"
        (click)="toggle()"
        (keydown.space)="toggle()"
        (keydown.enter)="toggle()"
      >
        <div class="toggle-track">
          <div class="toggle-thumb"></div>
        </div>

        <span *ngIf="showIcons" class="toggle-icons">
          <svg
            class="toggle-icon-check"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <svg
            class="toggle-icon-x"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </span>
      </button>

      <span 
        *ngIf="description"
        class="toggle-description"
        [class.error]="error"
      >{{ description }}</span>
    </div>
  `,
  styleUrls: ['./toggle.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleComponent),
      multi: true
    }
  ]
})
export class ToggleComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() description = '';
  @Input() error = false;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() disabled = false;
  @Input() showIcons = false;
  @Input() id = `toggle-${Math.random().toString(36).substr(2, 9)}`;

  @Output() checkedChange = new EventEmitter<boolean>();

  checked = false;
  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: boolean): void {
    this.checked = value;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  toggle(): void {
    if (this.disabled) return;

    this.checked = !this.checked;
    this.onChange(this.checked);
    this.onTouched();
    this.checkedChange.emit(this.checked);
  }
}