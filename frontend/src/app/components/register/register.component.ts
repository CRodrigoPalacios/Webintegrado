import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
  form: any = {};
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private authService: AuthService, private http: HttpClient) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.form.password !== this.form.confirmPassword) {
      this.errorMessage = "Passwords do not match";
      this.isSignUpFailed = true;
      return;
    }
    this.authService.register(this.form).subscribe(
      data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    );
  }

  validateDni(): void {
    const dni = this.form.dni;
    if (!dni || dni.length !== 8) {
      alert('Por favor ingrese un DNI válido de 8 dígitos');
      return;
    }

    const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImNhcmxvc3JvZHJpZ29wekBob3RtYWlsLmNvbSJ9.x2MxwGOpviPF7XiJVIJF_R9NoIjEFl5bcs8hcZub6zU'; // Replace with your actual API token
    const url = `https://dniruc.apisperu.com/api/v1/dni/${dni}?token=${token}`;

    this.http.get(url).subscribe({
      next: (data: any) => {
        // Assuming the API returns fields: nombres, apellidoPaterno, apellidoMaterno
        this.form.firstName = data.nombres;
        this.form.lastNamePaternal = data.apellidoPaterno;
        this.form.lastNameMaternal = data.apellidoMaterno;
        this.form.fullName = `${data.nombres} ${data.apellidoPaterno} ${data.apellidoMaterno}`;
        
      },
      error: (err) => {
        alert('Error al validar DNI: ' + err.message);
      }
    });
  }
}
