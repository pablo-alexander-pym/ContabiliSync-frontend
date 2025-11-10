import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TipoUsuario } from '../models';

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  }

  // Si ya está autenticado, redirigir al dashboard correspondiente
  const currentUser = authService.getCurrentUser();
  const dashboardRoute = getDashboardRouteByRole(currentUser?.tipo);
  router.navigate([dashboardRoute]);
  return false;
};

function getDashboardRouteByRole(tipo?: TipoUsuario): string {
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
