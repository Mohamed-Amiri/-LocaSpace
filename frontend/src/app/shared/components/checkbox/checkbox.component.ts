import { Component, Input, Output, EventEmitter, Self, Optional, OnInit } from '@angular/core';
import { NgControl, ControlValueAccessor } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="checkbox-container" [class.full-width]="fullWidth">
      <div 
        class="checkbox-wrapper"
        [class.checked]="checked"
        [class.disabled]="disabled"
        [class.indeterminate]="indeterminate"
      >
        <input
          type="checkbox"
          [id]="id"
          [checked]="checked"
          [disabled]="disabled"
          [attr.aria-label]="ariaLabel || label"
          [attr.aria-checked]="indeterminate ? 'mixed' : checked"
          (change)="onInputChange($event)"
          (blur)="onTouched()"
        />

        <div class="checkbox-inner">
          <mat-icon *ngIf="checked && !indeterminate" class="check-icon">check</mat-icon>
          <mat-icon *ngIf="indeterminate" class="indeterminate-icon">remove</mat-icon>
        </div>

        <label 
          *ngIf="label" 
          [for]="id" 
          class="checkbox-label"
          [class.required]="required"
        >
          {{ label }}
          <span *ngIf="required" class="required-indicator">*</span>
        </label>
      </div>

      <div *ngIf="description" class="checkbox-description">
        {{ description }}
      </div>

      <div *ngIf="error" class="checkbox-error">
        {{ error }}
      </div>
    </div>
  `,
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements ControlValueAccessor, OnInit {
  @Input() id: string = `checkbox-${Math.random().toString(36).substr(2, 9)}`;
  @Input() label?: string;
  @Input() description?: string;
  @Input() error?: string;
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() indeterminate: boolean = false;
  @Input() fullWidth: boolean = false;
  @Input() ariaLabel?: string;

  @Output() change = new EventEmitter<boolean>();
  @Output() indeterminateChange = new EventEmitter<boolean>();

  checked: boolean = false;

  constructor(@Self() @Optional() private ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit() {
    if (this.ngControl?.control?.errors) {
      const errors = this.ngControl.control.errors;
      if (errors['required']) {
        this.error = 'Ce champ est requis';
      } else if (errors['custom']) {
        this.error = errors['custom'];
      }
    }
  }

  // ControlValueAccessor implementation
  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value: boolean): void {
    this.checked = value;
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

  onInputChange(event: Event): void {
    if (this.disabled) return;

    const checkbox = event.target as HTMLInputElement;
    this.checked = checkbox.checked;
    
    if (this.indeterminate) {
      this.indeterminate = false;
      this.indeterminateChange.emit(false);
    }

    this.onChange(this.checked);
    this.change.emit(this.checked);
  }

  toggle(): void {
    if (!this.disabled) {
      this.checked = !this.checked;
      this.onChange(this.checked);
      this.change.emit(this.checked);

      if (this.indeterminate) {
        this.indeterminate = false;
        this.indeterminateChange.emit(false);
      }
    }
  }

  setIndeterminate(value: boolean): void {
    if (!this.disabled) {
      this.indeterminate = value;
      this.indeterminateChange.emit(value);
    }
  }
}