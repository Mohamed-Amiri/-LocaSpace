import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService, User } from '../../auth/auth.service';
import { Observable } from 'rxjs';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-tenant-dashboard',
  templateUrl: './tenant-dashboard.component.html',
  styleUrls: ['./tenant-dashboard.component.scss'],
  imports: [CommonModule, RouterModule, EmptyStateComponent],
  standalone: true
})
export class TenantDashboardComponent implements OnInit {
  user$!: Observable<User | null>;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.user$ = this.authService.currentUser$;
  }

  navigateToSearch(): void {
    this.router.navigate(['/locataire/search']);
  }
}