import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export interface RadioOption {
  value: any;
  label: string;
  description?: string;
  disabled?: boolean;
  icon?: string;
}

@Component({
  selector: 'app-radio',
  template: `
    <div class="radio-group" [class.full-width]="fullWidth">
      <label *ngIf="label" class="radio-group-label">
        {{ label }}
        <span *ngIf="required" class="required-indicator">*</span>
      </label>

      <div class="radio-options" [class.vertical]="vertical">
        <div
          *ngFor="let option of options; let i = index"
          class="radio-option"
          [class.disabled]="option.disabled || disabled"
        >
          <div class="radio-input-wrapper">
            <input
              type="radio"
              [id]="id + '-' + i"
              [name]="name"
              [value]="option.value"
              [checked]="option.value === value"
              [disabled]="option.disabled || disabled"
              (change)="onOptionChange(option)"
              (blur)="onTouched()"
            />
            <div class="radio-input-inner">
              <div class="radio-input-dot"></div>
            </div>
          </div>

          <label [for]="id + '-' + i" class="radio-label">
            <div class="radio-label-content">
              <mat-icon *ngIf="option.icon" class="radio-icon">{{ option.icon }}</mat-icon>
              <div class="radio-text">
                <div class="radio-label-text">{{ option.label }}</div>
                <div *ngIf="option.description" class="radio-description">
                  {{ option.description }}
                </div>
              </div>
            </div>
          </label>
        </div>
      </div>

      <div *ngIf="hint" class="radio-hint">
        {{ hint }}
      </div>

      <div *ngIf="error" class="radio-error">
        {{ error }}
      </div>
    </div>
  `,
  styleUrls: ['./radio.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioComponent),
      multi: true
    }
  ]
})
export class RadioComponent implements ControlValueAccessor {
  @Input() id: string = `radio-${Math.random().toString(36).substr(2, 9)}`;
  @Input() name: string = this.id;
  @Input() label?: string;
  @Input() hint?: string;
  @Input() error?: string;
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() vertical: boolean = false;
  @Input() fullWidth: boolean = false;
  @Input() options: RadioOption[] = [];

  @Output() change = new EventEmitter<any>();

  value: any;

  // ControlValueAccessor implementation
  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onOptionChange(option: RadioOption): void {
    if (this.disabled || option.disabled) return;

    this.value = option.value;
    this.onChange(this.value);
    this.change.emit(this.value);
  }

  isSelected(option: RadioOption): boolean {
    return this.value === option.value;
  }
}