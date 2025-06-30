import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8080/api/';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor(private http: HttpClient) { }

  getHospitals(): Observable<any> {
    return this.http.get(API_URL + 'hospitals');
  }

  createHospital(hospital: { name: string; address: string }): Observable<any> {
    return this.http.post(API_URL + 'hospitals', hospital);
  }
}
