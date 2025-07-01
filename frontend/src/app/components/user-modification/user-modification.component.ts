import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-modification',
  templateUrl: './user-modification.component.html',
  styleUrls: []
})
export class UserModificationComponent implements OnInit {
  users: any[] = [];
  filterName: string = '';
  message: string = '';
  selectedUser: any = null;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers(this.filterName).subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        this.message = 'Error loading users';
      }
    });
  }

  filterUsers(): void {
    this.loadUsers();
  }

  selectUser(user: any): void {
    this.selectedUser = { ...user };
    this.message = '';
  }

  onRoleChange(role: string, checked: boolean): void {
    if (!this.selectedUser) return;
    const roles = new Set(this.selectedUser.roles.map((r: any) => r.name));
    if (checked) {
      roles.add(role);
    } else {
      roles.delete(role);
    }
    this.selectedUser.roles = Array.from(roles).map(name => ({ name }));
  }

  onSubmit(): void {
    if (!this.selectedUser) {
      this.message = 'No user selected';
      return;
    }
    this.userService.updateUserRoles(this.selectedUser.id, this.selectedUser.roles.map((r: any) => r.name)).subscribe({
      next: (data) => {
        this.message = 'User updated successfully';
        this.loadUsers();
        this.selectedUser = null;
      },
      error: (err) => {
        this.message = 'Error updating user';
      }
    });
  }

  banUser(user: any, banned: boolean): void {
    this.userService.banUser(user.id, banned).subscribe({
      next: (data) => {
        this.message = 'User ban status updated successfully';
        this.loadUsers();
      },
      error: (err) => {
        this.message = 'Error updating user ban status';
      }
    });
  }
  
  hasRole(role: string): boolean {
    if (!this.selectedUser || !this.selectedUser.roles) return false;
    return this.selectedUser.roles.some((r: any) => r.name === role);
  }
}
