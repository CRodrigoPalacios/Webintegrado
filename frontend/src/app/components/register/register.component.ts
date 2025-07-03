// register.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core'; // Añade OnDestroy
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit, OnDestroy { // Implementa OnDestroy
  form: any = {
    dni: null,
    firstName: null,
    lastNamePaternal: null,
    lastNameMaternal: null,
    email: null,
    password: null,
    confirmPassword: null,
    fullName: null
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  countdown: number = 3; // ¡Nueva propiedad para el contador!
  private countdownInterval: any; // Para almacenar la referencia del intervalo y poder limpiarlo

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  // Método para limpiar el intervalo cuando el componente se destruye
  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  onSubmit(): void {
    if (this.form.password !== this.form.confirmPassword) {
      this.errorMessage = "Las contraseñas no coinciden.";
      this.isSignUpFailed = true;
      return;
    }

    this.authService.register(this.form).subscribe({
      next: data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;

        // Inicia el contador regresivo
        this.countdown = 3; // Reinicia el contador cada vez que el registro es exitoso
        this.countdownInterval = setInterval(() => {
          this.countdown--;
          if (this.countdown === 0) {
            clearInterval(this.countdownInterval); // Detiene el intervalo
            this.router.navigate(['/login']); // Redirige al login
          }
        }, 1000); // Actualiza cada segundo (1000 ms)

      },
      error: err => {
        this.errorMessage = err.error.message || 'Error desconocido en el registro.';
        this.isSignUpFailed = true;
        // Asegúrate de limpiar el intervalo si hay un error y se había iniciado previamente
        if (this.countdownInterval) {
          clearInterval(this.countdownInterval);
        }
      }
    });
  }

  validateDni(): void {
    const dni = this.form.dni;
    if (!dni || dni.length !== 8) {
      alert('Por favor ingrese un DNI válido de 8 dígitos');
      return;
    }

    const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImNhcmxvc3JvZHJpZ29wekBob3RtYWlsLmNvbSJ9.x2MxwGOpviPF7XiJVIJF_R9NoIjEFl5bcs8hcZub6zU';
    const url = `https://dniruc.apisperu.com/api/v1/dni/${dni}?token=${token}`;

    this.http.get(url).subscribe({
      next: (data: any) => {
        this.form.firstName = data.nombres;
        this.form.lastNamePaternal = data.apellidoPaterno;
        this.form.lastNameMaternal = data.apellidoMaterno;
        this.form.fullName = `${data.nombres} ${data.apellidoPaterno} ${data.apellidoMaterno}`;
      },
      error: (err) => {
        alert('Error al validar DNI: ' + (err.error.message || err.message));
        this.form.firstName = null;
        this.form.lastNamePaternal = null;
        this.form.lastNameMaternal = null;
        this.form.fullName = null;
      }
    });
  }
}
