import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../../services/token-storage.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
})
export class AdminPanelComponent implements OnInit {
  username: string | null = null;
  roles: string[] = [];
  isMedico = false;
  isAdmin = false;

  constructor(private tokenStorage: TokenStorageService) { }

  ngOnInit(): void {
    const user = this.tokenStorage.getUser();
    this.username = user ? user.username : null;
    this.roles = user ? user.roles : [];
    this.isMedico = this.roles.includes('ROLE_MEDICO');
    this.isAdmin = this.roles.includes('ROLE_ADMIN');
  }
}
