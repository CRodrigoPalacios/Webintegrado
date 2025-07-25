import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DoctorDashboardComponent } from './components/doctor-dashboard/doctor-dashboard.component';
import { PatientDashboardComponent } from './components/patient-dashboard/patient-dashboard.component';
import { BookingConfirmationComponent } from './components/booking-confirmation/booking-confirmation.component';
import { AuthGuard } from './guards/auth.guard';
import { HospitalCreateComponent } from './components/hospital-create/hospital-create.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { AppointmentReservationComponent } from './components/appointment-reservation/appointment-reservation.component';
import { UserAppointmentsComponent } from './components/user-appointments/user-appointments.component';
import { UserModificationComponent } from './components/user-modification/user-modification.component';
import { PendingAppointmentsComponent } from './components/pending-appointments/pending-appointments.component';
import { PendingAppointmentsDoctorComponent } from './components/pending-appointments-doctor/pending-appointments-doctor.component';
import { CompletedCancelledAppointmentsComponent } from './components/completed-cancelled-appointments/completed-cancelled-appointments.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import {DoctorRegistrationComponent} from "./components/doctor-registration/doctor-registration.component";
import { UserProfileComponent } from './components/User-Profile/UserProfileComponents.component';
const routes: Routes = [
  { path: '', component: HomeComponent },
{ path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
   { 
    path: 'profile', 
    component: UserProfileComponent,
    canActivate: [AuthGuard] // Si tienes guard de autenticación
  },
  { path: 'register', component: RegisterComponent },
  { path: 'admin-panel', component: AdminPanelComponent, canActivate: [AuthGuard], data: { roles: ['MEDICO', 'ADMIN'] }, children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'crear-citas', component: DoctorDashboardComponent },
      { path: 'agregar-hospitales', component: HospitalCreateComponent },
      { path: 'modificar-usuarios', component: UserModificationComponent },
      { path: 'citas-pendientes', component: PendingAppointmentsComponent },
      { path: 'citas-pendientes-doctor', component: PendingAppointmentsDoctorComponent },
      { path: 'citas-completadas', component: CompletedCancelledAppointmentsComponent },
      { path: 'registrar-doctores', component: DoctorRegistrationComponent },
      // Other child routes for admin panel sections can be added here
    ] },
  { path: 'appointment-reservation', component: AppointmentReservationComponent, canActivate: [AuthGuard] },
  { path: 'user-appointments', component: UserAppointmentsComponent, canActivate: [AuthGuard] },
  { path: 'confirm-appointment', component: BookingConfirmationComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
