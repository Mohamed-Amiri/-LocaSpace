import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, User } from '../../auth/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  activeTab: 'info' | 'security' | 'notifications' | 'history' = 'info';
  user: User | null = null;
  
  infoForm: FormGroup;
  securityForm: FormGroup;
  
  loading = false;
  successMessage = '';
  
  userInitials = '';
  memberSince = 'Mai 2026'; // Mock date

  constructor(
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.infoForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['']
    });

    this.securityForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      if (user) {
        this.infoForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        });
        
        const first = user.firstName?.charAt(0) || '';
        const last = user.lastName?.charAt(0) || '';
        this.userInitials = (first + last).toUpperCase();
      }
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  switchTab(tab: 'info' | 'security' | 'notifications' | 'history'): void {
    this.activeTab = tab;
    this.successMessage = '';
  }

  onInfoSubmit(): void {
    if (this.infoForm.invalid) return;
    
    this.loading = true;
    this.successMessage = '';
    
    // Simulate API call
    setTimeout(() => {
      this.loading = false;
      this.successMessage = 'Vos informations ont été mises à jour avec succès.';
    }, 1000);
  }

  onSecuritySubmit(): void {
    if (this.securityForm.invalid) return;
    
    this.loading = true;
    this.successMessage = '';
    
    // Simulate API call
    setTimeout(() => {
      this.loading = false;
      this.successMessage = 'Votre mot de passe a été modifié.';
      this.securityForm.reset();
    }, 1000);
  }
}
