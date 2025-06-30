import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../services/appointment.service';
import { AuthService } from '../../services/auth.service';

interface Appointment {
  id: number;
  appointmentTime: string;
  doctorName: string;
  doctorSpecialization: string;
  hospitalName: string;
  availableSlots: number;
  status?: string;
}

@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.component.html',
  // Removed styleUrls to fix missing stylesheet error
  // styleUrls: ['./patient-dashboard.component.css']
})
export class PatientDashboardComponent implements OnInit {
  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  specializations: string[] = [];
  selectedSpecialization: string = '';
  message: string = '';

  bookedAppointments: Appointment[] = [];

  constructor(private appointmentService: AppointmentService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadAppointments();
    this.loadBookedAppointments();
  }

  loadAppointments(): void {
    this.appointmentService.getActiveAppointmentSlots().subscribe({
      next: (data: any) => {
        this.appointments = data.map((slot: any) => ({
          id: slot.id,
          appointmentTime: slot.appointmentTime,
          doctorName: slot.doctorName,
          doctorSpecialization: slot.doctorSpecialization,
          hospitalName: slot.hospitalName || 'N/A',
          availableSlots: slot.availableSlots
        }));
        this.filteredAppointments = this.appointments;
        this.specializations = [...new Set(this.appointments.map(a => a.doctorSpecialization))];
      },
      error: (err: any) => {
        this.message = 'Error loading appointments.';
        console.error(err);
      }
    });
  }

  loadBookedAppointments(): void {
    const user = this.authService.getUser();
    if (!user) {
      this.message = 'You must be logged in to view booked appointments.';
      return;
    }
    this.appointmentService.getUserBookings(user.id).subscribe({
      next: (data: any) => {
        this.bookedAppointments = data.map((booking: any) => ({
          id: booking.id,
          appointmentTime: booking.appointmentSlot.appointmentTime,
          doctorName: booking.appointmentSlot.doctorName,
          doctorSpecialization: booking.appointmentSlot.doctorSpecialization,
          hospitalName: booking.appointmentSlot.hospitalName,
          availableSlots: 0,
          status: booking.status
        }));
      },
      error: (err: any) => {
        this.message = 'Error loading booked appointments.';
        console.error(err);
      }
    });
  }

  filterBySpecialization(): void {
    if (!this.selectedSpecialization) {
      this.filteredAppointments = this.appointments;
    } else {
      this.filteredAppointments = this.appointments.filter(a => a.doctorSpecialization === this.selectedSpecialization);
    }
  }

  bookAppointment(appointmentId: number): void {
    const user = this.authService.getUser();
    if (!user) {
      this.message = 'You must be logged in to book an appointment.';
      return;
    }
    this.appointmentService.createBooking(user.id, appointmentId).subscribe({
      next: () => {
        this.message = 'Appointment booked successfully!';
        this.loadAppointments();
        this.loadBookedAppointments();
      },
      error: (err: any) => {
        this.message = err.error.message || 'Error booking appointment.';
        console.error(err);
      }
    });
  }
}
