import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { DoctorDashboardComponent } from './components/doctor-dashboard/doctor-dashboard.component';
import { PatientDashboardComponent } from './components/patient-dashboard/patient-dashboard.component';
import { BookingConfirmationComponent } from './components/booking-confirmation/booking-confirmation.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { HospitalCreateComponent } from './components/hospital-create/hospital-create.component';
import { ActiveAppointmentsComponent } from './components/active-appointments/active-appointments.component';
import { AppointmentReservationComponent } from './components/appointment-reservation/appointment-reservation.component';

import { authInterceptorProviders } from './helpers/http.interceptor';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    DoctorDashboardComponent,
    PatientDashboardComponent,
    BookingConfirmationComponent,
    NavbarComponent,
    AdminPanelComponent,
    HospitalCreateComponent,
    ActiveAppointmentsComponent,
    AppointmentReservationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    RouterModule
  ],
  providers: [authInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
