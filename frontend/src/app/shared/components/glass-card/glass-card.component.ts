import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-glass-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="glass-card" 
      [class.glass-card--hover]="hover"
      [class.glass-card--dark]="dark"
      [ngStyle]="customStyles">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .glass-card {
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 24px;
      padding: 2rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      
      &--hover {
        cursor: pointer;
        
        &:hover {
          transform: translateY(-4px);
          background: rgba(255, 255, 255, 0.25);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }
      }
      
      &--dark {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.1);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        
        &:hover {
          background: rgba(255, 255, 255, 0.15);
        }
      }
    }
  `]
})
export class GlassCardComponent {
  @Input() hover = false;
  @Input() dark = false;
  @Input() customStyles: any = {};
}