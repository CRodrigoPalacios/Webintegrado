import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-pending-appointments-doctor',
  templateUrl: './pending-appointments-doctor.component.html',
  styleUrls: []
})
export class PendingAppointmentsDoctorComponent implements OnInit {
  bookings: any[] = [];
  message: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadPendingBookingsByDoctor();
  }

  loadPendingBookingsByDoctor(): void {
    this.http.get('/api/bookings/pending-by-doctor').subscribe({
      next: (data: any) => {
        this.bookings = data;
      },
      error: (err) => {
        this.message = 'Error loading pending bookings by doctor.';
      }
    });
  }
}
