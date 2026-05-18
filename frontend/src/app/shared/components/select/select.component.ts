import { Component, Input, Output, EventEmitter, Self, Optional } from '@angular/core';
import { NgControl, ControlValueAccessor } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface SelectOption {
  value: any;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-select',
  template: `
    <div class="select-container" [class.full-width]="fullWidth">
      <label *ngIf="label" [for]="id" class="select-label">
        {{ label }}
        <span *ngIf="required" class="required-indicator">*</span>
      </label>

      <select
        [id]="id"
        [value]="value"
        [required]="required"
        [disabled]="disabled"
        [multiple]="multiple"
        (change)="onSelectionChange($event)"
        (blur)="onTouched()"
        class="form-select"
      >
        <option *ngIf="showEmptyOption" [value]="null">{{ emptyOptionLabel }}</option>
        
        <optgroup *ngFor="let group of groups" [label]="group.label" [disabled]="group.disabled">
          <option *ngFor="let option of group.options" [value]="option.value" [disabled]="option.disabled">
            {{ option.label }}
          </option>
        </optgroup>

        <option *ngFor="let option of options" [value]="option.value" [disabled]="option.disabled">
          {{ option.label }}
        </option>
      </select>

      <div *ngIf="hint" class="select-hint">{{ hint }}</div>
    </div>
  `,
  styleUrls: ['./select.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class SelectComponent implements ControlValueAccessor {
  @Input() id: string = `select-${Math.random().toString(36).substr(2, 9)}`;
  @Input() label?: string;
  @Input() hint?: string;
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() multiple: boolean = false;
  @Input() fullWidth: boolean = true;
  @Input() showEmptyOption: boolean = false;
  @Input() emptyOptionLabel: string = 'Sélectionner...';

  @Input() options: SelectOption[] = [];
  @Input() groups: { label: string; disabled?: boolean; options: SelectOption[] }[] = [];

  @Output() selectionChanged = new EventEmitter<any>();

  value: any = '';

  constructor(@Self() @Optional() private ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

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

  onSelectionChange(event: any): void {
    const target = event.target as HTMLSelectElement;
    let newValue: any;
    
    if (this.multiple) {
      newValue = Array.from(target.selectedOptions).map(opt => opt.value);
    } else {
      newValue = target.value;
    }
    
    this.value = newValue;
    this.onChange(newValue);
    this.onTouched();
    this.selectionChanged.emit(newValue);
  }
}