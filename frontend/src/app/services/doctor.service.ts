import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { TokenStorageService } from './token-storage.service';

const API_URL = 'http://localhost:8080/api/auth/';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorageService
  ) { }

  // Método para obtener headers con token CORREGIDO
  private getAuthHeaders(): HttpHeaders {
    const token = this.tokenStorage.getToken();

    // 🔥 VALIDACIÓN CRÍTICA: Verificar si el token existe
    if (!token) {
      throw new Error('No authentication token found');
    }

    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Método para verificar si está autenticado
  isAuthenticated(): boolean {
    const token = this.tokenStorage.getToken();
    return token !== null && token !== undefined && token !== '';
  }

  registerDoctor(doctorData: any): Observable<any> {
    // Verificar autenticación antes de hacer la petición
    if (!this.isAuthenticated()) {
      return throwError(() => new Error('No está autenticado'));
    }

    try {
      const httpOptions = {
        headers: this.getAuthHeaders()
      };

      return this.http.post(API_URL + 'register-doctor', doctorData, httpOptions);
    } catch (error) {
      return throwError(() => error);
    }
  }

  // Obtener todos los doctores CON autenticación
  getDoctors(): Observable<any> {
    // Verificar autenticación antes de hacer la petición
    if (!this.isAuthenticated()) {
      return throwError(() => new Error('No está autenticado'));
    }

    try {
      const httpOptions = {
        headers: this.getAuthHeaders()
      };

      return this.http.get('http://localhost:8080/api/users/doctors', httpOptions);
    } catch (error) {
      return throwError(() => error);
    }
  }

  // Validar DNI con API externa (SIN autenticación porque es API externa)
  validateDni(dni: string): Observable<any> {
    const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImNhcmxvc3JvZHJpZ29wekBob3RtYWlsLmNvbSJ9.x2MxwGOpviPF7XiJVIJF_R9NoIjEFl5bcs8hcZub6zU';
    const url = `https://dniruc.apisperu.com/api/v1/dni/${dni}?token=${token}`;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.get(url, httpOptions);
  }
}
