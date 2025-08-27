import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="avatar"
      [class.avatar-sm]="size === 'sm'"
      [class.avatar-lg]="size === 'lg'"
      [class.avatar-xl]="size === 'xl'"
      [class.avatar-square]="shape === 'square'"
      [style.background-color]="backgroundColor"
      [attr.aria-label]="ariaLabel"
    >
      <img
        *ngIf="imageUrl && !error"
        [src]="imageUrl"
        [alt]="alt"
        (error)="handleImageError()"
        class="avatar-image"
      />
      <span *ngIf="!imageUrl || error" class="avatar-initials">{{ initials }}</span>

      <div 
        *ngIf="status"
        class="avatar-status"
        [class.status-online]="status === 'online'"
        [class.status-away]="status === 'away'"
        [class.status-busy]="status === 'busy'"
        [class.status-offline]="status === 'offline'"
        [attr.aria-label]="'Status: ' + status"
      ></div>

      <div 
        *ngIf="badge"
        class="avatar-badge"
        [style.background-color]="badgeColor"
      >{{ badge }}</div>
    </div>
  `,
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnChanges {
  @Input() imageUrl?: string;
  @Input() name = '';
  @Input() alt = '';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() shape: 'circle' | 'square' = 'circle';
  @Input() status?: 'online' | 'away' | 'busy' | 'offline';
  @Input() badge?: string | number;
  @Input() badgeColor = 'var(--color-primary)';

  error = false;
  initials = '';
  backgroundColor = '';
  ariaLabel = '';

  private colors = [
    '#F44336', '#E91E63', '#9C27B0', '#673AB7',
    '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4',
    '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
    '#FFC107', '#FF9800', '#FF5722', '#795548'
  ];

  ngOnChanges() {
    this.generateInitials();
    this.generateBackgroundColor();
    this.generateAriaLabel();
  }

  handleImageError() {
    this.error = true;
  }

  private generateInitials() {
    if (!this.name) {
      this.initials = '?';
      return;
    }

    const names = this.name.trim().split(' ');
    if (names.length === 1) {
      this.initials = names[0].charAt(0).toUpperCase();
    } else {
      this.initials = (
        names[0].charAt(0) + names[names.length - 1].charAt(0)
      ).toUpperCase();
    }
  }

  private generateBackgroundColor() {
    if (!this.name) {
      this.backgroundColor = this.colors[0];
      return;
    }

    const charCode = this.name
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colorIndex = charCode % this.colors.length;
    this.backgroundColor = this.colors[colorIndex];
  }

  private generateAriaLabel() {
    const parts = [this.name || 'Avatar'];
    if (this.status) parts.push(`Status: ${this.status}`);
    if (this.badge) parts.push(`Badge: ${this.badge}`);
    this.ariaLabel = parts.join(', ');
  }
}