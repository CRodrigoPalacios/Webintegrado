import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pending-appointments',
  templateUrl: './pending-appointments.component.html',
  styleUrls: []
})
export class PendingAppointmentsComponent implements OnInit {
  bookings: any[] = [];
  message: string = '';

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.loadPendingBookings();
  }

  loadPendingBookings(): void {
    this.http.get('/api/bookings/pending').subscribe({
      next: (data: any) => {
        this.bookings = data;
      },
      error: (err) => {
        console.error('Error loading pending bookings:', err);
        this.message = 'Error loading pending bookings. Please ensure you are logged in with appropriate permissions.';
        if (err.status === 401 || err.status === 403) {
          this.router.navigate(['/login']);
        }
      }
    });
  }
}
