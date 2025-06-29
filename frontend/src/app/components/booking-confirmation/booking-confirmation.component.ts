import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-booking-confirmation',
  templateUrl: './booking-confirmation.component.html',
  styleUrls: ['./booking-confirmation.component.css']
})
export class BookingConfirmationComponent implements OnInit {
  message: string = 'Confirming your booking...';
  isError: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.bookingService.confirmBooking(token).subscribe(
          response => {
            this.message = response.message;
            this.isError = false;
          },
          error => {
            this.message = error.error.message || 'Error confirming booking.';
            this.isError = true;
          }
        );
      } else {
        this.message = 'No confirmation token found.';
        this.isError = true;
      }
    });
  }
}
