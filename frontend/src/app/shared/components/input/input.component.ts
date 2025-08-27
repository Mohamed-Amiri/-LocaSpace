import { Component, Input, Self, Optional, OnInit, OnDestroy } from '@angular/core';
import { NgControl, ControlValueAccessor, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-input',
  template: `
    <div class="input-container" [class.full-width]="fullWidth">
      <label *ngIf="label" [for]="id" class="input-label">
        {{ label }}
        <span *ngIf="required" class="required-indicator">*</span>
      </label>

      <div class="input-wrapper" [class.has-prefix]="!!prefix" [class.has-suffix]="!!suffix">
        <div *ngIf="prefix" class="input-prefix">
          <mat-icon *ngIf="prefixIcon">{{ prefixIcon }}</mat-icon>
          <ng-container *ngTemplateOutlet="prefix"></ng-container>
        </div>

        <input
          [id]="id"
          [type]="type"
          [placeholder]="placeholder"
          [attr.aria-label]="ariaLabel || label"
          [attr.aria-describedby]="ariaDescribedBy"
          [attr.maxlength]="maxLength"
          [readonly]="readonly"
          [disabled]="disabled"
          [class.ng-invalid]="isInvalid"
          (blur)="onTouched()"
          (input)="onChange($event)"
          [value]="value"
        />

        <div *ngIf="suffix" class="input-suffix">
          <mat-icon *ngIf="suffixIcon">{{ suffixIcon }}</mat-icon>
          <ng-container *ngTemplateOutlet="suffix"></ng-container>
        </div>

        <button
          *ngIf="clearable && value"
          type="button"
          class="clear-button"
          (click)="clearValue($event)"
          aria-label="Clear input"
        >
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div *ngIf="hint" class="input-hint">
        {{ hint }}
      </div>

      <div *ngIf="isInvalid && showErrors" class="input-error">
        <ng-container *ngIf="control.errors as errors">
          <span *ngIf="errors['required']">Ce champ est requis</span>
          <span *ngIf="errors['email']">Adresse email invalide</span>
          <span *ngIf="errors['minlength']">Minimum {{ errors['minlength'].requiredLength }} caractères</span>
          <span *ngIf="errors['maxlength']">Maximum {{ errors['maxlength'].requiredLength }} caractères</span>
          <span *ngIf="errors['pattern']">Format invalide</span>
          <span *ngIf="errors['custom']">{{ errors['custom'] }}</span>
        </ng-container>
      </div>
    </div>
  `,
  styleUrls: ['./input.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule],
})
export class InputComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() id: string = `input-${Math.random().toString(36).substr(2, 9)}`;
  @Input() label?: string;
  @Input() type: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' = 'text';
  @Input() placeholder: string = '';
  @Input() hint?: string;
  @Input() prefix?: any;
  @Input() suffix?: any;
  @Input() prefixIcon?: string;
  @Input() suffixIcon?: string;
  @Input() required: boolean = false;
  @Input() readonly: boolean = false;
  @Input() disabled: boolean = false;
  @Input() clearable: boolean = false;
  @Input() fullWidth: boolean = true;
  @Input() showErrors: boolean = true;
  @Input() maxLength?: number;
  @Input() ariaLabel?: string;
  @Input() ariaDescribedBy?: string;

  value: any = '';
  isInvalid: boolean = false;
  control!: FormControl;

  private destroy$ = new Subject<void>();

  constructor(@Self() @Optional() private ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit() {
    if (this.ngControl && this.ngControl.control) {
      this.control = this.ngControl.control as FormControl;
      
      this.control.statusChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.isInvalid = this.control.invalid && (this.control.dirty || this.control.touched);
        });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ControlValueAccessor implementation
  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = (event: Event) => {
      const value = (event.target as HTMLInputElement).value;
      fn(value);
      this.value = value;
    };
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  clearValue(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    
    this.value = '';
    this.onChange(new Event('input'));
    this.onTouched();
  }
}