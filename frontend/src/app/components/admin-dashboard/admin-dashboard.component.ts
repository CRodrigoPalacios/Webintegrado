import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent implements OnInit {
  userCounts: any = {};
  pendingAppointmentsCount: number = 0;
  completedAppointmentsCount: number = 0;
  doctors: any[] = [];
  pieChartData: any[] = [];
  message: string = '';

  constructor(private userService: UserService, private bookingService: BookingService) { }

  ngOnInit(): void {
    this.loadUserCounts();
    this.loadAppointmentCounts();
    this.loadDoctors();
  }

  loadUserCounts(): void {
    this.userService.getUserCounts().subscribe({
      next: (data) => {
        this.userCounts = data;
        this.preparePieChartData();
      },
      error: (err) => {
        console.error('Error loading user counts', err);
      }
    });
  }

  loadAppointmentCounts(): void {
    this.bookingService.getPendingBookingsByDoctor().subscribe({
      next: (data) => {
        this.pendingAppointmentsCount = data.length;
      },
      error: (err) => {
        console.error('Error loading pending appointments', err);
      }
    });

    this.bookingService.getCompletedCancelledBookings().subscribe({
      next: (data) => {
        this.completedAppointmentsCount = data.length;
      },
      error: (err) => {
        console.error('Error loading completed appointments', err);
      }
    });
  }

  loadDoctors(): void {
    this.userService.getDoctors().subscribe({
      next: (data) => {
        this.doctors = data;
      },
      error: (err) => {
        console.error('Error loading doctors', err);
      }
    });
  }

  preparePieChartData(): void {
    this.pieChartData = [
      { name: 'Patients', value: this.userCounts.totalPatients || 0 },
      { name: 'Doctors', value: this.userCounts.totalDoctors || 0 },
      { name: 'Admins', value: this.userCounts.totalAdmins || 0 }
    ];
  }

  getColor(index: number): string {
    const colors = ['#4CAF50', '#2196F3', '#FFC107'];
    return colors[index % colors.length];
  }

  getStrokeDashArray(value: number): string {
    const total = this.pieChartData.reduce((sum, item) => sum + item.value, 0);
    const percentage = total === 0 ? 0 : (value / total) * 2 * Math.PI * 100;
    return `${percentage} 628`;
  }

  getStrokeDashOffset(index: number): string {
    const total = this.pieChartData.reduce((sum, item) => sum + item.value, 0);
    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += (this.pieChartData[i].value / total) * 2 * Math.PI * 100;
    }
    return `${628 - offset}`;
  }
}
