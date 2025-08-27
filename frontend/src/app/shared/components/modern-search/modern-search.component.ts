import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GlassCardComponent } from '../glass-card/glass-card.component';

@Component({
  selector: 'app-modern-search',
  standalone: true,
  imports: [CommonModule, FormsModule, GlassCardComponent],
  template: `
    <div class="modern-search">
      <app-glass-card [customStyles]="{'padding': '1.5rem', 'border-radius': '24px'}">
        <div class="search-container">
          <!-- Location Input -->
          <div class="search-field">
            <div class="field-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div class="field-content">
              <label class="field-label">Destination</label>
              <input 
                type="text" 
                class="field-input"
                placeholder="Où allez-vous ?" 
                [(ngModel)]="location"
                (ngModelChange)="onLocationChange($event)"
                (focus)="showLocationSuggestions = true"
                (blur)="hideLocationSuggestions()">
            </div>
            
            <!-- Location Suggestions -->
            <div class="suggestions-dropdown" *ngIf="showLocationSuggestions && locationSuggestions.length > 0">
              <div class="suggestions-header">Destinations populaires</div>
              <div 
                class="suggestion-item" 
                *ngFor="let suggestion of locationSuggestions"
                (mousedown)="selectLocation(suggestion)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                {{ suggestion }}
              </div>
            </div>
          </div>

          <!-- Date Input -->
          <div class="search-field">
            <div class="field-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <div class="field-content">
              <label class="field-label">Dates</label>
              <input 
                type="text" 
                class="field-input"
                placeholder="Quand ?" 
                [(ngModel)]="dates"
                readonly>
            </div>
          </div>

          <!-- Guests Input -->
          <div class="search-field">
            <div class="field-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div class="field-content">
              <label class="field-label">Invités</label>
              <input 
                type="text" 
                class="field-input"
                placeholder="Combien ?" 
                [(ngModel)]="guests"
                readonly>
            </div>
          </div>

          <!-- Search Button -->
          <button class="search-button" (click)="onSearch()" [disabled]="!location">
            <div class="button-content">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <span class="button-text">Rechercher</span>
            </div>
          </button>
        </div>
      </app-glass-card>
    </div>
  `,
  styles: [`
    .modern-search {
      width: 100%;
      max-width: 900px;
      margin: 0 auto;
      position: relative;
    }

    .search-container {
      display: flex;
      align-items: stretch;
      gap: 1px;
      background: white;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .search-field {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.25rem 1.5rem;
      position: relative;
      transition: all 0.2s ease;
      background: transparent;

      &:hover {
        background: rgba(37, 99, 235, 0.02);
      }

      &:not(:last-child)::after {
        content: '';
        position: absolute;
        right: 0;
        top: 25%;
        bottom: 25%;
        width: 1px;
        background: rgba(0, 0, 0, 0.08);
      }

      .field-icon {
        color: #6B7280;
        flex-shrink: 0;
        transition: color 0.2s ease;
      }

      .field-content {
        flex: 1;
        min-width: 0;

        .field-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.25rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .field-input {
          width: 100%;
          border: none;
          background: transparent;
          outline: none;
          font-size: 1rem;
          color: #111827;
          font-weight: 500;
          font-family: 'Inter', sans-serif;

          &::placeholder {
            color: #9CA3AF;
          }

          &:focus {
            color: #2563EB;
          }

          &:focus + .field-icon {
            color: #2563EB;
          }
        }
      }

      // Suggestions dropdown
      .suggestions-dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border-radius: 16px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        border: 1px solid rgba(0, 0, 0, 0.05);
        z-index: 1000;
        margin-top: 0.5rem;
        overflow: hidden;

        .suggestions-header {
          padding: 1rem 1.5rem 0.5rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: #6B7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          background: #F8FAFC;
        }

        .suggestion-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #374151;
          font-weight: 500;

          &:hover {
            background: rgba(37, 99, 235, 0.05);
            color: #2563EB;
          }

          svg {
            color: #9CA3AF;
            flex-shrink: 0;
          }
        }
      }
    }

    .search-button {
      background: linear-gradient(135deg, #F59E0B 0%, #F97316 100%);
      border: none;
      border-radius: 20px;
      padding: 1.25rem 2rem;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      color: white;
      font-weight: 600;
      font-size: 1rem;
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
      position: relative;
      overflow: hidden;

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
        filter: brightness(1.05);
      }

      &:active {
        transform: translateY(0);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
      }

      .button-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        position: relative;
        z-index: 2;

        svg {
          flex-shrink: 0;
        }

        .button-text {
          font-family: 'Inter', sans-serif;
        }
      }

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        transition: left 0.5s;
        z-index: 1;
      }

      &:hover::before {
        left: 100%;
      }
    }

    // Responsive Design
    @media (max-width: 1024px) {
      .search-container {
        flex-direction: column;
        gap: 1rem;
        
        .search-field {
          &:not(:last-child)::after {
            display: none;
          }
        }
        
        .search-button {
          align-self: stretch;
          justify-content: center;
        }
      }
    }

    @media (max-width: 768px) {
      .search-field {
        padding: 1rem 1.25rem;
        
        .field-content {
          .field-label {
            font-size: 0.7rem;
          }
          
          .field-input {
            font-size: 0.9rem;
          }
        }
      }
      
      .search-button {
        padding: 1rem 1.5rem;
        font-size: 0.9rem;
      }
    }
  `]
})
export class ModernSearchComponent implements OnInit {
  @Input() placeholder = 'Où allez-vous ?';
  @Output() search = new EventEmitter<{location: string, dates: string, guests: string}>();

  location = '';
  dates = '';
  guests = '';
  
  showLocationSuggestions = false;
  locationSuggestions: string[] = [
    'Marrakech, Maroc',
    'Casablanca, Maroc',
    'Rabat, Maroc',
    'Fès, Maroc',
    'Tanger, Maroc',
    'Agadir, Maroc'
  ];

  ngOnInit() {
    // Initialize with default values if needed
  }

  onLocationChange(value: string) {
    this.location = value;
    this.showLocationSuggestions = value.length > 0;
  }

  selectLocation(location: string) {
    this.location = location;
    this.showLocationSuggestions = false;
  }

  hideLocationSuggestions() {
    // Delay to allow click on suggestion
    setTimeout(() => {
      this.showLocationSuggestions = false;
    }, 200);
  }

  onSearch() {
    if (this.location) {
      this.search.emit({
        location: this.location,
        dates: this.dates,
        guests: this.guests
      });
    }
  }
}