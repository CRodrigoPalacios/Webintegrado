import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8080/api/';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(private http: HttpClient) { }

  getAllAppointmentSlots(): Observable<any> {
    return this.http.get(API_URL + 'doctor/slots');
  }

  getActiveAppointmentSlots(): Observable<any> {
    return this.http.get(API_URL + 'doctor/active-slots');
  }

  createAppointmentSlot(appointmentSlot: any): Observable<any> {
    return this.http.post(API_URL + 'doctor/slots', appointmentSlot);
  }

  createBooking(patientId: number, appointmentSlotId: number): Observable<any> {
    return this.http.post(API_URL + `bookings/${patientId}/${appointmentSlotId}`, {});
  }
}
