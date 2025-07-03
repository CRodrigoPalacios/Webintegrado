import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DoctorService } from '../../services/doctor.service';

@Component({
  selector: 'app-doctor-registration',
  templateUrl: './doctor-registration.component.html',
  styleUrl: './doctor-registration.component.scss'
})
export class DoctorRegistrationComponent implements OnInit {

  form: any = {
    dni: '',
    email: '',
    password: '',
    fullName: '',
    firstName: '',
    lastNamePaternal: '',
    lastNameMaternal: '',
    specialization: ''
  };

  // Lista de doctores registrados
  doctors: any[] = [];

  // Estados del componente
  message: string = '';
  isError: boolean = false;
  isLoadingDni: boolean = false;
  isDniValidated: boolean = false;

  // Lista de especializaciones
  specializations: string[] = [
    'Cardiología',
    'Neurología',
    'Pediatría',
    'Ginecología',
    'Dermatología',
    'Traumatología',
    'Medicina General',
    'Psiquiatría',
    'Oftalmología',
    'Otorrinolaringología',
    'Urología',
    'Endocrinología',
    'Gastroenterología',
    'Neumología',
    'Reumatología'
  ];

  constructor(
    private doctorService: DoctorService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {

    this.loadDoctors();
  }
  /*
  private checkAuthentication(): void {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      this.showMessage('❌ No está autenticado. Por favor inicie sesión.', true);

    }
  }*/

  loadDoctors(): void {
    this.doctorService.getDoctors().subscribe({
      next: (data) => {
        this.doctors = data;
      },
      error: (err) => {
        console.error('Error loading doctors:', err);
      }
    });
  }


  onDniChange(): void {
    this.isDniValidated = false;


    this.form.firstName = '';
    this.form.lastNamePaternal = '';
    this.form.lastNameMaternal = '';
    this.form.fullName = '';


    if (this.form.dni.length === 8) {
      this.showMessage('DNI ingresado. Haga clic en "Validar DNI" para auto-completar o complete manualmente.', false);
    }
  }


  validateDni(): void {
    const dni = this.form.dni;
    if (!dni || dni.length !== 8) {
      this.showMessage('Por favor ingrese un DNI válido de 8 dígitos', true);
      return;
    }

    this.isLoadingDni = true;
    this.message = '';

    this.doctorService.validateDni(dni).subscribe({
      next: (data: any) => {
        console.log('Respuesta API DNI:', data); // Para debug
        if (data && data.nombres) {
          this.form.firstName = data.nombres;
          this.form.lastNamePaternal = data.apellidoPaterno || '';
          this.form.lastNameMaternal = data.apellidoMaterno || '';
          this.updateFullName();
          this.isDniValidated = true;
          this.showMessage('✅ DNI validado correctamente. Datos completados automáticamente.', false);
        } else {
          this.handleDniValidationError('DNI no encontrado en la base de datos');
        }
        this.isLoadingDni = false;
      },
      error: (err) => {
        console.error('Error validando DNI:', err); // Para debug
        this.isLoadingDni = false;
        this.handleDniValidationError('Error al validar DNI con el servicio externo');
      }
    });
  }


  private handleDniValidationError(message: string): void {
    this.showMessage(
      `⚠️ ${message}. Puede continuar completando los datos manualmente.`,
      false
    );
    this.isDniValidated = false;


    this.message = '💡 Complete los campos manualmente ya que no se pudo validar el DNI automáticamente.';
  }


  updateFullName(): void {
    const firstName = this.form.firstName?.trim() || '';
    const lastNamePaternal = this.form.lastNamePaternal?.trim() || '';
    const lastNameMaternal = this.form.lastNameMaternal?.trim() || '';


    if (firstName || lastNamePaternal || lastNameMaternal) {
      this.form.fullName = `${firstName} ${lastNamePaternal} ${lastNameMaternal}`.trim();
    }
  }


  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }


    this.updateFullName();

    const doctorData = {
      dni: this.form.dni,
      email: this.form.email,
      password: this.form.password,
      fullName: this.form.fullName,
      specialization: this.form.specialization
    };

    this.doctorService.registerDoctor(doctorData).subscribe({
      next: (response) => {
        this.showMessage('✅ Doctor registrado exitosamente', false);
        this.resetForm();
        this.loadDoctors(); // Recargar lista
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'Error al registrar doctor';
        this.showMessage(`❌ ${errorMessage}`, true);
      }
    });
  }


  validateForm(): boolean {
    // Validar DNI
    if (!this.form.dni || this.form.dni.length !== 8) {
      this.showMessage('❌ DNI debe tener 8 dígitos', true);
      return false;
    }

    // Validar email
    if (!this.form.email || !this.isValidEmail(this.form.email)) {
      this.showMessage('❌ Email es requerido y debe ser válido', true);
      return false;
    }

    // Validar contraseña
    if (!this.form.password || this.form.password.length < 6) {
      this.showMessage('❌ Contraseña debe tener al menos 6 caracteres', true);
      return false;
    }

    // Validar nombres
    if (!this.form.firstName?.trim()) {
      this.showMessage('❌ Nombres es requerido', true);
      return false;
    }

    if (!this.form.lastNamePaternal?.trim()) {
      this.showMessage('❌ Apellido paterno es requerido', true);
      return false;
    }

    // Validar especialización
    if (!this.form.specialization) {
      this.showMessage('❌ Especialización es requerida', true);
      return false;
    }

    return true;
  }

  // Validar formato de email
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Mostrar mensajes
  showMessage(message: string, isError: boolean): void {
    this.message = message;
    this.isError = isError;

    // Auto-ocultar mensajes después de 7 segundos
    setTimeout(() => {
      this.message = '';
    }, 7000);
  }

  // Resetear formulario
  resetForm(): void {
    this.form = {
      dni: '',
      email: '',
      password: '',
      fullName: '',
      firstName: '',
      lastNamePaternal: '',
      lastNameMaternal: '',
      specialization: ''
    };
    this.isDniValidated = false;
    this.message = '';
  }

  // Método para limpiar solo los campos de nombres
  clearNameFields(): void {
    this.form.firstName = '';
    this.form.lastNamePaternal = '';
    this.form.lastNameMaternal = '';
    this.form.fullName = '';
    this.isDniValidated = false;
  }
}


































