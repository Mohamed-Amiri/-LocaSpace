import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkModeSubject = new BehaviorSubject<boolean>(false);
  public darkMode$ = this.darkModeSubject.asObservable();

  constructor() {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    this.setTheme(isDark);
  }

  get isDark(): boolean {
    return this.darkModeSubject.value;
  }

  get isDarkTheme$() {
    return this.darkMode$;
  }

  isDarkMode(): boolean {
    return this.darkModeSubject.value;
  }

  initializeTheme(): void {
    // Theme is already initialized in constructor
  }

  toggleTheme(): void {
    this.setTheme(!this.isDark);
  }

  setTheme(isDark: boolean): void {
    this.darkModeSubject.next(isDark);
    
    // Update DOM
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark-mode');
    }
    
    // Save preference
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }
}