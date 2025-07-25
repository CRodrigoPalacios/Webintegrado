import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'https://webintegrado-production.up.railway.app/api/';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUsers(filterName?: string): Observable<any> {
    let params = new HttpParams();
    if (filterName) {
      params = params.set('name', filterName);
    }
    return this.http.get(API_URL + 'users', { params });
  }
getUserById(userId: number): Observable<any> {
  return this.http.get(API_URL + 'users/' + userId);
}
  getUserCounts(): Observable<any> {
    return this.http.get(API_URL + 'users/counts');
  }

  getDoctors(): Observable<any> {
    return this.http.get(API_URL + 'users/doctors');
  }

  updateUserRoles(userId: number, roles: string[]): Observable<any> {
    return this.http.put(API_URL + 'users/' + userId + '/roles', roles);
  }

  banUser(userId: number, banned: boolean): Observable<any> {
    return this.http.put(API_URL + 'users/' + userId + '/ban', banned);
  }
}
