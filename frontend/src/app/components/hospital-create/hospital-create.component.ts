import { Component } from '@angular/core';
import { HospitalService } from '../../services/hospital.service';

@Component({
  selector: 'app-hospital-create',
  templateUrl: './hospital-create.component.html',
})
export class HospitalCreateComponent {
  name: string = '';
  address: string = '';
  message: string = '';

  constructor(private hospitalService: HospitalService) {}

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
