import { Component, Input, ContentChild, AfterContentInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgModel, FormControlName } from '@angular/forms';
import { fadeInAnimation } from '../../animations/fade.animation';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule],
  animations: [fadeInAnimation],
  template: `
    <div class="form-field" [class.form-field-error]="showError">
      <label *ngIf="label" [for]="inputId" class="form-label">
        {{ label }}
        <span class="required-mark" *ngIf="required">*</span>
      </label>
      
      <div class="input-container">
        <ng-content></ng-content>
        
        <div class="input-icon" *ngIf="icon">
          <i [class]="icon"></i>
        </div>

        <div class="validation-icon" *ngIf="control?.dirty && !control?.pending">
          <svg *ngIf="!showError" class="success-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
          <svg *ngIf="showError" class="error-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
      </div>

      <div class="hint-container">
        <div class="hint-text" *ngIf="hint && !showError">{{ hint }}</div>
        <div class="error-text" *ngIf="showError" [@fadeIn]>{{ errorMessage }}</div>
      </div>
    </div>
  `,
  styles: [`
    .form-field {
      margin-bottom: 1.5rem;
    }

    .form-label {
      display: block;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-primary);

      .required-mark {
        color: var(--color-error);
        margin-left: 0.25rem;
      }
    }

    .input-container {
      position: relative;

      ::ng-deep input,
      ::ng-deep select,
      ::ng-deep textarea {
        width: 100%;
        padding: 0.625rem 1rem;
        font-size: 1rem;
        border: 1px solid var(--border-color);
        border-radius: 0.5rem;
        background: var(--input-bg);
        color: var(--text-primary);
        transition: all 0.2s;

        &:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px var(--color-primary-light);
        }

        &:disabled {
          background: var(--input-disabled-bg);
          cursor: not-allowed;
        }
      }
    }

    .input-icon {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 1rem;
      color: var(--text-secondary);

      & + ::ng-deep input {
        padding-left: 2.5rem;
      }
    }

    .validation-icon {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;

      .success-icon {
        color: var(--color-success);
      }

      .error-icon {
        color: var(--color-error);
      }
    }

    .hint-container {
      min-height: 1.25rem;
      margin-top: 0.25rem;
    }

    .hint-text {
      font-size: 0.75rem;
      color: var(--text-secondary);
    }

    .error-text {
      font-size: 0.75rem;
      color: var(--color-error);
    }

    .form-field-error {
      ::ng-deep input,
      ::ng-deep select,
      ::ng-deep textarea {
        border-color: var(--color-error);

        &:focus {
          box-shadow: 0 0 0 3px var(--color-error-light);
        }
      }
    }

    :host-context(.dark-theme) {
      .form-label {
        color: var(--text-primary-dark);
      }

      ::ng-deep input,
      ::ng-deep select,
      ::ng-deep textarea {
        background: var(--input-bg-dark);
        border-color: var(--border-color-dark);
        color: var(--text-primary-dark);

        &:disabled {
          background: var(--input-disabled-bg-dark);
        }
      }

      .hint-text {
        color: var(--text-secondary-dark);
      }
    }
  `]
})
export class FormFieldComponent implements AfterContentInit {
  @Input() label = '';
  @Input() hint = '';
  @Input() icon = '';
  @Input() required = false;
  @Input() inputId = '';

  @ContentChild(NgModel) ngModel: NgModel | undefined;
  @ContentChild(FormControlName) formControlName: FormControlName | undefined;

  get control() {
    return this.ngModel?.control || this.formControlName?.control;
  }

  get showError() {
    return this.control?.invalid && (this.control?.dirty || this.control?.touched);
  }

  get errorMessage() {
    if (!this.control?.errors) return '';

    const errors = this.control.errors;
    if (errors['required']) return 'Ce champ est requis';
    if (errors['email']) return 'Email invalide';
    if (errors['minlength']) return `Minimum ${errors['minlength'].requiredLength} caractères`;
    if (errors['maxlength']) return `Maximum ${errors['maxlength'].requiredLength} caractères`;
    if (errors['pattern']) return 'Format invalide';
    if (errors['passwordMismatch']) return 'Les mots de passe ne correspondent pas';

    return 'Champ invalide';
  }

  ngAfterContentInit() {
    if (!this.inputId && (this.ngModel || this.formControlName)) {
      console.warn('FormFieldComponent: inputId should be provided for accessibility');
    }
  }
}