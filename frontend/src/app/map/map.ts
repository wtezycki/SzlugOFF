import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';
import { ReportService, ReportRequest, Report } from '../report';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './map.html',
  styleUrl: './map.scss'
})
export class MapComponent implements AfterViewInit {

  private map: L.Map | undefined;
  private markers: L.LayerGroup = L.layerGroup();

  constructor(private reportService: ReportService) {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map').setView([52.2319, 21.0067], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    this.markers.addTo(this.map);

    this.loadReports();


    this.map.on('moveend', () => {
      this.loadReports();
    });

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.addReport(e.latlng.lat, e.latlng.lng);
    });
  }

  private formatDate(isoString: string): string {
    const d = new Date(isoString);
    
    const pad = (n: number) => n.toString().padStart(2, '0');
    
    const day = pad(d.getDate());
    const month = pad(d.getMonth() + 1);
    const year = d.getFullYear();
    const hour = pad(d.getHours());
    const min = pad(d.getMinutes());

    return `${day}-${month}-${year} ${hour}:${min}`;
  }

  private loadReports(): void {
    if (!this.map) return;

    const center = this.map.getCenter();
    const radius = 5000; 

    this.reportService.getReports(center.lat, center.lng, radius).subscribe({
      next: (reports: Report[]) => {
        this.markers.clearLayers();
        reports.forEach((r: Report) => {
          
          const niceDate = this.formatDate(r.createdAt);

          L.marker([r.latitude, r.longitude])
            .bindPopup(`
              <strong>Opis:</strong> ${r.description}<br>
              <strong>Kiedy:</strong> ${niceDate}
            `)
            .addTo(this.markers);
        });
      },
      error: (err: any) => console.error('Błąd pobierania:', err)
    });
  }

  private addReport(lat: number, lon: number): void {
    const desc = prompt("Co tu się dzieje? (Opis zgłoszenia)");
    if (!desc) return;

    const newReport: ReportRequest = {
      latitude: lat,
      longitude: lon,
      description: desc
    };

    this.reportService.createReport(newReport).subscribe({
      next: (savedReport) => {
        alert("Zgłoszenie dodane!");
        this.loadReports();
      },
      error: (err) => {
        console.error('Błąd dodawania:', err);
        alert("Błąd! Sprawdź konsolę (F12).");
      }
    });
  }
}
