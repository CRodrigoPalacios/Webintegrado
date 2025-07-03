import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../services/appointment.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { Router } from '@angular/router';


// Importa tus servicios aquí
// import { AppointmentService } from '../services/appointment.service';
// import { TokenStorageService } from '../services/token-storage.service';

@Component({
  selector: 'app-user-appointments',
  templateUrl: './user-appointments.component.html',
  styleUrls: ['./user-appointments.component.scss'] // Cambia a .css si no usas SCSS
})
export class UserAppointmentsComponent implements OnInit {
  upcomingAppointments: any[] = [];
  completedAppointments: any[] = [];
  errorMessage: string = '';

  constructor(
    private appointmentService: AppointmentService,
    private tokenStorage: TokenStorageService,
    private router: Router
  ) { }

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
        this.errorMessage = 'Error al cargar las citas médicas';
        console.error(err);
      }
    });
  }

  // Método para obtener la clase CSS según el estado
  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDING_CONFIRMATION':
        return 'pending';
      case 'CONFIRMED':
        return 'confirmed';
      case 'COMPLETED':
        return 'completed';
      default:
        return 'pending';
    }
  }

  // Método para obtener el texto del estado en español
  getStatusText(status: string): string {
    switch (status) {
      case 'PENDING_CONFIRMATION':
        return 'Pendiente';
      case 'CONFIRMED':
        return 'Confirmada';
      case 'COMPLETED':
        return 'Completada';
      case 'CANCELLED':
        return 'Cancelada';
      default:
        return 'Pendiente';
    }
  }
}
