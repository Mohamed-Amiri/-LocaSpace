import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-simple-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px;">
      <h1>Test Component Works!</h1>
      <p>If you can see this, the routing is working correctly.</p>
      <p>Current time: {{ currentTime }}</p>
    </div>
  `,
  styles: [`
    div {
      background: #f0f0f0;
      border: 2px solid #007bff;
      border-radius: 8px;
      margin: 20px;
    }
    h1 {
      color: #007bff;
    }
  `]
})
export class SimpleTestComponent {
  currentTime = new Date().toLocaleString();
}