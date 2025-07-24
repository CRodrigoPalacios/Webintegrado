import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'https://webintegrado-production.up.railway.app/api/bookings/';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private http: HttpClient) { }

  createBooking(patientId: number, appointmentSlotId: number): Observable<any> {
    return this.http.post(API_URL + `${patientId}/${appointmentSlotId}`, {});
  }

  confirmBooking(token: string): Observable<any> {
    return this.http.get(API_URL + `confirm?token=${token}`);
  }

  getPendingBookingsByDoctor(): Observable<any> {
    return this.http.get(API_URL + 'pending-by-doctor');
  }

  getCompletedCancelledBookings(): Observable<any> {
    return this.http.get(API_URL + 'completed-cancelled');
  }
}
