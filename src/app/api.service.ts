import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://127.0.0.1:8080'; // Replace with your Spring Boot API base URL

  constructor(public http: HttpClient) { }

  getAdminData(): Observable<any> {
    return this.http.get(`${this.baseUrl}/system-property/entry-point`);
  }

  getUserData(): Observable<any> {
    return this.http.get(`${this.baseUrl}/system-property/entry-point`);
  }

  searchData(query: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/search?query=${query}`);
  }

  submitDataTimeIn(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/parking-slot/time-in`, data);
  }

  submitDataTimeOut(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/parking-slot/time-out`, data);
  }

  getDropdownEntryPoints(): Observable<any> {
    return this.http.get(`${this.baseUrl}/system-property/entry-point`);
  }
  dropdownParkingSlot(): Observable<any> {
    return this.http.get(`${this.baseUrl}/parking-slot/parked-slot`);
  }
}
