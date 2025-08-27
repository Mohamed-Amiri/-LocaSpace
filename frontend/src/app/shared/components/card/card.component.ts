import { Component, Input, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { fadeInUpAnimation } from '../../animations/fade.animation';
import { SkeletonComponent } from '../skeleton/skeleton.component';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, SkeletonComponent],
  animations: [fadeInUpAnimation],
  template: `
    <div 
      class="card" 
      [@fadeInUp]
      [class.card-hover-3d]="enable3dHover"
      [class.card-interactive]="interactive"
      [style.--card-rotation-x]="rotationX + 'deg'"
      [style.--card-rotation-y]="rotationY + 'deg'"
      [style.--card-scale]="scale">
      <div class="card-content">
        <ng-content></ng-content>
      </div>
      <div *ngIf="loading" class="card-skeleton">
        <app-skeleton></app-skeleton>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .card {
      background: white;
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
      overflow: hidden;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      transform-style: preserve-3d;
      
      &.card-interactive:hover {
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
      }
      
      &.card-hover-3d {
        transform: 
          perspective(1000px)
          rotateX(calc(var(--card-rotation-x, 0) * 1deg))
          rotateY(calc(var(--card-rotation-y, 0) * 1deg))
          scale(var(--card-scale, 1));
      }
    }

    .card-content {
      position: relative;
      z-index: 1;
    }

    .card-skeleton {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2;
    }

    :host-context(.dark-theme) .card {
      background: #1f2937;
      
      .card-skeleton {
        background: rgba(31, 41, 55, 0.8);
      }
    }
  `]
})
export class CardComponent {
  @Input() loading = false;
  @Input() enable3dHover = false;
  @Input() interactive = true;

  public rotationX = 0;
  public rotationY = 0;
  public scale = 1;
  private readonly maxRotation = 10;
  private readonly hoverScale = 1.02;

  constructor(private elementRef: ElementRef) {}

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.enable3dHover) return;

    const rect = this.elementRef.nativeElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate rotation based on mouse position relative to card center
    this.rotationX = ((event.clientY - centerY) / (rect.height / 2)) * -this.maxRotation;
    this.rotationY = ((event.clientX - centerX) / (rect.width / 2)) * this.maxRotation;
    this.scale = this.hoverScale;
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    if (!this.enable3dHover) return;

    // Reset card position
    this.rotationX = 0;
    this.rotationY = 0;
    this.scale = 1;
  }
}