import { Component, Input, Output, EventEmitter, Self, Optional, OnInit, OnDestroy } from '@angular/core';
import { NgControl, ControlValueAccessor, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';

export interface SelectOption {
  value: any;
  label: string;
  disabled?: boolean;
  icon?: string;
  description?: string;
}

@Component({
  selector: 'app-select',
  template: `
    <div class="select-container" [class.full-width]="fullWidth">
      <label *ngIf="label" [for]="id" class="select-label">
        {{ label }}
        <span *ngIf="required" class="required-indicator">*</span>
      </label>

      <mat-form-field appearance="outline" [class.full-width]="fullWidth">
        <mat-select
          [id]="id"
          [value]="value"
          [placeholder]="placeholder"
          [required]="required"
          [disabled]="disabled"
          [multiple]="multiple"
          (selectionChange)="onSelectionChange($event)"
          (openedChange)="onOpenedChange($event)"
        >
          <mat-select-trigger *ngIf="multiple && selectedOptions.length > 0">
            {{ getSelectedLabels() }}
          </mat-select-trigger>

          <mat-option *ngIf="showEmptyOption" [value]="null">
            {{ emptyOptionLabel }}
          </mat-option>

          <mat-optgroup 
            *ngFor="let group of groups" 
            [label]="group.label"
            [disabled]="group.disabled"
          >
            <mat-option 
              *ngFor="let option of group.options" 
              [value]="option.value"
              [disabled]="option.disabled"
            >
              <div class="option-content">
                <mat-icon *ngIf="option.icon" class="option-icon">{{ option.icon }}</mat-icon>
                <div class="option-text">
                  <div class="option-label">{{ option.label }}</div>
                  <div *ngIf="option.description" class="option-description">
                    {{ option.description }}
                  </div>
                </div>
              </div>
            </mat-option>
          </mat-optgroup>

          <mat-option 
            *ngFor="let option of options" 
            [value]="option.value"
            [disabled]="option.disabled"
          >
            <div class="option-content">
              <mat-icon *ngIf="option.icon" class="option-icon">{{ option.icon }}</mat-icon>
              <div class="option-text">
                <div class="option-label">{{ option.label }}</div>
                <div *ngIf="option.description" class="option-description">
                  {{ option.description }}
                </div>
              </div>
            </div>
          </mat-option>
        </mat-select>

        <mat-hint *ngIf="hint">{{ hint }}</mat-hint>

        <mat-error *ngIf="control?.errors as errors">
          <ng-container [ngSwitch]="true">
            <span *ngSwitchCase="!!errors['required']">Ce champ est requis</span>
            <span *ngSwitchCase="!!errors['custom']">{{ errors['custom'] }}</span>
          </ng-container>
        </mat-error>
      </mat-form-field>
    </div>
  `,
  styleUrls: ['./select.component.scss'],
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, MatIconModule, MatOptionModule],
})
export class SelectComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() id: string = `select-${Math.random().toString(36).substr(2, 9)}`;
  @Input() label?: string;
  @Input() placeholder: string = '';
  @Input() hint?: string;
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() multiple: boolean = false;
  @Input() fullWidth: boolean = true;
  @Input() showEmptyOption: boolean = false;
  @Input() emptyOptionLabel: string = 'Sélectionner...';

  @Input() options: SelectOption[] = [];
  @Input() groups: { label: string; disabled?: boolean; options: SelectOption[] }[] = [];

  @Output() opened = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();
  @Output() selectionChanged = new EventEmitter<any>();

  value: any = '';
  selectedOptions: SelectOption[] = [];
  control?: FormControl;

  private destroy$ = new Subject<void>();

  constructor(@Self() @Optional() private ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit() {
    if (this.ngControl) {
      this.control = this.ngControl.control as FormControl;
    }
    this.updateSelectedOptions();
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
    this.updateSelectedOptions();
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

  onSelectionChange(event: any): void {
    this.value = event.value;
    this.onChange(event.value);
    this.onTouched();
    this.updateSelectedOptions();
    this.selectionChanged.emit(event.value);
  }

  onOpenedChange(opened: boolean): void {
    if (opened) {
      this.opened.emit();
    } else {
      this.closed.emit();
    }
  }

  getSelectedLabels(): string {
    if (this.selectedOptions.length === 0) return '';
    if (this.selectedOptions.length === 1) return this.selectedOptions[0].label;
    return `${this.selectedOptions[0].label} (+${this.selectedOptions.length - 1})`;
  }

  private updateSelectedOptions(): void {
    if (!this.value) {
      this.selectedOptions = [];
      return;
    }

    const allOptions = [...this.options, ...this.groups.flatMap(g => g.options)];

    if (this.multiple && Array.isArray(this.value)) {
      this.selectedOptions = this.value
        .map(v => allOptions.find(o => o.value === v))
        .filter((o): o is SelectOption => !!o);
    } else {
      const option = allOptions.find(o => o.value === this.value);
      this.selectedOptions = option ? [option] : [];
    }
  }
}