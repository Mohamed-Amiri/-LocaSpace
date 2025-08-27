import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService, User } from '../../auth/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tenant-dashboard',
  templateUrl: './tenant-dashboard.component.html',
  styleUrls: ['./tenant-dashboard.component.scss'],
  imports: [CommonModule, RouterModule],
  standalone: true
})
export class TenantDashboardComponent implements OnInit {
  user$!: Observable<User | null>;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.user$ = this.authService.currentUser$;
  }
}