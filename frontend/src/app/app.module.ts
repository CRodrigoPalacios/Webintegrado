import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DoctorDashboardComponent } from './components/doctor-dashboard/doctor-dashboard.component';
import { PatientDashboardComponent } from './components/patient-dashboard/patient-dashboard.component';
import { BookingConfirmationComponent } from './components/booking-confirmation/booking-confirmation.component';
import { HospitalCreateComponent } from './components/hospital-create/hospital-create.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { AppointmentReservationComponent } from './components/appointment-reservation/appointment-reservation.component';
import { UserAppointmentsComponent } from './components/user-appointments/user-appointments.component';
import { UserModificationComponent } from './components/user-modification/user-modification.component';
import { PendingAppointmentsComponent } from './components/pending-appointments/pending-appointments.component';
import { PendingAppointmentsDoctorComponent } from './components/pending-appointments-doctor/pending-appointments-doctor.component';
import { CompletedCancelledAppointmentsComponent } from './components/completed-cancelled-appointments/completed-cancelled-appointments.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    DoctorDashboardComponent,
    PatientDashboardComponent,
    BookingConfirmationComponent,
    HospitalCreateComponent,
    AdminPanelComponent,
    AppointmentReservationComponent,
    UserAppointmentsComponent,
    UserModificationComponent,
    PendingAppointmentsComponent,
    PendingAppointmentsDoctorComponent,
    CompletedCancelledAppointmentsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
