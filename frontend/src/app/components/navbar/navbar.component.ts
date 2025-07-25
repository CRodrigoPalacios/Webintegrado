import { Component, OnInit, HostListener } from '@angular/core';
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
  showUserMenu: boolean = false; // Nueva propiedad para el dropdown
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

  // Método para alternar el menú de usuario
  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  // Método para cerrar el menú de usuario
  closeUserMenu(): void {
    this.showUserMenu = false;
  }

  // Listener para cerrar el menú cuando se hace clic fuera
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const userMenuContainer = target.closest('.relative');
    
    if (!userMenuContainer) {
      this.closeUserMenu();
    }
  }

  logout(): void {
    this.tokenStorage.signOut();
    this.isLoggedIn = false;
    this.showAdminBoard = false;
    this.showDoctorBoard = false;
    this.showUserMenu = false; // Cerrar el menú al hacer logout
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