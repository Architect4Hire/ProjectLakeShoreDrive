import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'lsd-app',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
  styles: [],
})
export class AppComponent {}
