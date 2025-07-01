import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-completed-cancelled-appointments',
  templateUrl: './completed-cancelled-appointments.component.html',
  styleUrls: []
})
export class CompletedCancelledAppointmentsComponent implements OnInit {
  bookings: any[] = [];
  message: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadCompletedCancelledBookings();
  }

  loadCompletedCancelledBookings(): void {
    this.http.get('/api/bookings/completed-cancelled').subscribe({
      next: (data: any) => {
        this.bookings = data;
      },
      error: (err) => {
        this.message = 'Error loading completed and cancelled bookings.';
      }
    });
  }
}
