import { Directive, HostListener, ElementRef, Input } from '@angular/core';
import { ImageService } from '../services/image.service';

@Directive({
  selector: 'img[fallbackImage]',
  standalone: true
})
export class ImageFallbackDirective {
  @Input() fallbackImage?: string;

  constructor(
    private el: ElementRef<HTMLImageElement>,
    private imageService: ImageService
  ) {}

  @HostListener('error', ['$event'])
  onError(event: Event): void {
    const img = this.el.nativeElement;
    const fallback = this.fallbackImage || this.imageService.getImageUrl(null);
    
    // Prevent infinite loop if fallback also fails
    if (img.src !== fallback) {
      img.src = fallback;
    }
  }

  @HostListener('load', ['$event'])
  onLoad(event: Event): void {
    // Optional: Add loaded class for styling
    this.el.nativeElement.classList.add('image-loaded');
  }
}