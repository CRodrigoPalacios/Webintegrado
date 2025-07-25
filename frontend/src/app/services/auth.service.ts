import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const AUTH_API = 'https://webintegrado-production.up.railway.app/api/auth/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<any> {
    return this.http.post(AUTH_API + 'signin', {
      dni: credentials.dni,
      password: credentials.password
    }, httpOptions);
  }

  register(user: any): Observable<any> {
    return this.http.post(AUTH_API + 'signup', {
      email: user.email,
      dni: user.dni,
      password: user.password,
      fullName: user.fullName,
      role: null
    }, httpOptions);
  }

  getUser(): any {
    const user = localStorage.getItem('auth-user');
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }
}
