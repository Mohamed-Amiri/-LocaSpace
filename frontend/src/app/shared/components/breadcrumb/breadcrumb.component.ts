import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface BreadcrumbItem {
  label: string;
  link?: string;
  icon?: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav 
      class="breadcrumb" 
      [class.small]="small"
      aria-label="breadcrumb"
    >
      <ol class="breadcrumb-list">
        <li 
          *ngFor="let item of items; let first = first; let last = last"
          class="breadcrumb-item"
          [class.active]="last"
        >
          <ng-container *ngIf="!last && item.link">
            <a 
              [routerLink]="item.link"
              class="breadcrumb-link"
            >
              <i *ngIf="item.icon" [class]="item.icon" class="breadcrumb-icon"></i>
              {{ item.label }}
            </a>
          </ng-container>

          <ng-container *ngIf="!last && !item.link">
            <span class="breadcrumb-text">
              <i *ngIf="item.icon" [class]="item.icon" class="breadcrumb-icon"></i>
              {{ item.label }}
            </span>
          </ng-container>

          <ng-container *ngIf="last">
            <span 
              class="breadcrumb-text"
              [attr.aria-current]="'page'"
            >
              <i *ngIf="item.icon" [class]="item.icon" class="breadcrumb-icon"></i>
              {{ item.label }}
            </span>
          </ng-container>

          <svg
            *ngIf="!last"
            class="breadcrumb-separator"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </li>
      </ol>
    </nav>
  `,
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent {
  @Input() items: BreadcrumbItem[] = [];
  @Input() small = false;
}