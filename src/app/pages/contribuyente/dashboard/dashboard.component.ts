import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CitaService } from '../../../services/cita.service';
import { DocumentoService } from '../../../services/documento.service';
import { NotificationService } from '../../../services/notification.service';
import { Usuario, Cita, ResumenDocumentos, DashboardStats } from '../../../models';
import { Observable, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-contribuyente-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class ContribuyenteDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private citaService = inject(CitaService);
  private documentoService = inject(DocumentoService);
  private notificationService = inject(NotificationService);

  currentUser$: Observable<Usuario | null> = this.authService.currentUser$;

  // Dashboard data
  isLoading = true;
  dashboardStats: DashboardStats[] = [];
  proximasCitas: Cita[] = [];
  resumenDocumentos?: ResumenDocumentos;

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.notificationService.error('Error', 'No se pudo obtener la información del usuario');
      return;
    }

    this.isLoading = true;

    // Cargar datos del dashboard en paralelo
    forkJoin({
      proximasCitas: this.citaService.getProximasCitas(currentUser.id, 5),
      resumenCitas: this.citaService.getResumenCitas(currentUser.id),
      resumenDocumentos: this.documentoService.getResumenDocumentos(currentUser.id)
    }).pipe(
      catchError(error => {
        this.notificationService.error('Error', 'Error al cargar datos del dashboard');
        console.error('Dashboard error:', error);
        return [];
      })
    ).subscribe(data => {
      this.proximasCitas = data.proximasCitas || [];
      this.resumenDocumentos = data.resumenDocumentos;

      // Crear estadísticas del dashboard
      this.dashboardStats = [
        {
          label: 'Documentos Totales',
          value: data.resumenDocumentos?.total || 0,
          icon: 'fas fa-file-alt',
          color: 'primary',
          change: 2,
          changeType: 'increase'
        },
        {
          label: 'Citas Pendientes',
          value: data.resumenCitas?.pendientes || 0,
          icon: 'fas fa-clock',
          color: 'warning',
          change: 1,
          changeType: 'increase'
        },
        {
          label: 'Citas Este Mes',
          value: data.resumenCitas?.citasEstaSemana || 0,
          icon: 'fas fa-calendar',
          color: 'success'
        },
        {
          label: 'Citas Completadas',
          value: data.resumenCitas?.completadas || 0,
          icon: 'fas fa-check-circle',
          color: 'info'
        }
      ];

      this.isLoading = false;
    });
  }

  // Métodos para acciones rápidas
  navegarADocumentos(): void {
    // La navegación se maneja por routerLink
  }

  navegarACitas(): void {
    // La navegación se maneja por routerLink
  }

  agendarNuevaCita(): void {
    // La navegación se maneja por routerLink
  }

  // Helpers para el template
  getEstadoCitaClass(estado: string): string {
    const classes: Record<string, string> = {
      'pendiente': 'badge bg-warning',
      'confirmada': 'badge bg-success',
      'cancelada': 'badge bg-danger',
      'completada': 'badge bg-info'
    };
    return classes[estado] || 'badge bg-secondary';
  }

  formatearFecha(fecha: Date): string {
    return new Date(fecha).toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
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

  getChangeIcon(changeType?: string): string {
    return changeType === 'increase' ? 'fas fa-arrow-up' : 'fas fa-arrow-down';
  }

  getChangeClass(changeType?: string): string {
    return changeType === 'increase' ? 'text-success' : 'text-danger';
  }
}
