import { Routes } from '@angular/router';
import { authGuard, roleGuard, guestGuard } from './guards';
import { TipoUsuario } from './models';

export const routes: Routes = [
  // Rutas públicas (solo para invitados)
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent),
    canActivate: [guestGuard]
  },

  // Rutas para CONTRIBUYENTE
  {
    path: 'contribuyente',
    canActivate: [authGuard, roleGuard([TipoUsuario.CONTRIBUYENTE])],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/contribuyente/dashboard/dashboard.component').then(m => m.ContribuyenteDashboardComponent)
      },
      {
        path: 'documentos',
        loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) // Temporal
      },
      {
        path: 'citas',
        loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) // Temporal
      },
      {
        path: 'agendar',
        loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) // Temporal
      },
      {
        path: 'perfil',
        loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) // Temporal
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },

  // Rutas para CONTADOR
  {
    path: 'contador',
    canActivate: [authGuard, roleGuard([TipoUsuario.CONTADOR])],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/contador/dashboard/dashboard.component').then(m => m.ContadorDashboardComponent)
      },
      {
        path: 'agenda',
        loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) // Temporal
      },
      {
        path: 'citas',
        loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) // Temporal
      },
      {
        path: 'clientes',
        loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) // Temporal
      },
      {
        path: 'documentos',
        loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) // Temporal
      },
      {
        path: 'perfil',
        loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) // Temporal
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },

  // Rutas para ADMINISTRADOR
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard([TipoUsuario.ADMINISTRADOR])],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/admin/dashboard/dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) // Temporal
      },
      {
        path: 'contadores',
        loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) // Temporal
      },
      {
        path: 'citas',
        loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) // Temporal
      },
      {
        path: 'documentos',
        loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) // Temporal
      },
      {
        path: 'reportes',
        loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) // Temporal
      },
      {
        path: 'configuracion',
        loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) // Temporal
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },

  // Rutas compartidas (requieren autenticación)
  {
    path: 'profile',
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent), // Temporal
    canActivate: [authGuard]
  },

  // Ruta temporal para desarrollo
  {
    path: 'test',
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
  },

  // Página de inicio - redirige según el usuario autenticado
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },

  // Redirección para rutas no encontradas
  {
    path: '**',
    redirectTo: '/login'
  }
];
