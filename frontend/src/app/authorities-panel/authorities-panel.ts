import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService, Report, ReportStatus } from '../report';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import * as L from 'leaflet';
import { ToastrService } from 'ngx-toastr';
import { GeocodingService } from '../geocoding.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, RouterLink],
  templateUrl: './authorities-panel.html',
  styleUrl: './authorities-panel.scss'
})
export class AdminPanelComponent implements OnInit, AfterViewInit {

  reports: Report[] = [];
  availableStatuses = Object.values(ReportStatus);
  
  statusLabels: { [key: string]: string } = {
    [ReportStatus.NEW]: 'Nowe',
    [ReportStatus.IN_PROGRESS]: 'W toku',
    [ReportStatus.CONFIRMED]: 'Zatwierdzone',
    [ReportStatus.REJECTED]: 'Odrzucone'
  };

  selectedStatuses: { [key: string]: boolean } = {
    [ReportStatus.NEW]: true,
    [ReportStatus.IN_PROGRESS]: true,
    [ReportStatus.CONFIRMED]: false,
    [ReportStatus.REJECTED]: false
  };

  private map: L.Map | undefined;
  private markersLayer: L.LayerGroup = L.layerGroup();

  adminLat = 52.2319;
  adminLng = 21.0067; 
  adminRadius = 50000;

  constructor(
    private reportService: ReportService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private geocodingService: GeocodingService
  ) {}

  ngOnInit(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.adminLat = position.coords.latitude;
          this.adminLng = position.coords.longitude;
          if (this.map) {
            this.map.setView([this.adminLat, this.adminLng], 12);
          }
          this.loadAdminReports();
        },
        (error) => {
          console.warn('Lokalizacja niedostępna:', error);
          this.loadAdminReports();
        }
      );
    } else {
      this.loadAdminReports();
    }
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  toggleStatus(status: string): void {
    this.selectedStatuses[status] = !this.selectedStatuses[status];
    this.loadAdminReports();
  }

  private initMap(): void {
    this.map = L.map('admin-map').setView([this.adminLat, this.adminLng], 12);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '© CARTO'
    }).addTo(this.map);

    this.markersLayer.addTo(this.map);
  }

  loadAdminReports(): void {
    const activeStatuses = this.availableStatuses
      .filter(status => this.selectedStatuses[status]) as ReportStatus[];

    if (activeStatuses.length === 0) {
      this.reports = [];
      this.markersLayer.clearLayers();
      this.cdr.detectChanges();
      return;
    }

    this.reportService.getAdminReports(this.adminLat, this.adminLng, this.adminRadius, activeStatuses)
      .subscribe({
        next: (data) => {
          this.reports = data;
          
          // 3. Pętla po wszystkich raportach, żeby pobrać dla nich adresy
          this.reports.forEach(report => {
             // Ustawiamy tekst tymczasowy
             report.address = "Pobieranie adresu...";
             
             this.geocodingService.getAddress(report.latitude, report.longitude)
               .subscribe(address => {
                 report.address = address;
                 this.cdr.detectChanges(); // Odśwież widok jak przyjdzie adres
               });
          });

          this.cdr.detectChanges(); 
          this.updateMapMarkers(); 
        },
        error: (err) => {
          console.error(err);
          this.toastr.error('Nie udało się pobrać listy zgłoszeń.', 'Błąd');
        }
      });
  }

  private updateMapMarkers(): void {
    if (!this.map) return;
    this.markersLayer.clearLayers();

    this.reports.forEach(r => {
      const colorIcon = this.getIconForStatus(r.status);
      
      const marker = L.marker([r.latitude, r.longitude], { icon: colorIcon })
        .bindPopup(`
          <div style="font-family: sans-serif; font-size: 14px;">
            <strong>${r.description}</strong><br>
            <span style="color: #666;">${this.statusLabels[r.status]}</span><br>
            <small>${new Date(r.createdAt).toLocaleString()}</small>
          </div>
        `);
        
      marker.addTo(this.markersLayer);
      
    });
  }

  flyToReport(report: Report): void {
    this.map?.flyTo([report.latitude, report.longitude], 16, {
      duration: 1.5
    });
    
  }

  private getIconForStatus(status: string): L.Icon {
    let colorUrlPart = 'blue';
    
    if (status === 'IN_PROGRESS') colorUrlPart = 'orange';
    if (status === 'CONFIRMED') colorUrlPart = 'green';
    if (status === 'REJECTED') colorUrlPart = 'red';

    return L.icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${colorUrlPart}.png`,
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41], 
      iconAnchor: [12, 41], 
      popupAnchor: [1, -34], 
      shadowSize: [41, 41]
    });
  }

  changeStatus(report: Report, newStatus: string): void {
    const oldStatus = report.status;
    const previousStatusLabel = this.statusLabels[oldStatus];
    const newStatusLabel = this.statusLabels[newStatus];

    report.status = newStatus as ReportStatus;
    this.cdr.detectChanges();

    this.reportService.updateStatus(report.id, newStatus as ReportStatus).subscribe({
      next: (updatedReport) => {
        report.status = updatedReport.status;
        this.updateMapMarkers();
        this.cdr.detectChanges();
        
        this.toastr.success(
          `Status zmieniony: ${previousStatusLabel} -> ${newStatusLabel}`,
          'Aktualizacja pomyślna'
        );
      },
      error: () => {
        report.status = oldStatus;
        this.updateMapMarkers();
        this.cdr.detectChanges();
        this.toastr.error('Wystąpił błąd podczas zmiany statusu.', 'Błąd');
      }
    });
  }
}