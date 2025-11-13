import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UsuarioService } from '../../../services/usuario.service';
import { CitaService } from '../../../services/cita.service';
import { DocumentoService } from '../../../services/documento.service';
import { NotificationService } from '../../../services/notification.service';
import { Usuario, Cita, Documento, DashboardStats } from '../../../models';
import { Observable, forkJoin } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);
  private citaService = inject(CitaService);
  private documentoService = inject(DocumentoService);
  private notificationService = inject(NotificationService);

  currentUser$: Observable<Usuario | null> = this.authService.currentUser$;

  // Dashboard data
  isLoading = true;
  dashboardStats: DashboardStats[] = [];
  usuariosRecientes: Usuario[] = [];
  citasRecientes: Cita[] = [];
  documentosRecientes: Documento[] = [];
  sistemStats = {
    totalUsuarios: 0,
    totalContadores: 0,
    totalContribuyentes: 0,
    totalCitas: 0,
    citasHoy: 0,
    documentosSubidos: 0,
    usuariosActivos: 0
  };

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.isLoading = true;

    // Cargar datos del dashboard en paralelo
    forkJoin({
      usuarios: this.usuarioService.getUsuarios(),
      citas: this.citaService.getCitas(),
      documentos: this.documentoService.getDocumentos(),
      estadisticasGenerales: this.getEstadisticasGenerales()
    }).pipe(
      catchError(error => {
        this.notificationService.error('Error', 'Error al cargar datos del dashboard');
        console.error('Admin dashboard error:', error);
        return [];
      })
    ).subscribe(data => {
      this.procesarDatos(data);
      this.isLoading = false;
    });
  }

  private procesarDatos(data: any): void {
    const usuarios = data.usuarios || [];
    const citas = data.citas || [];
    const documentos = data.documentos || [];

    // Procesar usuarios - sin fechaCreacion, usar orden por ID
    this.usuariosRecientes = usuarios
      .sort((a: Usuario, b: Usuario) => b.id - a.id)
      .slice(0, 5);

    // Procesar citas
    this.citasRecientes = citas
      .sort((a: Cita, b: Cita) => new Date(b.fechaCreacion!).getTime() - new Date(a.fechaCreacion!).getTime())
      .slice(0, 5);

    // Procesar documentos
    this.documentosRecientes = documentos
      .sort((a: Documento, b: Documento) => new Date(b.fechaCarga).getTime() - new Date(a.fechaCarga).getTime())
      .slice(0, 5);

    // Calcular estadísticas del sistema
    this.sistemStats = {
      totalUsuarios: usuarios.length,
      totalContadores: usuarios.filter((u: Usuario) => u.tipo === 'contador').length,
      totalContribuyentes: usuarios.filter((u: Usuario) => u.tipo === 'contribuyente').length,
      totalCitas: citas.length,
      citasHoy: citas.filter((c: Cita) => this.esFechaHoy(c.fecha)).length,
      documentosSubidos: documentos.length,
      usuariosActivos: usuarios.length // Todos los usuarios se consideran activos
    };

    // Crear estadísticas del dashboard
    this.dashboardStats = [
      {
        label: 'Total Usuarios',
        value: this.sistemStats.totalUsuarios,
        icon: 'fas fa-users',
        color: 'primary'
      },
      {
        label: 'Citas Hoy',
        value: this.sistemStats.citasHoy,
        icon: 'fas fa-calendar-day',
        color: 'success'
      },
      {
        label: 'Documentos Subidos',
        value: this.sistemStats.documentosSubidos,
        icon: 'fas fa-file-upload',
        color: 'info'
      },
      {
        label: 'Usuarios Activos',
        value: this.sistemStats.usuariosActivos,
        icon: 'fas fa-user-check',
        color: 'warning'
      }
    ];
  }

  private getEstadisticasGenerales(): Observable<any> {
    // Aquí podrías hacer una llamada específica para estadísticas generales
    // Por ahora retornamos un observable vacío
    return new Observable(observer => {
      observer.next({});
      observer.complete();
    });
  }

  private esFechaHoy(fecha: Date): boolean {
    const hoy = new Date();
    const fechaCita = new Date(fecha);
    return hoy.toDateString() === fechaCita.toDateString();
  }

  private esUsuarioActivo(usuario: Usuario): boolean {
    // Como no tenemos fechaCreacion, consideramos que todos los usuarios están activos
    return true;
  }

  // Métodos para gestión de usuarios - simplificados sin el campo activo
  activarUsuario(usuarioId: number): void {
    // Como no tenemos campo activo en el modelo, solo mostramos mensaje
    this.notificationService.info('Info', 'Función de activación no disponible en esta versión');
  }

  desactivarUsuario(usuarioId: number): void {
    // Como no tenemos campo activo en el modelo, solo mostramos mensaje
    this.notificationService.info('Info', 'Función de desactivación no disponible en esta versión');
  }

  // Helpers para el template
  getRolClass(tipo: string): string {
    const classes: Record<string, string> = {
      'administrador': 'badge bg-danger',
      'contador': 'badge bg-primary',
      'contribuyente': 'badge bg-success'
    };
    return classes[tipo] || 'badge bg-secondary';
  }

  getEstadoCitaClass(estado: string): string {
    const classes: Record<string, string> = {
      'pendiente': 'badge bg-warning text-dark',
      'confirmada': 'badge bg-success',
      'cancelada': 'badge bg-danger',
      'completada': 'badge bg-info'
    };
    return classes[estado] || 'badge bg-secondary';
  }

  getTipoDocumentoClass(tipo: string): string {
    const classes: Record<string, string> = {
      'declaracion_renta': 'badge bg-primary',
      'balance_general': 'badge bg-success',
      'estado_resultados': 'badge bg-info',
      'otro': 'badge bg-secondary'
    };
    return classes[tipo] || 'badge bg-secondary';
  }

  formatearFecha(fecha: Date): string {
    return new Date(fecha).toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  formatearFechaCompleta(fecha: Date): string {
    return new Date(fecha).toLocaleDateString('es-CO', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  formatearTamano(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getColorClass(color: string): string {
    const colorMap: Record<string, string> = {
      'primary': 'text-primary',
      'success': 'text-success',
      'warning': 'text-warning',
      'info': 'text-info',
      'danger': 'text-danger'
    };
    return colorMap[color] || 'text-primary';
  }

  getCurrentDate(): Date {
    return new Date();
  }
}
