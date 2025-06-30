import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HospitalService } from '../../services/hospital.service';
import { TokenStorageService } from '../../services/token-storage.service';

@Component({
  selector: 'app-hospital-create',
  templateUrl: './hospital-create.component.html',
})
export class HospitalCreateComponent implements OnInit {
  name: string = '';
  address: string = '';
  message: string = '';

  constructor(
    private hospitalService: HospitalService,
    private tokenStorage: TokenStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.tokenStorage.getToken();
    if (!token) {
      this.router.navigate(['/login']);
    }
  }

  createHospital(): void {
    if (!this.name || !this.address) {
      this.message = 'Please fill all fields';
      return;
    }
    this.hospitalService.createHospital({ name: this.name, address: this.address }).subscribe({
      next: () => {
        this.message = 'Hospital created successfully!';
        this.name = '';
        this.address = '';
      },
      error: (err: any) => {
        this.message = 'Error creating hospital';
        console.error(err);
      }
    });
  }
}
