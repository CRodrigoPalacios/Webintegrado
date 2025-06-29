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
    this.appointmentService.getDoctorAppointmentSlots(this.doctorId).subscribe({
      next: (data) => {
        this.appointmentSlots = data;
      },
      error: (err) => {
        console.error('Error loading appointment slots', err);
      }
    });
  }

  createAppointmentSlot(): void {
    if (!this.doctorId || !this.hospitalId || !this.appointmentTime || !this.totalSlots) {
      this.message = 'Please fill all fields';
      return;
    }
    this.appointmentService.createAppointmentSlot(this.doctorId, this.hospitalId, this.appointmentTime, this.totalSlots).subscribe({
      next: () => {
        this.message = 'Appointment slot created successfully!';
        this.loadAppointmentSlots();
      },
      error: (err) => {
        this.message = 'Error creating appointment slot';
        console.error(err);
      }
    });
  }
}
