import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../services/token-storage.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  username: string | null = null;
  roles: string[] = [];
  showDoctorMenu = false;

  constructor(private tokenStorage: TokenStorageService, private router: Router) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorage.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorage.getUser();
      this.username = user ? user.username : null;
      this.roles = user ? user.roles : [];
      this.showDoctorMenu = this.roles.includes('ROLE_MEDICO');
    }
  }

  logout(): void {
    this.tokenStorage.signOut();
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }

  loginReload(): void {
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }
}
