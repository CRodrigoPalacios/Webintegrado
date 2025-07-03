import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../../services/token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  showAdminBoard: boolean = false; // Nueva bandera para el admin
  username?: string; // Para mostrar el nombre de usuario
  roles: string[] = []; // Para almacenar los roles del usuario

  constructor(public tokenStorage: TokenStorageService, private router: Router) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorage.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorage.getUser(); // Asume que getUser() devuelve el objeto de usuario
      if (user && user.roles) { // Asegúrate de que 'user' y 'user.roles' existan
        this.roles = user.roles;
        this.showAdminBoard = this.roles.includes('ROLE_ADMIN'); // Verifica si tiene el rol de ADMIN
        // Si quieres mostrar un nombre, asume que 'user' tiene una propiedad 'username' o 'fullName'
        const fullName = user.fullName || user.username || user.email;
        this.username = this.getShortName(fullName);
      }
    }
  }

  logout(): void {
    this.tokenStorage.signOut();
    this.isLoggedIn = false;
    this.showAdminBoard = false; // Restablecer la bandera de admin al cerrar sesión
    this.username = undefined; // Limpiar el nombre de usuario
    this.roles = []; // Limpiar los roles
    this.router.navigate(['/login']);
  }
  private getShortName(fullName: string): string {
    const parts = fullName.trim().split(/\s+/);
    const firstName = parts[0] || '';
 
    const firstSurname = parts.length > 1 ? parts[parts.length - 2] : '';
    return `${firstName}${firstSurname ? ' ' + firstSurname : ''}`;
  }
}
