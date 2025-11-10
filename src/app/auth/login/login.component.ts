import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { TipoUsuario } from '../../models';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.notificationService.success(
            'Bienvenido',
            `¡Hola ${response.usuario.nombre}! Has iniciado sesión correctamente.`
          );

          // Redirigir según el tipo de usuario
          this.redirectByUserType(response.usuario.tipo);
        },
        error: (error) => {
          this.notificationService.error(
            'Error de Autenticación',
            error.message || 'Credenciales inválidas'
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

  private redirectByUserType(tipo: TipoUsuario): void {
    switch (tipo) {
      case TipoUsuario.ADMINISTRADOR:
        this.router.navigate(['/admin/dashboard']);
        break;
      case TipoUsuario.CONTADOR:
        this.router.navigate(['/contador/dashboard']);
        break;
      case TipoUsuario.CONTRIBUYENTE:
        this.router.navigate(['/contribuyente/dashboard']);
        break;
      default:
        this.router.navigate(['/']);
        break;
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  // Getters para facilitar el acceso a los controles en el template
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  // Métodos para validación en template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `El ${fieldName} es requerido`;
      if (field.errors['email']) return 'El email no es válido';
      if (field.errors['minlength']) return `El ${fieldName} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
    }
    return '';
  }
}
