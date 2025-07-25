import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
 templateUrl: './UserProfileComponents.component.html',
  styleUrls: ['./UserProfileComponents.component.css'] 
})
export class UserProfileComponent implements OnInit {
  user: any = {};
  message: string = '';
  errorMessage: string = '';
  isLoading: boolean = true;

  constructor(
    private userService: UserService,
    private tokenStorage: TokenStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Verificar si está logueado
    if (!this.tokenStorage.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    // Obtener datos del usuario desde el token storage
    this.user = this.tokenStorage.getUser();
    
    // Si tenemos el ID del usuario, obtener datos actualizados del servidor
    if (this.user && this.user.id) {
      this.loadUserProfile();
    } else {
      this.isLoading = false;
      this.errorMessage = 'No se pudo cargar la información del usuario';
    }
  }

  loadUserProfile(): void {
    this.userService.getUserById(this.user.id).subscribe({
      next: (userData) => {
        // Combinar datos del token con datos del servidor
        this.user = {
          ...this.user,
          ...userData
        };
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading user profile:', err);
        this.errorMessage = 'Error al cargar el perfil del usuario';
        this.isLoading = false;
        // Si falla, usar los datos del token storage
        this.user = this.tokenStorage.getUser();
      }
    });
  }

  getUserRoles(): string {
    if (!this.user || !this.user.roles) {
      return 'Usuario';
    }

    // Si roles es un array de objetos con name
    if (Array.isArray(this.user.roles) && this.user.roles.length > 0) {
      return this.user.roles.map((role: any) => {
        if (typeof role === 'object' && role.name) {
          return this.formatRoleName(role.name);
        } else if (typeof role === 'string') {
          return this.formatRoleName(role);
        }
        return role;
      }).join(', ');
    }

    // Si roles es un array de strings
    if (Array.isArray(this.user.roles)) {
      return this.user.roles.map((role: string) => this.formatRoleName(role)).join(', ');
    }

    return 'Usuario';
  }

  formatRoleName(roleName: string): string {
    // Remover el prefijo ROLE_ si existe y formatear
    const cleanRole = roleName.replace('ROLE_', '');
    switch (cleanRole) {
      case 'ADMIN':
        return 'Administrador';
      case 'MEDICO':
        return 'Médico';
      case 'USER':
        return 'Paciente';
      default:
        return cleanRole;
    }
  }

  goBack(): void {
    // Navegar según el rol del usuario
    const roles = this.user.roles || [];
    const roleNames = roles.map((role: any) => 
      typeof role === 'object' ? role.name : role
    );

    if (roleNames.includes('ROLE_ADMIN')) {
      this.router.navigate(['/admin-dashboard']);
    } else if (roleNames.includes('ROLE_MEDICO')) {
      this.router.navigate(['/doctor-dashboard']);
    } else {
      this.router.navigate(['/patient-dashboard']);
    }
  }

  getUserStatusText(): string {
    if (this.user.banned) {
      return 'Cuenta Suspendida';
    }
    return 'Cuenta Activa';
  }

  getUserStatusClass(): string {
    return this.user.banned ? 'status-banned' : 'status-active';
  }

  hasSpecialization(): boolean {
    return this.user.specialization && this.user.specialization.trim() !== '';
  }

  getAccountCreationDate(): string {
    // Si tienes fecha de creación en el usuario, usarla
    // Por ahora retorna un mensaje genérico
    return 'Información no disponible';
  }
}