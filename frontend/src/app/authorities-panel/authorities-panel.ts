import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService, Report, ReportStatus } from '../report';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import * as L from 'leaflet';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, RouterLink],
  templateUrl: './authorities-panel.html',
  styleUrl: './authorities-panel.scss'
})
export class AdminPanelComponent implements OnInit {

  reports: Report[] = [];
  availableStatuses = Object.values(ReportStatus);
  
  statusLabels: { [key: string]: string } = {
    [ReportStatus.NEW]: 'Nowe',
    [ReportStatus.IN_PROGRESS]: 'W trakcie',
    [ReportStatus.CONFIRMED]: 'Potwierdzone',
    [ReportStatus.REJECTED]: 'Odrzucone'
  };

  selectedStatuses: { [key: string]: boolean } = {
    [ReportStatus.NEW]: true,
    [ReportStatus.IN_PROGRESS]: false,
    [ReportStatus.CONFIRMED]: false,
    [ReportStatus.REJECTED]: false
  };

  private map: L.Map | undefined;
  private markersLayer: L.LayerGroup = L.layerGroup();

  constructor(
    private reportService: ReportService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService
  ) {}

  adminLat = 52.2319;
  adminLng = 21.0067; 
  adminRadius = 50000;

  ngOnInit(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.adminLat = position.coords.latitude;
          this.adminLng = position.coords.longitude;
          console.log(`Zlokalizowano administratora: ${this.adminLat}, ${this.adminLng}`);

          if (this.map) {
            this.map.setView([this.adminLat, this.adminLng], 13);
          }
          this.loadAdminReports();
        },
        (error) => {
          console.warn('Brak dostępu do lokalizacji (używam domyślnej):', error);
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
          this.cdr.detectChanges(); 
          this.updateMapMarkers(); 
        },
        error: (err) => console.error(err)
      });
  }

  private updateMapMarkers(): void {
    if (!this.map) return;
    this.markersLayer.clearLayers();

    this.reports.forEach(r => {
      const colorIcon = this.getIconForStatus(r.status);
      
      L.marker([r.latitude, r.longitude], { icon: colorIcon })
        .bindPopup(`<b>${r.description}</b><br>${this.statusLabels[r.status]}`)
        .addTo(this.markersLayer);
    });
  }

  flyToReport(report: Report): void {
    this.map?.flyTo([report.latitude, report.longitude], 16);
  }

  private getIconForStatus(status: string): L.Icon {
    let color = 'blue';
    if (status === 'IN_PROGRESS') color = 'orange';
    if (status === 'CONFIRMED') color = 'green';
    if (status === 'REJECTED') color = 'red';

    return L.icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
    });
  }

  changeStatus(report: Report, newStatus: string): void {
    const oldStatus = report.status;

    // 1. Optymistyczna aktualizacja widoku (natychmiastowa reakcja UI)
    report.status = newStatus as ReportStatus;
    this.cdr.detectChanges();

    // Wywołanie serwisu
    // UWAGA: Upewnij się, że w ReportService metoda nazywa się updateReportStatus (jak w poprzednim kroku) 
    // lub zmień tutaj na this.reportService.updateStatus jeśli tak ją nazwałeś.
    this.reportService.updateStatus(report.id, newStatus as ReportStatus).subscribe({
      next: (updatedReport) => {
        // Potwierdzenie z backendu
        report.status = updatedReport.status; // upewniamy się, że mamy status z bazy
        this.cdr.detectChanges();

        // --- SUKCES (Zielony Toast) ---
        // Używamy statusLabels, żeby wyświetlić ładną nazwę np. "W trakcie" zamiast "IN_PROGRESS"
        this.toastr.success(
          `Status zmieniono na: ${this.statusLabels[newStatus]}`, 
          'Zaktualizowano'
        );
      },
      error: (err) => {
        console.error(err);
        
        // --- BŁĄD (Czerwony Toast) ---
        this.toastr.error(
          'Nie udało się zapisać zmiany statusu.', 
          'Błąd serwera'
        );

        // Cofnij zmianę wizualną w przypadku błędu
        report.status = oldStatus;
        this.cdr.detectChanges();
      }
    });
  }

  getStatusColor(status: string): string {
    switch(status) {
      case ReportStatus.NEW: return '#007bff';
      case ReportStatus.IN_PROGRESS: return '#fd7e14';
      case ReportStatus.CONFIRMED: return '#28a745';
      case ReportStatus.REJECTED: return '#dc3545';
      default: return '#6c757d';
    }
  }
}