import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import {
  Documento,
  SubirDocumento,
  ActualizarDocumento,
  TipoDocumento,
  FiltrosDocumento,
  ResumenDocumentos,
  DescargaDocumento,
  ValidacionArchivo,
  ConfiguracionArchivos,
  ApiResponse,
  PaginatedResponse,
  PaginationFilters
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class DocumentoService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = 'https://localhost:7164/api/documentos'; // Cambiar por tu URL del backend

  // Configuración de archivos permitidos
  private readonly configuracionArchivos: ConfiguracionArchivos = {
    tiposPermitidos: ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'],
    tamañoMaximo: 10 * 1024 * 1024, // 10MB
    extensionesPermitidas: ['.pdf', '.jpg', '.jpeg', '.png']
  };

  /**
   * Obtener todos los documentos
   */
  getDocumentos(filters?: FiltrosDocumento & PaginationFilters): Observable<Documento[]> {
    let params = new HttpParams();

    if (filters) {
      if (filters.tipo) params = params.set('tipo', filters.tipo);
      if (filters.fechaInicio) params = params.set('fechaInicio', filters.fechaInicio.toISOString());
      if (filters.fechaFin) params = params.set('fechaFin', filters.fechaFin.toISOString());
      if (filters.contribuyenteId) params = params.set('contribuyenteId', filters.contribuyenteId.toString());
      if (filters.nombre) params = params.set('nombre', filters.nombre);
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.limit) params = params.set('limit', filters.limit.toString());
      if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
      if (filters.sortOrder) params = params.set('sortOrder', filters.sortOrder);
    }

    return this.http.get<ApiResponse<Documento[]>>(this.API_URL, { params })
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Obtener documentos paginados
   */
  getDocumentosPaginados(filters: FiltrosDocumento & PaginationFilters): Observable<PaginatedResponse<Documento>> {
    let params = new HttpParams();

    if (filters.tipo) params = params.set('tipo', filters.tipo);
    if (filters.fechaInicio) params = params.set('fechaInicio', filters.fechaInicio.toISOString());
    if (filters.fechaFin) params = params.set('fechaFin', filters.fechaFin.toISOString());
    if (filters.contribuyenteId) params = params.set('contribuyenteId', filters.contribuyenteId.toString());
    if (filters.nombre) params = params.set('nombre', filters.nombre);
    if (filters.page) params = params.set('page', filters.page.toString());
    if (filters.limit) params = params.set('limit', filters.limit.toString());
    if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params = params.set('sortOrder', filters.sortOrder);

    return this.http.get<ApiResponse<PaginatedResponse<Documento>>>(`${this.API_URL}/paginated`, { params })
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Obtener documento por ID
   */
  getDocumento(id: number): Observable<Documento> {
    return this.http.get<ApiResponse<Documento>>(`${this.API_URL}/${id}`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Obtener documentos por contribuyente
   */
  getDocumentosPorContribuyente(contribuyenteId: number, filters?: FiltrosDocumento): Observable<Documento[]> {
    let params = new HttpParams();

    if (filters) {
      if (filters.tipo) params = params.set('tipo', filters.tipo);
      if (filters.fechaInicio) params = params.set('fechaInicio', filters.fechaInicio.toISOString());
      if (filters.fechaFin) params = params.set('fechaFin', filters.fechaFin.toISOString());
      if (filters.nombre) params = params.set('nombre', filters.nombre);
    }

    return this.http.get<ApiResponse<Documento[]>>(`${this.API_URL}/contribuyente/${contribuyenteId}`, { params })
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Subir documento
   */
  subirDocumento(datosDocumento: SubirDocumento): Observable<Documento> {
    const formData = new FormData();
    formData.append('archivo', datosDocumento.archivo);
    formData.append('tipo', datosDocumento.tipo);
    formData.append('contribuyenteId', datosDocumento.contribuyenteId.toString());

    if (datosDocumento.descripcion) {
      formData.append('descripcion', datosDocumento.descripcion);
    }

    return this.http.post<ApiResponse<Documento>>(this.API_URL, formData)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Subir múltiples documentos
   */
  subirMultiplesDocumentos(archivos: File[], tipo: TipoDocumento, contribuyenteId: number, descripcion?: string): Observable<Documento[]> {
    const formData = new FormData();

    archivos.forEach((archivo, index) => {
      formData.append(`archivos`, archivo);
    });

    formData.append('tipo', tipo);
    formData.append('contribuyenteId', contribuyenteId.toString());

    if (descripcion) {
      formData.append('descripcion', descripcion);
    }

    return this.http.post<ApiResponse<Documento[]>>(`${this.API_URL}/multiple`, formData)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Actualizar documento
   */
  actualizarDocumento(id: number, documento: ActualizarDocumento): Observable<Documento> {
    return this.http.put<ApiResponse<Documento>>(`${this.API_URL}/${id}`, documento)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Eliminar documento
   */
  eliminarDocumento(id: number): Observable<any> {
    return this.http.delete<ApiResponse<any>>(`${this.API_URL}/${id}`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Descargar documento
   */
  descargarDocumento(id: number): Observable<DescargaDocumento> {
    return this.http.get<ApiResponse<DescargaDocumento>>(`${this.API_URL}/download/${id}`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Obtener URL de descarga directa
   */
  getUrlDescarga(id: number): string {
    return `${this.API_URL}/download/${id}`;
  }

  /**
   * Descargar archivo blob
   */
  descargarArchivoBlob(id: number): Observable<Blob> {
    return this.http.get(`${this.API_URL}/download/${id}`, {
      responseType: 'blob'
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtener resumen de documentos para dashboard
   */
  getResumenDocumentos(contribuyenteId?: number): Observable<ResumenDocumentos> {
    let params = new HttpParams();
    if (contribuyenteId) {
      params = params.set('contribuyenteId', contribuyenteId.toString());
    }

    return this.http.get<ApiResponse<ResumenDocumentos>>(`${this.API_URL}/resumen`, { params })
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Buscar documentos
   */
  buscarDocumentos(termino: string, contribuyenteId?: number): Observable<Documento[]> {
    let params = new HttpParams().set('search', termino);
    if (contribuyenteId) {
      params = params.set('contribuyenteId', contribuyenteId.toString());
    }

    return this.http.get<ApiResponse<Documento[]>>(`${this.API_URL}/buscar`, { params })
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Validar archivo antes de subir
   */
  validarArchivo(archivo: File): ValidacionArchivo {
    const errores: string[] = [];

    // Validar tamaño
    if (archivo.size > this.configuracionArchivos.tamañoMaximo) {
      errores.push(`El archivo es demasiado grande. Máximo permitido: ${this.formatearTamaño(this.configuracionArchivos.tamañoMaximo)}`);
    }

    // Validar tipo MIME
    if (!this.configuracionArchivos.tiposPermitidos.includes(archivo.type)) {
      errores.push(`Tipo de archivo no permitido. Tipos permitidos: ${this.configuracionArchivos.tiposPermitidos.join(', ')}`);
    }

    // Validar extensión
    const extension = this.getExtensionArchivo(archivo.name);
    if (!this.configuracionArchivos.extensionesPermitidas.includes(extension)) {
      errores.push(`Extensión no permitida. Extensiones permitidas: ${this.configuracionArchivos.extensionesPermitidas.join(', ')}`);
    }

    return {
      valido: errores.length === 0,
      errores,
      tamaño: archivo.size,
      extension
    };
  }

  /**
   * Obtener configuración de archivos
   */
  getConfiguracionArchivos(): ConfiguracionArchivos {
    return { ...this.configuracionArchivos };
  }

  /**
   * Formatear tamaño de archivo
   */
  formatearTamaño(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Obtener extensión de archivo
   */
  private getExtensionArchivo(nombreArchivo: string): string {
    return '.' + nombreArchivo.split('.').pop()?.toLowerCase() || '';
  }

  /**
   * Generar vista previa de archivo (para imágenes)
   */
  generarVistaPrevia(archivo: File): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!archivo.type.startsWith('image/')) {
        reject('El archivo no es una imagen');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject('Error al leer el archivo');
      reader.readAsDataURL(archivo);
    });
  }

  /**
   * Obtener ícono según tipo de documento
   */
  getIconoTipoDocumento(tipo: TipoDocumento): string {
    const iconos: Record<TipoDocumento, string> = {
      [TipoDocumento.CERTIFICADO_LABORAL]: 'fas fa-briefcase',
      [TipoDocumento.CERTIFICADO_BANCARIO]: 'fas fa-university',
      [TipoDocumento.FACTURAS_GASTOS]: 'fas fa-receipt',
      [TipoDocumento.DECLARACION_ANTERIOR]: 'fas fa-file-alt',
      [TipoDocumento.OTRO]: 'fas fa-file'
    };

    return iconos[tipo] || 'fas fa-file';
  }

  /**
   * Manejo de errores
   */
  private handleError = (error: any): Observable<never> => {
    console.error('Error en DocumentoService:', error);

    let errorMessage = 'Ha ocurrido un error inesperado';

    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return throwError(() => new Error(errorMessage));
  };
}
