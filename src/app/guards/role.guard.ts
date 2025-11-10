import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TipoUsuario } from '../models';

export const roleGuard = (allowedRoles: TipoUsuario[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
      router.navigate(['/login']);
      return false;
    }

    const currentUser = authService.getCurrentUser();
    if (!currentUser || !allowedRoles.includes(currentUser.tipo)) {
      // Redirigir a página de acceso denegado o dashboard según el rol
      const redirectRoute = getRedirectRouteByRole(currentUser?.tipo);
      router.navigate([redirectRoute]);
      return false;
    }

    return true;
  };
};

function getRedirectRouteByRole(tipo?: TipoUsuario): string {
  switch (tipo) {
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
