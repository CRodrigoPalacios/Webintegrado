import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-completed-cancelled-appointments',
  templateUrl: './completed-cancelled-appointments.component.html',
  styleUrls: []
})
export class CompletedCancelledAppointmentsComponent implements OnInit {
  bookings: any[] = [];
  message: string = '';

  constructor(private bookingService: BookingService) { }

  ngOnInit(): void {
    this.loadCompletedCancelledBookings();
  }

  loadCompletedCancelledBookings(): void {
    this.bookingService.getCompletedCancelledBookings().subscribe({
      next: (data: any) => {
        this.bookings = data;
      },
      error: (err) => {
        this.message = 'Error loading completed and cancelled bookings.';
      }
    });
  }
}
