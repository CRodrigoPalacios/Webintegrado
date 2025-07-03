import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../../services/token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  showAdminBoard: boolean = false;
  showDoctorBoard: boolean = false;
  username?: string;
  roles: string[] = [];

  constructor(public tokenStorage: TokenStorageService, private router: Router) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorage.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorage.getUser();
      if (user && user.roles) {
        this.roles = user.roles;
        this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
        this.showDoctorBoard = this.roles.includes('ROLE_MEDICO');

        const fullName = user.fullName || user.username || user.email;
        this.username = this.getShortName(fullName);
      }
    }
  }

  logout(): void {
    this.tokenStorage.signOut();
    this.isLoggedIn = false;
    this.showAdminBoard = false;
    this.showDoctorBoard = false;
    this.username = undefined;
    this.roles = [];
    this.router.navigate(['/login']);
  }

  private getShortName(fullName: string): string {
    const parts = fullName.trim().split(/\s+/);
    const firstName = parts[0] || '';

    const firstSurname = parts.length > 1 ? parts[parts.length - 2] : '';
    return `${firstName}${firstSurname ? ' ' + firstSurname : ''}`;
  }
}
