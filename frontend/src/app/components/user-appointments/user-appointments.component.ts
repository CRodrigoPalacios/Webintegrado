import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../services/appointment.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-appointments',
  templateUrl: './user-appointments.component.html',
  styleUrls: []
})
export class UserAppointmentsComponent implements OnInit {
  upcomingAppointments: any[] = [];
  completedAppointments: any[] = [];
  errorMessage: string = '';

  constructor(private appointmentService: AppointmentService, private tokenStorage: TokenStorageService, private router: Router) { }

  ngOnInit(): void {
    if (!this.tokenStorage.getToken()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadAppointments('PENDING_CONFIRMATION');
    this.loadAppointments('CONFIRMED');
  }

  loadAppointments(status: string): void {
    this.appointmentService.getUserBookings(status).subscribe({
      next: (data) => {
        if (status === 'PENDING_CONFIRMATION') {
          this.upcomingAppointments = data;
        } else if (status === 'CONFIRMED') {
          this.completedAppointments = data;
        }
      },
      error: (err) => {
        this.errorMessage = 'Error loading appointments';
        console.error(err);
      }
    });
  }
}
