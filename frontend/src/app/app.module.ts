import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
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
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthInterceptor } from './helpers/http.interceptor';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { DoctorRegistrationComponent } from './components/doctor-registration/doctor-registration.component';
import { UserProfileComponent } from './components/User-Profile/UserProfileComponents.component';
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
     UserProfileComponent,
    UserModificationComponent,
    PendingAppointmentsComponent,
    PendingAppointmentsDoctorComponent,
    CompletedCancelledAppointmentsComponent,
    NavbarComponent,
    AdminDashboardComponent,
    DoctorRegistrationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    CommonModule
  ],
  providers: [
    // Register the AuthInterceptor to add JWT token to requests
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
