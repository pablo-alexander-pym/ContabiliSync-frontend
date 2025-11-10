import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Usuario, TipoUsuario, TipoUsuarioLabels } from '../../../models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  currentUser$: Observable<Usuario | null> = this.authService.currentUser$;
  isAuthenticated$: Observable<boolean> = this.authService.isAuthenticated$;

  // Enumerar tipos de usuario para usar en template
  TipoUsuario = TipoUsuario;

  logout(): void {
    this.authService.logout();
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }

  getDashboardRoute(user: Usuario | null): string {
    if (!user) return '/login';

    switch (user.tipo) {
      case TipoUsuario.ADMINISTRADOR:
        return '/admin/dashboard';
      case TipoUsuario.CONTADOR:
        return '/contador/dashboard';
      case TipoUsuario.CONTRIBUYENTE:
        return '/contribuyente/dashboard';
      default:
        return '/login';
    }
  }

  getTipoUsuarioLabel(tipo: TipoUsuario): string {
    return TipoUsuarioLabels[tipo];
  }
}
