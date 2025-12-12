import { Component } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
import { MapComponent } from './map/map';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MapComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
  title = 'frontend';
}
