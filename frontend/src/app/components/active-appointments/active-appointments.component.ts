import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../services/appointment.service';
import { AuthService } from '../../services/auth.service';

interface ActiveAppointmentSlot {
  id: number;
  appointmentTime: string;
  totalSlots: number;
  availableSlots: number;
  doctorName: string;
  doctorSpecialization: string;
}

@Component({
  selector: 'app-active-appointments',
  templateUrl: './active-appointments.component.html',
})
export class ActiveAppointmentsComponent implements OnInit {
  activeSlots: ActiveAppointmentSlot[] = [];
  message: string = '';

  constructor(private appointmentService: AppointmentService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadActiveSlots();
  }

  loadActiveSlots(): void {
    this.appointmentService.getActiveAppointmentSlots().subscribe({
      next: (data) => {
        this.activeSlots = data;
      },
      error: (err) => {
        this.message = 'Error loading active appointments.';
        console.error(err);
      }
    });
  }

  bookAppointment(slotId: number): void {
    const user = this.authService.getUser();
    if (!user) {
      this.message = 'You must be logged in to book an appointment.';
      return;
    }
    this.appointmentService.createBooking(user.id, slotId).subscribe({
      next: (res) => {
        this.message = 'Booking created successfully! Please check your email to confirm.';
        this.loadActiveSlots(); // Refresh slots
      },
      error: (err) => {
        this.message = err.error.message || 'Error creating booking.';
        console.error(err);
      }
    });
  }
}
