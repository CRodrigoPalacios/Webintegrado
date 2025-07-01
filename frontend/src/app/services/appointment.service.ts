import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8080/api/';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(private http: HttpClient) { }

  getActiveAppointmentSlots(): Observable<any> {
    return this.http.get(API_URL + 'doctor/active-slots');
  }

  createBooking(userId: number, appointmentSlotId: number): Observable<any> {
    return this.http.post(API_URL + `bookings/${userId}/${appointmentSlotId}`, null);
  }

  createAppointmentSlot(appointmentSlot: any): Observable<any> {
    return this.http.post(API_URL + 'doctor/slots', appointmentSlot);
  }

  getUserBookings(userId: number): Observable<any> {
    return this.http.get(API_URL + `booking/user/${userId}`);
  }
}
