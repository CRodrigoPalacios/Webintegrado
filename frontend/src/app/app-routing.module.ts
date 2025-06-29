import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DoctorDashboardComponent } from './components/doctor-dashboard/doctor-dashboard.component';
import { PatientDashboardComponent } from './components/patient-dashboard/patient-dashboard.component';
import { BookingConfirmationComponent } from './components/booking-confirmation/booking-confirmation.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'doctor', component: DoctorDashboardComponent, canActivate: [AuthGuard], data: { roles: ['MEDICO', 'ADMIN'] } },
  { path: 'patient', component: PatientDashboardComponent, canActivate: [AuthGuard] },
  { path: 'confirm-appointment', component: BookingConfirmationComponent },
  { path: 'admin', loadChildren: () => import('./components/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent), canActivate: [AuthGuard], data: { roles: ['ADMIN'] } },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }