import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lightbox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lightbox.component.html',
  styleUrls: ['./lightbox.component.scss']
})
export class LightboxComponent {
  @Input() images: string[] = [];
  @Input() currentImageIndex = 0;
  @Output() close = new EventEmitter<void>();

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: Event) {
    this.close.emit();
  }

  nextImage(): void {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
  }

  prevImage(): void {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
  }

  closeLightbox(): void {
    this.close.emit();
  }
}
