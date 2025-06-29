import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8080/api/';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(private http: HttpClient) { }

  createAppointmentSlot(doctorId: number, hospitalId: number, appointmentTime: string, totalSlots: number): Observable<any> {
    return this.http.post(API_URL + 'doctor/slots', {
      doctorId,
      hospitalId,
      appointmentTime,
      totalSlots
    });
  }

  getDoctorAppointmentSlots(doctorId: number): Observable<any> {
    return this.http.get(API_URL + `doctor/slots/${doctorId}`);
  }

  getAllAppointmentSlots(): Observable<any> {
    return this.http.get(API_URL + 'appointments');
  }
}
