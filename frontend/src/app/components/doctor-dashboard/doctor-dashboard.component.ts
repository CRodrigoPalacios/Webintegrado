import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../services/appointment.service';
import { HospitalService } from '../../services/hospital.service';
import { TokenStorageService } from '../../services/token-storage.service';

@Component({
  selector: 'app-doctor-dashboard',
  templateUrl: './doctor-dashboard.component.html',
  styleUrls: ['./doctor-dashboard.component.css']
})
export class DoctorDashboardComponent implements OnInit {
  doctorId: number | null = null;
  hospitalId: number | null = null;
  appointmentTime: string = '';
  totalSlots: number | null = null;
  openDuration: number = 1;
  hospitals: any[] = [];
  appointmentSlots: any[] = [];
  bookingsPending: any[] = [];
  bookingsConfirmed: any[] = [];
  message: string = '';

  constructor(
    private appointmentService: AppointmentService,
    private hospitalService: HospitalService,
    private tokenStorage: TokenStorageService
  ) { }

  ngOnInit(): void {
    const user = this.tokenStorage.getUser();
    this.doctorId = user ? user.id : null;
    this.loadHospitals(); // Llama a loadHospitals primero
    if (this.doctorId) {
      this.loadAppointmentSlots();
      this.loadBookings('PENDING_CONFIRMATION');
      this.loadBookings('CONFIRMED');
    }
  }

  loadHospitals(): void {
    this.hospitalService.getHospitals().subscribe({
      next: (data) => {
        this.hospitals = data;
        // --- NUEVA LÓGICA AQUÍ ---
        // Una vez que los hospitales se han cargado, busca y selecciona el Hospital Regional Cayetano Heredia
        const cayetanoHeredia = this.hospitals.find(h => h.name === 'Hospital Regional Cayetano Heredia');
        if (cayetanoHeredia) {
          this.hospitalId = cayetanoHeredia.id;
        }
        // --- FIN DE LA NUEVA LÓGICA ---
      },
      error: (err) => {
        console.error('Error loading hospitals', err);
      }
    });
  }

  loadAppointmentSlots(): void {
    if (!this.doctorId) return;
    this.appointmentService.getActiveAppointmentSlots().subscribe({
      next: (data: any) => {
        this.appointmentSlots = data;
      },
      error: (err: any) => {
        console.error('Error loading appointment slots', err);
      }
    });
  }

  loadBookings(status: string): void {
    this.appointmentService.getDoctorBookings(status).subscribe({
      next: (data) => {
        if (status === 'PENDING_CONFIRMATION') {
          this.bookingsPending = data;
        } else if (status === 'CONFIRMED') {
          this.bookingsConfirmed = data;
        }
      },
      error: (err) => {
        console.error('Error loading bookings', err);
      }
    });
  }

  createAppointmentSlot(): void {
    if (!this.doctorId || !this.hospitalId || !this.appointmentTime || !this.totalSlots) {
      this.message = 'Por favor complete todos los campos';
      return;
    }

    const appointmentSlotDTO = {
      doctorId: this.doctorId,
      hospitalId: this.hospitalId,
      appointmentTime: this.appointmentTime,
      totalSlots: this.totalSlots
    };

    this.appointmentService.createAppointmentSlot(appointmentSlotDTO).subscribe({
      next: (data) => {
        this.message = data.message || 'Cita creada exitosamente';
        this.loadAppointmentSlots();
      },
      error: (err) => {
        this.message = 'Error al crear la cita';
        console.error(err);
      }
    });
  }
}
