import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Usuario, TipoUsuario, MenuItem } from '../../../models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input() collapsed = false;

  private authService = inject(AuthService);

  currentUser$: Observable<Usuario | null> = this.authService.currentUser$;
  TipoUsuario = TipoUsuario;

  getMenuItems(user: Usuario | null): MenuItem[] {
    if (!user) return [];

    switch (user.tipo) {
      case TipoUsuario.CONTRIBUYENTE:
        return this.getContribuyenteMenu();
      case TipoUsuario.CONTADOR:
        return this.getContadorMenu();
      case TipoUsuario.ADMINISTRADOR:
        return this.getAdministradorMenu();
      default:
        return [];
    }
  }

  private getContribuyenteMenu(): MenuItem[] {
    return [
      {
        label: 'Dashboard',
        icon: 'fas fa-tachometer-alt',
        route: '/contribuyente/dashboard'
      },
      {
        label: 'Mis Documentos',
        icon: 'fas fa-file-alt',
        route: '/contribuyente/documentos'
      },
      {
        label: 'Mis Citas',
        icon: 'fas fa-calendar-alt',
        route: '/contribuyente/citas'
      },
      {
        label: 'Agendar Cita',
        icon: 'fas fa-plus-circle',
        route: '/contribuyente/agendar'
      },
      {
        label: 'Mi Perfil',
        icon: 'fas fa-user',
        route: '/contribuyente/perfil'
      }
    ];
  }

  private getContadorMenu(): MenuItem[] {
    return [
      {
        label: 'Dashboard',
        icon: 'fas fa-tachometer-alt',
        route: '/contador/dashboard'
      },
      {
        label: 'Mi Agenda',
        icon: 'fas fa-calendar-check',
        route: '/contador/agenda'
      },
      {
        label: 'Gestión de Citas',
        icon: 'fas fa-users',
        route: '/contador/citas'
      },
      {
        label: 'Documentos',
        icon: 'fas fa-folder-open',
        route: '/contador/documentos'
      },
      {
        label: 'Mis Clientes',
        icon: 'fas fa-address-book',
        route: '/contador/clientes'
      },
      {
        label: 'Mi Perfil',
        icon: 'fas fa-user',
        route: '/contador/perfil'
      }
    ];
  }

  private getAdministradorMenu(): MenuItem[] {
    return [
      {
        label: 'Dashboard',
        icon: 'fas fa-tachometer-alt',
        route: '/admin/dashboard'
      },
      {
        label: 'Gestión de Usuarios',
        icon: 'fas fa-users-cog',
        route: '/admin/usuarios'
      },
      {
        label: 'Contadores',
        icon: 'fas fa-user-tie',
        route: '/admin/contadores'
      },
      {
        label: 'Todas las Citas',
        icon: 'fas fa-calendar-alt',
        route: '/admin/citas'
      },
      {
        label: 'Documentos',
        icon: 'fas fa-folder',
        route: '/admin/documentos'
      },
      {
        label: 'Reportes',
        icon: 'fas fa-chart-bar',
        route: '/admin/reportes'
      },
      {
        label: 'Configuración',
        icon: 'fas fa-cog',
        route: '/admin/configuracion'
      }
    ];
  }

  logout(): void {
    this.authService.logout();
  }
}
