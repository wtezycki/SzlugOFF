import { AfterViewInit, Component, ChangeDetectorRef } from '@angular/core';
import * as L from 'leaflet';
import { ReportService, ReportRequest, Report } from '../report';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [HttpClientModule, CommonModule, RouterLink],
  templateUrl: './map.html',
  styleUrl: './map.scss'
})
export class MapComponent implements AfterViewInit {

  statusTranslations: { [key: string]: string } = {
    'NEW': 'Nowe',
    'IN_PROGRESS': 'W trakcie weryfikacji',
    'CONFIRMED': 'Potwierdzone',
    'REJECTED': 'Odrzucone'
  };

  private map: L.Map | undefined;
  private markers: L.LayerGroup = L.layerGroup();
  
  public currentCenter: L.LatLng | null = null;

  constructor(
    private reportService: ReportService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService
  ) {}

  ngAfterViewInit(): void {
    this.tryToLocateAndInit();
  }

  private tryToLocateAndInit(): void {
    const defaultLat = 52.2319;
    const defaultLng = 21.0067;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Lokalizacja pobrana, startuję mapę.");
          this.initMap(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.warn("Brak lokalizacji:", error.message);
          this.toastr.info("Nie udało się pobrać lokalizacji");
          this.initMap(defaultLat, defaultLng);
        }
      );
    } else {
      this.initMap(defaultLat, defaultLng);
    }
  }

  private initMap(lat: number, lng: number): void {

    const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
    const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
    const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';
    
    L.Marker.prototype.options.icon = L.icon({
      iconRetinaUrl, iconUrl, shadowUrl,
      iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], tooltipAnchor: [16, -28], shadowSize: [41, 41]
    });

    this.map = L.map('map').setView([lat, lng], 15);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 20,
      attribution: '© OpenStreetMap &copy; CARTO'
    }).addTo(this.map);

    this.markers.addTo(this.map);
    
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

    this.loadReports();
  }

  private getIconForStatus(status: string): L.Icon {
    let color = 'blue';

    switch (status) {
      case 'IN_PROGRESS':
        color = 'orange';
        break;
      case 'CONFIRMED':
        color = 'green';
        break;
      case 'REJECTED':
        color = 'red';
        break;
    }

    return L.icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  }

  

  private locateUser(): void {
    if (!navigator.geolocation) {
      console.log("Przeglądarka nie wspiera geolokalizacji");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        console.log(`Znaleziono użytkownika: ${lat}, ${lng}`);

        this.map?.flyTo([lat, lng], 13);
        
      },
      (error) => {
        console.warn("Brak zgody na lokalizację lub błąd:", error.message);
      }
    );
  }


  public reportAtCenter(description: string): void {
    if (!this.map || !description.trim()) {
        this.toastr.warning("Musisz wpisać opis zdarzenia.", "Brak opisu");
        return;
    }
    const center = this.map.getCenter();
    const newReport: ReportRequest = {
      latitude: center.lat, longitude: center.lng, description: description
    };

    this.reportService.createReport(newReport).subscribe({
      next: () => {
        this.toastr.success("Zgłoszono pomyślnie.", "Sukces");
        this.loadReports();
      },
      error: (err) => { console.error(err); this.toastr.error("Nie udało się wysłać zgłoszenia.", "Błąd serwera"); }
    });
  }

  private loadReports(): void {
    if (!this.map) return;
    const center = this.map.getCenter();
    
    this.reportService.getReports(center.lat, center.lng, 5000).subscribe({
      next: (reports) => {
        this.markers.clearLayers();
        reports.forEach(r => {
            const customIcon = this.getIconForStatus(r.status);
            
            const polishStatus = this.statusTranslations[r.status] || r.status;

            L.marker([r.latitude, r.longitude], { icon: customIcon })
             .bindPopup(`
                <div style="text-align: center;">
                  <b>${r.description}</b><br>
                  <span style="color: gray; font-size: 0.8em;">${new Date(r.createdAt).toLocaleString()}</span><br>
                  <strong style="color: #333;">${polishStatus}</strong>
                </div>
             `)
             .addTo(this.markers);
        });
      },
      error: (e) => console.error(e)
    });
  }
}