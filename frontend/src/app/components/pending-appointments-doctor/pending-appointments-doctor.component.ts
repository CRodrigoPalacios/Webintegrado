import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-pending-appointments-doctor',
  templateUrl: './pending-appointments-doctor.component.html',
  styleUrls: []
})
export class PendingAppointmentsDoctorComponent implements OnInit {
  bookings: any[] = [];
  message: string = '';

  constructor(private bookingService: BookingService) { }

  ngOnInit(): void {
    this.loadPendingBookingsByDoctor();
  }

  loadPendingBookingsByDoctor(): void {
    this.bookingService.getPendingBookingsByDoctor().subscribe({
      next: (data: any) => {
        this.bookings = data;
      },
      error: (err) => {
        this.message = 'Error loading pending bookings by doctor.';
      }
    });
  }
}
