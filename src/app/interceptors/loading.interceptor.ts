import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  // Mostrar loading
  loadingService.show();

  return next(req).pipe(
    finalize(() => {
      // Ocultar loading cuando termine la petición
      loadingService.hide();
    })
  );
};
