import { Routes } from '@angular/router';
import { MapComponent } from './map/map';
import { AdminPanelComponent } from './authorities-panel/authorities-panel';

export const routes: Routes = [
  { path: '', component: MapComponent },
  { path: 'authorities', component: AdminPanelComponent }
];