import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario, LoginRequest, AuthResponse, TipoUsuario, CrearUsuario } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly API_URL = environment.apiUrl; // URL de tu backend
  private readonly TOKEN_KEY = 'contabilisync_token';
  private readonly USER_KEY = 'contabilisync_user';

  private currentUserSubject = new BehaviorSubject<Usuario | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    this.checkTokenExpiration();
  }

  /**
   * Iniciar sesión
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, credentials)
      .pipe(
        tap(authResponse => {
          this.setAuthData(authResponse);
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Registrar nuevo usuario (usa el endpoint de usuarios)
   */
  register(userData: CrearUsuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.API_URL}/usuarios`, userData)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Cerrar sesión
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  /**
   * Obtener token actual
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Obtener usuario actual
   */
  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Verificar si el usuario tiene un rol específico
   */
  hasRole(role: TipoUsuario): boolean {
    const user = this.getCurrentUser();
    return user?.tipo === role;
  }

  /**
   * Verificar si el usuario tiene alguno de los roles especificados
   */
  hasAnyRole(roles: TipoUsuario[]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.includes(user.tipo) : false;
  }

  /**
   * Actualizar perfil del usuario
   */
  updateProfile(userData: Partial<Usuario>): Observable<Usuario> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('Usuario no autenticado'));
    }

    return this.http.put<Usuario>(`${this.API_URL}/usuarios/${currentUser.id}`, userData)
      .pipe(
        tap(updatedUser => {
          localStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser));
          this.currentUserSubject.next(updatedUser);
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Cambiar contraseña
   */
  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('Usuario no autenticado'));
    }

    const passwordData = {
      currentPassword,
      newPassword
    };

    return this.http.put(`${this.API_URL}/usuarios/${currentUser.id}/password`, passwordData)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Métodos privados
   */
  private setAuthData(authResponse: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, authResponse.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(authResponse.usuario));
    this.currentUserSubject.next(authResponse.usuario);
    this.isAuthenticatedSubject.next(true);
  }

  private getUserFromStorage(): Usuario | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  private hasValidToken(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      return Date.now() < exp;
    } catch (error) {
      return false;
    }
  }

  private checkTokenExpiration(): void {
    const token = this.getToken();
    if (token && !this.hasValidToken()) {
      this.logout();
    }
  }

  private handleError = (error: any): Observable<never> => {
    console.error('Error en AuthService:', error);

    if (error.status === 401) {
      this.logout();
    }

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
          errorMessage = 'Credenciales incorrectas';
          break;
        case 403:
          errorMessage = 'Acceso denegado';
          break;
        case 404:
          errorMessage = 'Recurso no encontrado';
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
