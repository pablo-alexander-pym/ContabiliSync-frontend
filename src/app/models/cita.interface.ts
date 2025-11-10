import { EstadoCita } from './enums';
import { Usuario } from './usuario.interface';

/**
 * Interface para Cita
 */
export interface Cita {
  id: number;
  contadorId: number;
  contribuyenteId: number;
  fecha: Date;
  hora: string;
  estado: EstadoCita;
  notas?: string;
  tipoConsulta?: string;
  descripcion?: string;
  contador?: Usuario;
  contribuyente?: Usuario;
  usuario?: Usuario; // Para compatibilidad con templates existentes
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
}

/**
 * Interface para crear una nueva cita
 */
export interface CrearCita {
  contadorId: number;
  contribuyenteId: number;
  fecha: Date | string;
  hora: string;
  notas?: string;
}

/**
 * Interface para actualizar una cita
 */
export interface ActualizarCita {
  fecha?: Date | string;
  hora?: string;
  estado?: EstadoCita;
  notas?: string;
}

/**
 * Interface para disponibilidad de horarios
 */
export interface DisponibilidadHorario {
  fecha: Date;
  horasDisponibles: string[];
}

/**
 * Interface para filtros de citas
 */
export interface FiltrosCita {
  fechaInicio?: Date;
  fechaFin?: Date;
  estado?: EstadoCita;
  contadorId?: number;
  contribuyenteId?: number;
}

/**
 * Interface para resumen de citas (dashboard)
 */
export interface ResumenCitas {
  total: number;
  pendientes: number;
  confirmadas: number;
  completadas: number;
  canceladas: number;
  citasHoy: number;
  citasEstaSemana: number;
}

/**
 * Interface para cita con detalles completos
 */
export interface CitaCompleta extends Cita {
  contador: Usuario;
  contribuyente: Usuario;
  documentosRelacionados?: any[]; // Si necesitas mostrar documentos relacionados
}
