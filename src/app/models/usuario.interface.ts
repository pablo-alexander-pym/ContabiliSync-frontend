import { TipoUsuario } from './enums';

/**
 * Interface para Usuario - coincide con el backend
 */
export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  password?: string; // Solo para registro/actualización, no se retorna normalmente
  tipo: TipoUsuario;
  telefono?: string;
  especialidad?: string; // Solo para contadores
  numeroLicencia?: string; // Solo para contadores
}

/**
 * Interface para CrearUsuario (registro)
 */
export interface CrearUsuario {
  nombre: string;
  email: string;
  password: string;
  confirmPassword: string;
  tipo: TipoUsuario;
  telefono?: string;
  especialidad?: string;
  numeroLicencia?: string;
}

/**
 * Interface para ActualizarUsuario
 */
export interface ActualizarUsuario {
  nombre?: string;
  email?: string;
  telefono?: string;
  especialidad?: string;
  numeroLicencia?: string;
}

/**
 * Interface para Login
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Interface para respuesta de autenticación
 */
export interface AuthResponse {
  token: string;
  usuario: Usuario;
  expiresIn?: number;
}
