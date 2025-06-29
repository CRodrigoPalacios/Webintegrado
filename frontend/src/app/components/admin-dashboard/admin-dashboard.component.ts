import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent implements OnInit {
  users: any[] = [];
  roles: string[] = ['ROLE_USER', 'ROLE_MEDICO', 'ROLE_ADMIN'];
  message: string = '';

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        console.error('Error loading users', err);
      }
    });
  }

  updateUserRole(user: any, role: string): void {
    this.userService.updateUserRole(user.id, role).subscribe({
      next: () => {
        this.message = 'User role updated successfully!';
        this.loadUsers();
      },
      error: (err) => {
        this.message = 'Error updating user role';
        console.error(err);
      }
    });
  }
}
