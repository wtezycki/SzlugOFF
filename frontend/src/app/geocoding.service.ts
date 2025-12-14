import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {

  private apiUrl = 'https://nominatim.openstreetmap.org/reverse';

  constructor(private http: HttpClient) {}

  getAddress(lat: number, lng: number): Observable<string> {
    const url = `${this.apiUrl}?format=jsonv2&lat=${lat}&lon=${lng}`;
    
    return this.http.get<any>(url).pipe(
      map(response => {
        const a = response.address;
        if (!a) return 'Nieznany adres';
        
        const street = a.road || a.pedestrian || a.suburb || '';
        const number = a.house_number || '';
        const city = a.city || a.town || a.village || '';
        
        return `${street} ${number}, ${city}`.trim().replace(/^,/, '').trim();
      }),
      catchError(() => of('Błąd pobierania adresu'))
    );
  }
}