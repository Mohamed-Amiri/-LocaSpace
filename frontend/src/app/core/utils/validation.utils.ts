import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class ValidationUtils {
  /**
   * Email validation regex
   */
  static readonly EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  /**
   * Password validation regex (at least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char)
   */
  static readonly PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  /**
   * Phone number validation regex
   */
  static readonly PHONE_REGEX = /^[\+]?[1-9][\d]{0,15}$/;

  /**
   * URL validation regex
   */
  static readonly URL_REGEX = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

  /**
   * Custom email validator
   */
  static emailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const valid = ValidationUtils.EMAIL_REGEX.test(control.value);
      return valid ? null : { email: { value: control.value } };
    };
  }

  /**
   * Custom password strength validator
   */
  static passwordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const value = control.value;
      const errors: any = {};

      if (value.length < 8) {
        errors.minLength = true;
      }

      if (!/[A-Z]/.test(value)) {
        errors.uppercase = true;
      }

      if (!/[a-z]/.test(value)) {
        errors.lowercase = true;
      }

      if (!/\d/.test(value)) {
        errors.number = true;
      }

      if (!/[@$!%*?&]/.test(value)) {
        errors.specialChar = true;
      }

      return Object.keys(errors).length > 0 ? { passwordStrength: errors } : null;
    };
  }

  /**
   * Password match validator for form groups
   */
  static passwordMatchValidator(passwordField: string, confirmPasswordField: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get(passwordField);
      const confirmPassword = control.get(confirmPasswordField);

      if (!password || !confirmPassword) return null;

      return password.value === confirmPassword.value ? null : { passwordMismatch: true };
    };
  }

  /**
   * Phone number validator
   */
  static phoneValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const valid = ValidationUtils.PHONE_REGEX.test(control.value);
      return valid ? null : { phone: { value: control.value } };
    };
  }

  /**
   * URL validator
   */
  static urlValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const valid = ValidationUtils.URL_REGEX.test(control.value);
      return valid ? null : { url: { value: control.value } };
    };
  }

  /**
   * Min age validator
   */
  static minAgeValidator(minAge: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const birthDate = new Date(control.value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= minAge ? null : { minAge: { requiredAge: minAge, actualAge: age - 1 } };
      }
      
      return age >= minAge ? null : { minAge: { requiredAge: minAge, actualAge: age } };
    };
  }

  /**
   * File size validator
   */
  static fileSizeValidator(maxSizeInMB: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const file = control.value as File;
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
      
      return file.size <= maxSizeInBytes ? null : { 
        fileSize: { 
          maxSize: maxSizeInMB, 
          actualSize: Math.round(file.size / 1024 / 1024 * 100) / 100 
        } 
      };
    };
  }

  /**
   * File type validator
   */
  static fileTypeValidator(allowedTypes: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const file = control.value as File;
      const fileType = file.type.toLowerCase();
      
      return allowedTypes.includes(fileType) ? null : { 
        fileType: { 
          allowedTypes, 
          actualType: fileType 
        } 
      };
    };
  }

  /**
   * Get validation error message
   */
  static getErrorMessage(errors: ValidationErrors): string {
    if (errors['required']) return 'Ce champ est requis';
    if (errors['email']) return 'Adresse email invalide';
    if (errors['minlength']) return `Minimum ${errors['minlength'].requiredLength} caractères requis`;
    if (errors['maxlength']) return `Maximum ${errors['maxlength'].requiredLength} caractères autorisés`;
    if (errors['pattern']) return 'Format invalide';
    if (errors['passwordMismatch']) return 'Les mots de passe ne correspondent pas';
    if (errors['passwordStrength']) return 'Le mot de passe ne respecte pas les critères de sécurité';
    if (errors['phone']) return 'Numéro de téléphone invalide';
    if (errors['url']) return 'URL invalide';
    if (errors['minAge']) return `Âge minimum requis: ${errors['minAge'].requiredAge} ans`;
    if (errors['fileSize']) return `Taille de fichier maximale: ${errors['fileSize'].maxSize}MB`;
    if (errors['fileType']) return `Types de fichiers autorisés: ${errors['fileType'].allowedTypes.join(', ')}`;
    
    return 'Valeur invalide';
  }
}