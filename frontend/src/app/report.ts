import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export enum ReportStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  CONFIRMED = 'CONFIRMED',
  REJECTED = 'REJECTED'
}

export interface Report {
  id: string;
  latitude: number;
  longitude: number;
  status: ReportStatus;
  createdAt: string;
  description: string;
}

export interface ReportRequest {
  latitude: number;
  longitude: number;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private apiUrl = 'http://localhost:8080/api/v1/reports';

  constructor(private http: HttpClient) { }

  getReports(lat: number, lon: number, radius: number): Observable<Report[]> {
    const params = new HttpParams()
      .set('latitude', lat)
      .set('longitude', lon)
      .set('radius', radius);

    return this.http.get<Report[]>(this.apiUrl, { params });
  }

  getAdminReports(lat: number, lon: number, radius: number, statuses: ReportStatus[]): Observable<Report[]> {
    let params = new HttpParams()
      .set('latitude', lat)
      .set('longitude', lon)
      .set('radius', radius);

    if (statuses && statuses.length > 0) {
        params = params.set('statuses', statuses.join(','));
    }

    return this.http.get<Report[]>(`${this.apiUrl}/authorities`, { params });
  }


  updateStatus(id: string, newStatus: ReportStatus): Observable<Report> {
    return this.http.patch<Report>(`${this.apiUrl}/${id}/status`, {}, {
      params: { status: newStatus }
    });
  }

  createReport(report: ReportRequest): Observable<Report> {
    return this.http.post<Report>(this.apiUrl, report);
  }
}