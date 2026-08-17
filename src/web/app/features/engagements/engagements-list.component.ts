import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lsd-engagements-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h1>Engagements</h1>
      <p>{{ message() }}</p>
    </div>
  `,
  styles: [],
})
export class EngagementsListComponent {
  message = signal('Welcome to Lake Shore Drive');
}
