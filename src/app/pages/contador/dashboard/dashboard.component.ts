import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CitaService } from '../../../services/cita.service';
import { NotificationService } from '../../../services/notification.service';
import { Usuario, Cita, DashboardStats } from '../../../models';
import { Observable, forkJoin } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-contador-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class ContadorDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private citaService = inject(CitaService);
  private notificationService = inject(NotificationService);

  currentUser$: Observable<Usuario | null> = this.authService.currentUser$;

  // Dashboard data
  isLoading = true;
  dashboardStats: DashboardStats[] = [];
  citasHoy: Cita[] = [];
  proximasCitas: Cita[] = [];
  citasPendientes: Cita[] = [];

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
      citasHoy: this.citaService.getCitasDelDia(currentUser.id),
      proximasCitas: this.citaService.getProximasCitas(currentUser.id, 10),
      resumenCitas: this.citaService.getResumenCitas(currentUser.id),
      citasPendientes: this.citaService.getCitasPorContador(currentUser.id, { estado: 'pendiente' as any })
    }).pipe(
      catchError(error => {
        this.notificationService.error('Error', 'Error al cargar datos del dashboard');
        console.error('Dashboard error:', error);
        return [];
      })
    ).subscribe(data => {
      this.citasHoy = data.citasHoy || [];
      this.proximasCitas = data.proximasCitas || [];
      this.citasPendientes = data.citasPendientes || [];

      // Crear estadísticas del dashboard
      this.dashboardStats = [
        {
          label: 'Citas Hoy',
          value: this.citasHoy.length,
          icon: 'fas fa-calendar-day',
          color: 'primary'
        },
        {
          label: 'Citas Pendientes',
          value: data.resumenCitas?.pendientes || 0,
          icon: 'fas fa-clock',
          color: 'warning'
        },
        {
          label: 'Citas Esta Semana',
          value: data.resumenCitas?.citasEstaSemana || 0,
          icon: 'fas fa-calendar-week',
          color: 'info'
        },
        {
          label: 'Total Completadas',
          value: data.resumenCitas?.completadas || 0,
          icon: 'fas fa-check-circle',
          color: 'success'
        }
      ];

      this.isLoading = false;
    });
  }

  // Métodos para gestión de citas
  confirmarCita(citaId: number): void {
    this.citaService.confirmarCita(citaId).subscribe({
      next: () => {
        this.notificationService.success('Éxito', 'Cita confirmada correctamente');
        this.loadDashboardData(); // Recargar datos
      },
      error: (error) => {
        this.notificationService.error('Error', 'No se pudo confirmar la cita');
        console.error('Error confirming appointment:', error);
      }
    });
  }

  completarCita(citaId: number): void {
    this.citaService.completarCita(citaId).subscribe({
      next: () => {
        this.notificationService.success('Éxito', 'Cita marcada como completada');
        this.loadDashboardData(); // Recargar datos
      },
      error: (error) => {
        this.notificationService.error('Error', 'No se pudo completar la cita');
        console.error('Error completing appointment:', error);
      }
    });
  }

  // Helpers para el template
  getEstadoCitaClass(estado: string): string {
    const classes: Record<string, string> = {
      'pendiente': 'badge bg-warning text-dark',
      'confirmada': 'badge bg-success',
      'cancelada': 'badge bg-danger',
      'completada': 'badge bg-info'
    };
    return classes[estado] || 'badge bg-secondary';
  }

  formatearFecha(fecha: Date): string {
    return new Date(fecha).toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'short'
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

  getTimeFromNow(fecha: Date, hora: string): string {
    const fechaHora = new Date(`${fecha}T${hora}`);
    const ahora = new Date();
    const diff = fechaHora.getTime() - ahora.getTime();
    const horas = Math.ceil(diff / (1000 * 60 * 60));

    if (horas < 0) {
      return 'Pasada';
    } else if (horas === 0) {
      return 'Ahora';
    } else if (horas === 1) {
      return 'En 1 hora';
    } else {
      return `En ${horas} horas`;
    }
  }
}
