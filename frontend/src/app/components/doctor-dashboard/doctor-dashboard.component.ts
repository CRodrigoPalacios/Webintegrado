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
  message: string = '';

  constructor(
    private appointmentService: AppointmentService,
    private hospitalService: HospitalService,
    private tokenStorage: TokenStorageService
  ) { }

  ngOnInit(): void {
    const user = this.tokenStorage.getUser();
    this.doctorId = user ? user.id : null;
    this.loadHospitals();
    if (this.doctorId) {
      this.loadAppointmentSlots();
    }
  }

  loadHospitals(): void {
    this.hospitalService.getHospitals().subscribe({
      next: (data) => {
        this.hospitals = data;
      },
      error: (err) => {
        console.error('Error loading hospitals', err);
      }
    });
  }

  loadAppointmentSlots(): void {
    if (!this.doctorId) return;
    this.appointmentService.getAllAppointmentSlots().subscribe({
      next: (data: any) => {
        this.appointmentSlots = data;
      },
      error: (err: any) => {
        console.error('Error loading appointment slots', err);
      }
    });
  }

  createAppointmentSlot(): void {
    if (!this.doctorId || !this.hospitalId || !this.appointmentTime || !this.totalSlots || !this.openDuration) {
      this.message = 'Por favor complete todos los campos';
      return;
    }
    this.appointmentService.createAppointmentSlot({
      doctorId: this.doctorId,
      hospitalId: this.hospitalId,
      appointmentTime: this.appointmentTime,
      totalSlots: this.totalSlots,
      openDuration: this.openDuration
    }).subscribe({
      next: () => {
        this.message = '¡Horario de cita creado con éxito!';
        this.loadAppointmentSlots();
      },
      error: (err: any) => {
        this.message = 'Error al crear el horario de cita';
        console.error(err);
      }
    });
  }
}
