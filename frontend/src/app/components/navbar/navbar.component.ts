import { Component, OnInit } from '@angular/core'; // Importa OnInit
import { TokenStorageService } from '../../services/token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;

  constructor(public tokenStorage: TokenStorageService, private router: Router) { } // tokenStorage se hace público

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorage.getToken();

  }

  logout(): void {
    this.tokenStorage.signOut();
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }
}
