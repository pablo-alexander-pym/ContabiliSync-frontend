import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const notificationService = inject(NotificationService);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error) => {
      console.error('HTTP Error:', error);

      let errorMessage = 'Ha ocurrido un error inesperado';
      let errorTitle = 'Error';

      // Manejar diferentes tipos de errores HTTP
      switch (error.status) {
        case 0:
          errorTitle = 'Error de Conexión';
          errorMessage = 'No se pudo conectar con el servidor. Verifique su conexión a internet.';
          break;

        case 400:
          errorTitle = 'Solicitud Inválida';
          errorMessage = error.error?.message || 'Los datos enviados no son válidos.';
          break;

        case 401:
          errorTitle = 'No Autorizado';
          errorMessage = 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.';
          authService.logout();
          break;

        case 403:
          errorTitle = 'Acceso Denegado';
          errorMessage = 'No tiene permisos para realizar esta acción.';
          break;

        case 404:
          errorTitle = 'No Encontrado';
          errorMessage = 'El recurso solicitado no fue encontrado.';
          break;

        case 409:
          errorTitle = 'Conflicto';
          errorMessage = error.error?.message || 'Ya existe un recurso con estos datos.';
          break;

        case 422:
          errorTitle = 'Datos Inválidos';
          errorMessage = error.error?.message || 'Los datos proporcionados no son válidos.';
          break;

        case 429:
          errorTitle = 'Demasiadas Solicitudes';
          errorMessage = 'Ha realizado demasiadas solicitudes. Intente nuevamente más tarde.';
          break;

        case 500:
          errorTitle = 'Error del Servidor';
          errorMessage = 'Error interno del servidor. Intente nuevamente más tarde.';
          break;

        case 502:
          errorTitle = 'Servidor No Disponible';
          errorMessage = 'El servidor no está disponible en este momento.';
          break;

        case 503:
          errorTitle = 'Servicio No Disponible';
          errorMessage = 'El servicio no está disponible temporalmente.';
          break;

        default:
          if (error.error?.message) {
            errorMessage = error.error.message;
          }
          break;
      }

      // Mostrar notificación de error (excepto para 401 que ya maneja AuthService)
      if (error.status !== 401) {
        notificationService.error(errorTitle, errorMessage);
      }

      // Manejar errores específicos de validación
      if (error.error?.errors && Array.isArray(error.error.errors)) {
        error.error.errors.forEach((err: string) => {
          notificationService.error('Error de Validación', err);
        });
      }

      return throwError(() => error);
    })
  );
};
