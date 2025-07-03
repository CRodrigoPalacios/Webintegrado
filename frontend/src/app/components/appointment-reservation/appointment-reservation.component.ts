import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../services/appointment.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-appointment-reservation',
  templateUrl: './appointment-reservation.component.html',
  styleUrls: ['appointment-reservation.component.scss']
})
export class AppointmentReservationComponent implements OnInit {
  appointmentSlots: any[] = [];
  filteredSlots: any[] = [];
  specialties: string[] = [];
  selectedSpecialty: string = '';
  message: string = '';

  constructor(
    private appointmentService: AppointmentService,
    private tokenStorage: TokenStorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadAppointmentSlots();
  }

  loadAppointmentSlots(): void {
    this.appointmentService.getActiveAppointmentSlots().subscribe({
      next: (data: any) => {
        this.appointmentSlots = data;
        this.filteredSlots = data;
        this.extractSpecialties();
      },
      error: (err: any) => {
        console.error('Error loading appointment slots', err);
      }
    });
  }

  extractSpecialties(): void {
    const specialtiesSet = new Set<string>();
    this.appointmentSlots.forEach(slot => {
      if (slot.doctorSpecialization) {
        specialtiesSet.add(slot.doctorSpecialization);
      }
    });
    this.specialties = Array.from(specialtiesSet);
  }

  filterBySpecialty(): void {
    if (!this.selectedSpecialty) {
      this.filteredSlots = this.appointmentSlots;
    } else {
      this.filteredSlots = this.appointmentSlots.filter(slot => slot.doctorSpecialization === this.selectedSpecialty);
    }
  }

  reserveSlot(slot: any): void {
    const user = this.tokenStorage.getUser();
    if (!user) {
      this.message = 'Debe iniciar sesión para reservar una cita.';
      return;
    }
    this.appointmentService.createBooking(user.id, slot.id).subscribe({
      next: (data) => {
        alert('Reserva realizada con éxito. Por favor, verifica tu correo para confirmar la cita.');
        this.message = data.message || 'Reserva realizada con éxito.';
        // Do not navigate to confirmation page automatically
        this.loadAppointmentSlots();
      },
      error: (err) => {
        this.message = 'Error al reservar la cita.';
        console.error(err);
      }
    });
  }
}
