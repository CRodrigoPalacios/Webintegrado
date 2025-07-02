import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-booking-confirmation',
  templateUrl: './booking-confirmation.component.html',
  styleUrls: ['./booking-confirmation.component.css']
})
export class BookingConfirmationComponent implements OnInit {
  token: string | null = null;
  message: string = '';

  constructor(private route: ActivatedRoute, private router: Router, private bookingService: BookingService) { }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      this.router.navigate(['/']);
      return;
    }
    this.bookingService.confirmBooking(this.token).subscribe({
      next: (res) => {
        this.message = 'Su cita ha sido confirmada exitosamente.';
      },
      error: (err) => {
        this.message = 'Error al confirmar la cita: ' + (err.error?.message || err.message);
      }
    });
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }
}
