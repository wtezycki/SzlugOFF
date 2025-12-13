import { AfterViewInit, Component, ChangeDetectorRef } from '@angular/core';
import * as L from 'leaflet';
import { ReportService, ReportRequest, Report } from '../report';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  templateUrl: './map.html',
  styleUrl: './map.scss'
})
export class MapComponent implements AfterViewInit {

  private map: L.Map | undefined;
  private markers: L.LayerGroup = L.layerGroup();

  public currentCenter: L.LatLng | null = null;

  constructor(
    private reportService: ReportService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
    const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
    const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';
    
    const iconDefault = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = iconDefault;

    this.map = L.map('map').setView([52.2319, 21.0067], 13);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 20,
      attribution: '© OpenStreetMap &copy; CARTO'
    }).addTo(this.map);

    this.markers.addTo(this.map);

    this.loadReports();
    this.currentCenter = this.map.getCenter();
    this.cdr.detectChanges(); 

    this.map.on('move', () => {
      if (this.map) {
        this.currentCenter = this.map.getCenter();
      }
    });

    this.map.on('moveend', () => {
      this.loadReports();
    });
  }

  public reportAtCenter(description: string): void {
    if (!this.map || !description.trim()) {
        alert("Wpisz opis!");
        return;
    }

    const center = this.map.getCenter();

    const newReport: ReportRequest = {
      latitude: center.lat,
      longitude: center.lng,
      description: description
    };

    this.reportService.createReport(newReport).subscribe({
      next: () => {
        alert("Zgłoszono pomyślnie! 🚬");
        this.loadReports();
      },
      error: (err) => {
        console.error(err);
        alert("Błąd serwera!");
      }
    });
  }

  private loadReports(): void {
    if (!this.map) return;
    const center = this.map.getCenter();

    this.reportService.getReports(center.lat, center.lng, 5000).subscribe({
      next: (reports) => {
        this.markers.clearLayers();
        reports.forEach(r => {
            L.marker([r.latitude, r.longitude])
             .bindPopup(`<b>${r.description}</b><br>${new Date(r.createdAt).toLocaleString()}`)
             .addTo(this.markers);
        });
      },
      error: (e) => console.error(e)
    });
  }
}