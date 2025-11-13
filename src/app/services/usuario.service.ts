import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import {
  Usuario,
  CrearUsuario,
  ActualizarUsuario,
  TipoUsuario
} from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/usuarios`; // URL de tu backend

  /**
   * Obtener todos los usuarios - GET /api/usuarios
   */
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.API_URL)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Obtener usuario por ID - GET /api/usuarios/{id}
   */
  getUsuario(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.API_URL}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Obtener contadores disponibles - GET /api/usuarios/contadores
   */
  getContadores(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.API_URL}/contadores`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Obtener usuarios por tipo - GET /api/usuarios/portipo/{tipo}
   */
  getUsuariosPorTipo(tipo: TipoUsuario): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.API_URL}/portipo/${tipo}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Crear nuevo usuario - POST /api/usuarios
   */
  crearUsuario(usuario: CrearUsuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.API_URL, usuario)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Actualizar usuario - PUT /api/usuarios/{id}
   */
  actualizarUsuario(id: number, usuario: ActualizarUsuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.API_URL}/${id}`, usuario)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Eliminar usuario - DELETE /api/usuarios/{id}
   */
  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Buscar usuarios por email (útil para validaciones)
   */
  buscarPorEmail(email: string): Observable<Usuario[]> {
    let params = new HttpParams().set('email', email);
    return this.http.get<Usuario[]>(`${this.API_URL}`, { params })
      .pipe(
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
    } else if (error.status) {
      switch (error.status) {
        case 400:
          errorMessage = 'Datos inválidos';
          break;
        case 401:
          errorMessage = 'No autorizado';
          break;
        case 404:
          errorMessage = 'Usuario no encontrado';
          break;
        case 409:
          errorMessage = 'El email ya está registrado';
          break;
        case 500:
          errorMessage = 'Error interno del servidor';
          break;
      }
    }

    return throwError(() => new Error(errorMessage));
  };
}
