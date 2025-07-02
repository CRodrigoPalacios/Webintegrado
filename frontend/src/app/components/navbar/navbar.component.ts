import { Component } from '@angular/core';
import { TokenStorageService } from '../../services/token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  constructor(private tokenStorage: TokenStorageService, private router: Router) {}

  logout(): void {
    this.tokenStorage.signOut();
    this.router.navigate(['/login']);
  }
}
