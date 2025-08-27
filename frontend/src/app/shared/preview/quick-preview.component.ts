import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Lieu } from '../../lieux/lieu.model';

@Component({
  selector: 'app-quick-preview',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './quick-preview.component.html',
  styleUrls: ['./quick-preview.component.scss']
})
export class QuickPreviewComponent {
  @Input() location!: Lieu;
  @Output() close = new EventEmitter<void>();

  onBackdrop(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('preview-backdrop')) {
      this.close.emit();
    }
  }
}
