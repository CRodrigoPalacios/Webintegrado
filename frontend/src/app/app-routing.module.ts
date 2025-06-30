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

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin-panel', component: AdminPanelComponent, canActivate: [AuthGuard], data: { roles: ['MEDICO', 'ADMIN'] }, children: [
      { path: 'crear-citas', component: DoctorDashboardComponent },
      { path: 'agregar-hospitales', component: HospitalCreateComponent },
      // Other child routes for admin panel sections can be added here
    ] },
  { path: 'patient', component: PatientDashboardComponent, canActivate: [AuthGuard] },
  { path: 'confirm-appointment', component: BookingConfirmationComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }