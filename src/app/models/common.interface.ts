/**
 * Interface para respuestas de la API
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

/**
 * Interface para respuestas paginadas
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Interface para filtros de paginación
 */
export interface PaginationFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

/**
 * Interface para errores de la API
 */
export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
  details?: any;
}

/**
 * Interface para configuración de la aplicación
 */
export interface AppConfig {
  apiBaseUrl: string;
  allowedFileTypes: string[];
  maxFileSize: number;
  jwtTokenKey: string;
  refreshTokenKey: string;
}

/**
 * Interface para notificaciones
 */
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  autoClose?: boolean;
}

/**
 * Interface para estado de carga
 */
export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

/**
 * Interface para breadcrumbs
 */
export interface Breadcrumb {
  label: string;
  url?: string;
  icon?: string;
}

/**
 * Interface para elementos de menú
 */
export interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  children?: MenuItem[];
  roles?: string[];
  badge?: string | number;
}

/**
 * Interface para dashboard stats
 */
export interface DashboardStats {
  label: string;
  value: number | string;
  icon: string;
  color: string;
  change?: number;
  changeType?: 'increase' | 'decrease';
}
