import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="toast-container"><div *ngFor="let t of toasts" [class]="'toast '+t.type">{{ t.message }}</div></div>`,
  styles:[`.toast-container{position:fixed;top:1rem;right:1rem;display:flex;flex-direction:column;gap:0.5rem;z-index:9999}.toast{padding:0.6rem 1rem;border-radius:4px;color:#fff}.toast.success{background:#22c55e}.toast.error{background:#ef4444}.toast.info{background:#2563EB}`]
})
export class ToastContainerComponent {
  toasts:any[]=[];
  constructor(private ts:ToastService){
    this.ts.toasts$.subscribe(list=>this.toasts=list);
  }
}
