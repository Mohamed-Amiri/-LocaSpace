import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface PlaceCardData {
  id: number;
  name: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  capacity: number;
  type: string;
  badges?: string[];
  isFavorite?: boolean;
}

@Component({
  selector: 'app-place-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="place-card" [routerLink]="['/lieux', place.id]">
      <div class="card-image">
        <img [src]="place.image" [alt]="place.name" loading="lazy">
        <div class="card-overlay">
          <button 
            class="favorite-btn" 
            [class.active]="place.isFavorite"
            (click)="onToggleFavorite($event)"
            [attr.aria-label]="place.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
          
          <div class="card-badges">
            <span 
              class="badge" 
              [ngClass]="'badge--' + getBadgeType(badge)"
              *ngFor="let badge of place.badges">
              {{ badge }}
            </span>
            <span class="badge badge--rating">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              {{ place.rating }}
            </span>
          </div>
        </div>
      </div>
      
      <div class="card-content">
        <div class="card-header">
          <h3 class="place-name">{{ place.name }}</h3>
          <div class="place-price">
            <span class="price-amount">€{{ place.price }}</span>
            <span class="price-period">/jour</span>
          </div>
        </div>
        
        <div class="place-location">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          {{ place.location }}
        </div>
        
        <div class="place-features">
          <span class="feature">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            {{ place.capacity }} personnes
          </span>
          <span class="feature">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9,22 9,12 15,12 15,22"/>
            </svg>
            {{ place.type }}
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .place-card {
      background: white;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      border: 1px solid rgba(0, 0, 0, 0.05);
      text-decoration: none;
      color: inherit;
      display: block;

      &:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
        border-color: rgba(37, 99, 235, 0.2);
      }

      .card-image {
        position: relative;
        height: 240px;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .card-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            180deg, 
            rgba(0,0,0,0.3) 0%, 
            transparent 50%, 
            rgba(0,0,0,0.1) 100%
          );
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 1rem;

          .favorite-btn {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
            color: #6B7280;
            z-index: 10;

            &:hover {
              background: rgba(255, 255, 255, 1);
              color: #EF4444;
              transform: scale(1.1);
            }

            &.active {
              background: #EF4444;
              color: white;

              svg {
                fill: currentColor;
              }
            }
          }

          .card-badges {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            align-items: flex-end;

            .badge {
              padding: 0.25rem 0.75rem;
              border-radius: 20px;
              font-size: 0.75rem;
              font-weight: 600;
              backdrop-filter: blur(10px);
              display: flex;
              align-items: center;
              gap: 0.25rem;
              border: 1px solid rgba(255, 255, 255, 0.2);

              &--premium {
                background: rgba(245, 158, 11, 0.9);
                color: white;
              }

              &--nouveau, &--new {
                background: rgba(34, 197, 94, 0.9);
                color: white;
              }

              &--tendance, &--trending {
                background: rgba(239, 68, 68, 0.9);
                color: white;
              }

              &--populaire, &--popular {
                background: rgba(124, 58, 237, 0.9);
                color: white;
              }

              &--rating {
                background: rgba(255, 255, 255, 0.95);
                color: #111827;

                svg {
                  color: #F59E0B;
                }
              }
            }
          }
        }
      }

      &:hover .card-image img {
        transform: scale(1.05);
      }

      .card-content {
        padding: 1.5rem;

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.75rem;

          .place-name {
            font-size: 1.25rem;
            font-weight: 600;
            color: #111827;
            margin: 0;
            font-family: 'Poppins', sans-serif;
          }

          .place-price {
            text-align: right;
            flex-shrink: 0;

            .price-amount {
              font-size: 1.25rem;
              font-weight: 700;
              color: #111827;
            }

            .price-period {
              font-size: 0.9rem;
              color: #6B7280;
            }
          }
        }

        .place-location {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #6B7280;
          font-size: 0.9rem;
          margin-bottom: 1rem;
          font-weight: 500;

          svg {
            flex-shrink: 0;
            color: #9CA3AF;
          }
        }

        .place-features {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;

          .feature {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.85rem;
            color: #6B7280;
            font-weight: 500;

            svg {
              flex-shrink: 0;
              color: #9CA3AF;
            }
          }
        }
      }
    }

    // Dark mode support
    :host-context(.dark) .place-card {
      background: #1E1E1E;
      border-color: rgba(255, 255, 255, 0.1);

      &:hover {
        border-color: rgba(124, 58, 237, 0.3);
      }

      .card-content {
        .place-name {
          color: white;
        }

        .place-price .price-amount {
          color: white;
        }
      }
    }

    // Responsive design
    @media (max-width: 768px) {
      .place-card {
        .card-image {
          height: 200px;
        }

        .card-content {
          padding: 1.25rem;

          .card-header {
            flex-direction: column;
            gap: 0.5rem;
            align-items: flex-start;

            .place-price {
              text-align: left;
            }
          }

          .place-features {
            gap: 0.75rem;

            .feature {
              font-size: 0.8rem;
            }
          }
        }
      }
    }
  `]
})
export class PlaceCardComponent {
  @Input() place!: PlaceCardData;
  @Output() toggleFavorite = new EventEmitter<number>();

  onToggleFavorite(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.toggleFavorite.emit(this.place.id);
  }

  getBadgeType(badge: string): string {
    const badgeMap: { [key: string]: string } = {
      'Premium': 'premium',
      'Nouveau': 'nouveau',
      'New': 'new',
      'Tendance': 'tendance',
      'Trending': 'trending',
      'Populaire': 'populaire',
      'Popular': 'popular'
    };
    return badgeMap[badge] || 'default';
  }
}