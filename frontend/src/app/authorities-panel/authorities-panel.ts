import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService, Report, ReportStatus } from '../report';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

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

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.loadAdminReports();
  }

  loadAdminReports(): void {
    const activeStatuses = this.availableStatuses
      .filter(status => this.selectedStatuses[status]) as ReportStatus[];

    if (activeStatuses.length === 0) {
      this.reports = [];
      return;
    }

    this.reportService.getAdminReports(52.2319, 21.0067, 20000, activeStatuses)
      .subscribe({
        next: (data) => this.reports = data,
        error: (err) => console.error('Błąd pobierania:', err)
      });
  }

  changeStatus(report: Report, newStatus: string): void {
    this.reportService.updateStatus(report.id, newStatus as ReportStatus).subscribe({
      next: (updated) => {
        report.status = updated.status;
        this.loadAdminReports();
      },
      error: () => alert('Błąd zmiany statusu')
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