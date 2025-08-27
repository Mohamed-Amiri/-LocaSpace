import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-template-description',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="template-description" *ngIf="showDescription">
      <div class="description-badge">
        <span class="badge-icon">📝</span>
        <span>{{ description }}</span>
      </div>
    </div>
  `,
  styles: [`
    .template-description {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 9999;
      
      .description-badge {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        font-size: 0.8rem;
        backdrop-filter: blur(10px);
        
        .badge-icon {
          font-size: 1rem;
        }
      }
    }
    
    @media (max-width: 768px) {
      .template-description {
        display: none;
      }
    }
  `]
})
export class TemplateDescriptionComponent {
  @Input() description = '';
  
  get showDescription(): boolean {
    return this.description.length > 0 && !this.isProduction();
  }
  
  private isProduction(): boolean {
    return window.location.hostname !== 'localhost';
  }
}