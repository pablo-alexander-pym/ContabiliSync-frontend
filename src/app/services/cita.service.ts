import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import {
  Cita,
  CrearCita,
  ActualizarCita,
  EstadoCita,
  FiltrosCita,
  CitaCompleta,
  ResumenCitas,
  DisponibilidadHorario,
  ApiResponse,
  PaginatedResponse,
  PaginationFilters
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = 'https://localhost:7164/api/citas'; // Cambiar por tu URL del backend

  /**
   * Obtener todas las citas
   */
  getCitas(filters?: FiltrosCita & PaginationFilters): Observable<Cita[]> {
    let params = new HttpParams();

    if (filters) {
      if (filters.fechaInicio) params = params.set('fechaInicio', filters.fechaInicio.toISOString());
      if (filters.fechaFin) params = params.set('fechaFin', filters.fechaFin.toISOString());
      if (filters.estado) params = params.set('estado', filters.estado);
      if (filters.contadorId) params = params.set('contadorId', filters.contadorId.toString());
      if (filters.contribuyenteId) params = params.set('contribuyenteId', filters.contribuyenteId.toString());
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.limit) params = params.set('limit', filters.limit.toString());
      if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
      if (filters.sortOrder) params = params.set('sortOrder', filters.sortOrder);
    }

    return this.http.get<ApiResponse<Cita[]>>(this.API_URL, { params })
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Obtener citas paginadas
   */
  getCitasPaginadas(filters: FiltrosCita & PaginationFilters): Observable<PaginatedResponse<Cita>> {
    let params = new HttpParams();

    if (filters.fechaInicio) params = params.set('fechaInicio', filters.fechaInicio.toISOString());
    if (filters.fechaFin) params = params.set('fechaFin', filters.fechaFin.toISOString());
    if (filters.estado) params = params.set('estado', filters.estado);
    if (filters.contadorId) params = params.set('contadorId', filters.contadorId.toString());
    if (filters.contribuyenteId) params = params.set('contribuyenteId', filters.contribuyenteId.toString());
    if (filters.page) params = params.set('page', filters.page.toString());
    if (filters.limit) params = params.set('limit', filters.limit.toString());
    if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params = params.set('sortOrder', filters.sortOrder);

    return this.http.get<ApiResponse<PaginatedResponse<Cita>>>(`${this.API_URL}/paginated`, { params })
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Obtener cita por ID
   */
  getCita(id: number): Observable<CitaCompleta> {
    return this.http.get<ApiResponse<CitaCompleta>>(`${this.API_URL}/${id}`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Obtener citas por contador
   */
  getCitasPorContador(contadorId: number, filters?: FiltrosCita): Observable<Cita[]> {
    let params = new HttpParams();

    if (filters) {
      if (filters.fechaInicio) params = params.set('fechaInicio', filters.fechaInicio.toISOString());
      if (filters.fechaFin) params = params.set('fechaFin', filters.fechaFin.toISOString());
      if (filters.estado) params = params.set('estado', filters.estado);
    }

    return this.http.get<ApiResponse<Cita[]>>(`${this.API_URL}/contador/${contadorId}`, { params })
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Obtener citas por contribuyente
   */
  getCitasPorContribuyente(contribuyenteId: number, filters?: FiltrosCita): Observable<Cita[]> {
    let params = new HttpParams();

    if (filters) {
      if (filters.fechaInicio) params = params.set('fechaInicio', filters.fechaInicio.toISOString());
      if (filters.fechaFin) params = params.set('fechaFin', filters.fechaFin.toISOString());
      if (filters.estado) params = params.set('estado', filters.estado);
    }

    return this.http.get<ApiResponse<Cita[]>>(`${this.API_URL}/contribuyente/${contribuyenteId}`, { params })
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Crear nueva cita
   */
  crearCita(cita: CrearCita): Observable<Cita> {
    return this.http.post<ApiResponse<Cita>>(this.API_URL, cita)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Actualizar cita
   */
  actualizarCita(id: number, cita: ActualizarCita): Observable<Cita> {
    return this.http.put<ApiResponse<Cita>>(`${this.API_URL}/${id}`, cita)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Eliminar cita
   */
  eliminarCita(id: number): Observable<any> {
    return this.http.delete<ApiResponse<any>>(`${this.API_URL}/${id}`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Cambiar estado de la cita
   */
  cambiarEstado(id: number, estado: EstadoCita, notas?: string): Observable<Cita> {
    const data = { estado, notas };
    return this.http.patch<ApiResponse<Cita>>(`${this.API_URL}/${id}/estado`, data)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Confirmar cita
   */
  confirmarCita(id: number, notas?: string): Observable<Cita> {
    return this.cambiarEstado(id, EstadoCita.CONFIRMADA, notas);
  }

  /**
   * Cancelar cita
   */
  cancelarCita(id: number, notas?: string): Observable<Cita> {
    return this.cambiarEstado(id, EstadoCita.CANCELADA, notas);
  }

  /**
   * Completar cita
   */
  completarCita(id: number, notas?: string): Observable<Cita> {
    return this.cambiarEstado(id, EstadoCita.COMPLETADA, notas);
  }

  /**
   * Obtener disponibilidad de horarios para un contador
   */
  getDisponibilidad(contadorId: number, fecha: Date): Observable<DisponibilidadHorario> {
    const params = new HttpParams()
      .set('contadorId', contadorId.toString())
      .set('fecha', fecha.toISOString().split('T')[0]);

    return this.http.get<ApiResponse<DisponibilidadHorario>>(`${this.API_URL}/disponibilidad`, { params })
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Obtener citas del día para un contador
   */
  getCitasDelDia(contadorId: number, fecha?: Date): Observable<Cita[]> {
    const fechaConsulta = fecha || new Date();
    const params = new HttpParams()
      .set('fecha', fechaConsulta.toISOString().split('T')[0]);

    return this.http.get<ApiResponse<Cita[]>>(`${this.API_URL}/contador/${contadorId}/dia`, { params })
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Obtener resumen de citas para dashboard
   */
  getResumenCitas(usuarioId?: number): Observable<ResumenCitas> {
    let params = new HttpParams();
    if (usuarioId) {
      params = params.set('usuarioId', usuarioId.toString());
    }

    return this.http.get<ApiResponse<ResumenCitas>>(`${this.API_URL}/resumen`, { params })
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Obtener próximas citas
   */
  getProximasCitas(usuarioId: number, limite: number = 5): Observable<Cita[]> {
    const params = new HttpParams()
      .set('usuarioId', usuarioId.toString())
      .set('limite', limite.toString());

    return this.http.get<ApiResponse<Cita[]>>(`${this.API_URL}/proximas`, { params })
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Reprogramar cita
   */
  reprogramarCita(id: number, nuevaFecha: Date, nuevaHora: string): Observable<Cita> {
    const data = {
      fecha: nuevaFecha.toISOString().split('T')[0],
      hora: nuevaHora
    };

    return this.http.patch<ApiResponse<Cita>>(`${this.API_URL}/${id}/reprogramar`, data)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Manejo de errores
   */
  private handleError = (error: any): Observable<never> => {
    console.error('Error en CitaService:', error);

    let errorMessage = 'Ha ocurrido un error inesperado';

    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return throwError(() => new Error(errorMessage));
  };
}
