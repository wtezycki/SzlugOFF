import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Report {
  id: string;
  latitude: number;
  longitude: number;
  status: string;
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

  createReport(report: ReportRequest): Observable<Report> {
    return this.http.post<Report>(this.apiUrl, report);
  }
}
