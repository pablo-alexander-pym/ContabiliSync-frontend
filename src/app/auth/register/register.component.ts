import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { NotificationService } from '../../services/notification.service';
import { TipoUsuario, TipoUsuarioLabels, CrearUsuario } from '../../models';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  registerForm: FormGroup;
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;

  // Tipos de usuario disponibles para registro
  tiposUsuario = [
    { value: TipoUsuario.CONTRIBUYENTE, label: TipoUsuarioLabels[TipoUsuario.CONTRIBUYENTE] },
    { value: TipoUsuario.CONTADOR, label: TipoUsuarioLabels[TipoUsuario.CONTADOR] }
    // Nota: ADMINISTRADOR no está disponible para auto-registro
  ];

  constructor() {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      tipo: [TipoUsuario.CONTRIBUYENTE, [Validators.required]],
      telefono: [''],
      especialidad: [''],
      numeroLicencia: [''],
      terminosAceptados: [false, [Validators.requiredTrue]]
    }, {
      validators: [this.passwordMatchValidator, this.contadorFieldsValidator]
    });

    // Watch for tipo changes to show/hide contador fields
    this.registerForm.get('tipo')?.valueChanges.subscribe(tipo => {
      this.updateContadorFieldsValidation(tipo);
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid && !this.isLoading) {
      this.isLoading = true;

      const formValue = this.registerForm.value;
      const userData: CrearUsuario = {
        nombre: formValue.nombre,
        email: formValue.email,
        password: formValue.password,
        confirmPassword: formValue.confirmPassword,
        tipo: formValue.tipo,
        telefono: formValue.telefono || undefined,
        especialidad: formValue.tipo === TipoUsuario.CONTADOR ? formValue.especialidad : undefined,
        numeroLicencia: formValue.tipo === TipoUsuario.CONTADOR ? formValue.numeroLicencia : undefined
      };

      this.usuarioService.crearUsuario(userData).subscribe({
        next: (usuario) => {
          this.notificationService.success(
            'Registro Exitoso',
            'Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión.'
          );
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.notificationService.error(
            'Error en el Registro',
            error.message || 'No se pudo crear la cuenta. Por favor, intenta nuevamente.'
          );
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  isContador(): boolean {
    return this.registerForm.get('tipo')?.value === TipoUsuario.CONTADOR;
  }

  // Custom Validators
  private passwordMatchValidator(control: AbstractControl): { [key: string]: any } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  private contadorFieldsValidator(control: AbstractControl): { [key: string]: any } | null {
    const tipo = control.get('tipo')?.value;
    const especialidad = control.get('especialidad');
    const numeroLicencia = control.get('numeroLicencia');

    if (tipo === TipoUsuario.CONTADOR) {
      const errors: any = {};

      if (!especialidad?.value) {
        errors.especialidadRequired = true;
      }

      if (!numeroLicencia?.value) {
        errors.licenciaRequired = true;
      }

      return Object.keys(errors).length > 0 ? errors : null;
    }

    return null;
  }

  private updateContadorFieldsValidation(tipo: TipoUsuario): void {
    const especialidadControl = this.registerForm.get('especialidad');
    const licenciaControl = this.registerForm.get('numeroLicencia');

    if (tipo === TipoUsuario.CONTADOR) {
      especialidadControl?.setValidators([Validators.required]);
      licenciaControl?.setValidators([Validators.required]);
    } else {
      especialidadControl?.clearValidators();
      licenciaControl?.clearValidators();
      especialidadControl?.setValue('');
      licenciaControl?.setValue('');
    }

    especialidadControl?.updateValueAndValidity();
    licenciaControl?.updateValueAndValidity();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }

  // Getters for form controls
  get nombre() { return this.registerForm.get('nombre'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
  get tipo() { return this.registerForm.get('tipo'); }
  get telefono() { return this.registerForm.get('telefono'); }
  get especialidad() { return this.registerForm.get('especialidad'); }
  get numeroLicencia() { return this.registerForm.get('numeroLicencia'); }
  get terminosAceptados() { return this.registerForm.get('terminosAceptados'); }

  // Helper methods for template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `El campo ${fieldName} es requerido`;
      if (field.errors['email']) return 'El email no es válido';
      if (field.errors['minlength']) return `Debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['requiredTrue']) return 'Debe aceptar los términos y condiciones';
    }

    // Form-level errors
    const formErrors = this.registerForm.errors;
    if (formErrors) {
      if (formErrors['passwordMismatch'] && fieldName === 'confirmPassword') {
        return 'Las contraseñas no coinciden';
      }
      if (formErrors['especialidadRequired'] && fieldName === 'especialidad') {
        return 'La especialidad es requerida para contadores';
      }
      if (formErrors['licenciaRequired'] && fieldName === 'numeroLicencia') {
        return 'El número de licencia es requerido para contadores';
      }
    }

    return '';
  }
}
