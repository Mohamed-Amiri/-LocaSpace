import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly KEY = 'loca_favorites';
  private favorites = new Set<number>();

  constructor() {
    const stored = localStorage.getItem(this.KEY);
    if (stored) {
      try {
        this.favorites = new Set(JSON.parse(stored));
      } catch {
        /* ignore */
      }
    }
  }

  toggle(id: number): void {
    if (this.favorites.has(id)) {
      this.favorites.delete(id);
    } else {
      this.favorites.add(id);
    }
    this.save();
  }

  isFavorite(id: number): boolean {
    return this.favorites.has(id);
  }

  private save() {
    localStorage.setItem(this.KEY, JSON.stringify([...this.favorites]));
  }
}
