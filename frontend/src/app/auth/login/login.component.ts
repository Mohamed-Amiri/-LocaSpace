import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  standalone: true
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rememberMe: [false]
    });
  }

  get email() {
    return this.loginForm.get('email')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }

  get rememberMe() {
    return this.loginForm.get('rememberMe')!;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const credentials = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
        rememberMe: this.loginForm.value.rememberMe
      };

      this.authService.login(credentials).subscribe({
        next: (user) => {
          this.isLoading = false;
          // Navigate based on user role
          switch (user.role) {
            case 'admin':
              this.router.navigate(['/admin/dashboard']);
              break;
            case 'owner':
              this.router.navigate(['/proprietaires/dashboard']);
              break;
            case 'tenant':
            default:
              this.router.navigate(['/locataire/dashboard']);
              break;
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message || 'Erreur de connexion. Veuillez réessayer.';
          console.error('Login error:', error);
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
