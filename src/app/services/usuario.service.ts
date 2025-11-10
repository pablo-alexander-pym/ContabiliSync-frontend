import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import {
  Usuario,
  CrearUsuario,
  ActualizarUsuario,
  TipoUsuario,
  ApiResponse,
  PaginatedResponse,
  PaginationFilters
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = 'https://localhost:7164/api/usuarios'; // Cambiar por tu URL del backend

  /**
   * Obtener todos los usuarios
   */
  getUsuarios(filters?: PaginationFilters): Observable<Usuario[]> {
    let params = new HttpParams();

    if (filters) {
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.limit) params = params.set('limit', filters.limit.toString());
      if (filters.search) params = params.set('search', filters.search);
      if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
      if (filters.sortOrder) params = params.set('sortOrder', filters.sortOrder);
    }

    return this.http.get<ApiResponse<Usuario[]>>(this.API_URL, { params })
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Obtener usuarios paginados
   */
  getUsuariosPaginados(filters: PaginationFilters): Observable<PaginatedResponse<Usuario>> {
    let params = new HttpParams();

    if (filters.page) params = params.set('page', filters.page.toString());
    if (filters.limit) params = params.set('limit', filters.limit.toString());
    if (filters.search) params = params.set('search', filters.search);
    if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params = params.set('sortOrder', filters.sortOrder);

    return this.http.get<ApiResponse<PaginatedResponse<Usuario>>>(`${this.API_URL}/paginated`, { params })
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Obtener usuario por ID
   */
  getUsuario(id: number): Observable<Usuario> {
    return this.http.get<ApiResponse<Usuario>>(`${this.API_URL}/${id}`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Obtener contadores disponibles
   */
  getContadores(): Observable<Usuario[]> {
    return this.http.get<ApiResponse<Usuario[]>>(`${this.API_URL}/contadores`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Obtener usuarios por tipo
   */
  getUsuariosPorTipo(tipo: TipoUsuario): Observable<Usuario[]> {
    return this.http.get<ApiResponse<Usuario[]>>(`${this.API_URL}/portipo/${tipo}`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Crear nuevo usuario
   */
  crearUsuario(usuario: CrearUsuario): Observable<Usuario> {
    return this.http.post<ApiResponse<Usuario>>(this.API_URL, usuario)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Actualizar usuario
   */
  actualizarUsuario(id: number, usuario: ActualizarUsuario): Observable<Usuario> {
    return this.http.put<ApiResponse<Usuario>>(`${this.API_URL}/${id}`, usuario)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Eliminar usuario
   */
  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete<ApiResponse<any>>(`${this.API_URL}/${id}`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Activar/Desactivar usuario
   */
  toggleUsuarioEstado(id: number): Observable<Usuario> {
    return this.http.patch<ApiResponse<Usuario>>(`${this.API_URL}/${id}/toggle-estado`, {})
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Buscar usuarios
   */
  buscarUsuarios(termino: string, tipo?: TipoUsuario): Observable<Usuario[]> {
    let params = new HttpParams().set('search', termino);
    if (tipo) {
      params = params.set('tipo', tipo);
    }

    return this.http.get<ApiResponse<Usuario[]>>(`${this.API_URL}/buscar`, { params })
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Obtener estadísticas de usuarios
   */
  getEstadisticasUsuarios(): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${this.API_URL}/estadisticas`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Validar disponibilidad de email
   */
  validarEmail(email: string, excludeId?: number): Observable<boolean> {
    let params = new HttpParams().set('email', email);
    if (excludeId) {
      params = params.set('excludeId', excludeId.toString());
    }

    return this.http.get<ApiResponse<boolean>>(`${this.API_URL}/validar-email`, { params })
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Manejo de errores
   */
  private handleError = (error: any): Observable<never> => {
    console.error('Error en UsuarioService:', error);

    let errorMessage = 'Ha ocurrido un error inesperado';

    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return throwError(() => new Error(errorMessage));
  };
}
