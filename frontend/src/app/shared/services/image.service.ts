import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private readonly backendBaseUrl = environment.apiUrl.replace('/api', '');

  /**
   * Converts a relative image URL to a full URL pointing to the backend server
   * @param imageUrl - The image URL (can be relative or absolute)
   * @returns Full URL to the image
   */
  getImageUrl(imageUrl: string | null | undefined): string {
    if (!imageUrl) {
      return this.getPlaceholderUrl();
    }

    // If it's already a full URL (http/https), return as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }

    // If it's a relative URL starting with /uploads, prepend backend URL
    if (imageUrl.startsWith('/uploads')) {
      return `${this.backendBaseUrl}${imageUrl}`;
    }

    // If it's just a filename, assume it's in uploads and return placeholder
    return this.getPlaceholderUrl();
  }

  /**
   * Gets multiple image URLs
   * @param imageUrls - Array of image URLs
   * @returns Array of full URLs
   */
  getImageUrls(imageUrls: string[] | null | undefined): string[] {
    if (!imageUrls || imageUrls.length === 0) {
      return [this.getPlaceholderUrl()];
    }

    return imageUrls.map(url => this.getImageUrl(url));
  }

  /**
   * Gets the first available image URL from an array
   * @param imageUrls - Array of image URLs
   * @returns First valid image URL or placeholder
   */
  getFirstImageUrl(imageUrls: string[] | null | undefined): string {
    const urls = this.getImageUrls(imageUrls);
    return urls[0];
  }

  /**
   * Returns a high-quality placeholder image URL
   * @returns Placeholder image URL
   */
  private getPlaceholderUrl(): string {
    return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80';
  }

  /**
   * Handles image loading errors by setting a fallback image
   * @param event - The error event from the img element
   */
  onImageError(event: any): void {
    if (event.target) {
      event.target.src = this.getPlaceholderUrl();
    }
  }
}