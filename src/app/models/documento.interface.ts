import { TipoDocumento } from './enums';
import { Usuario } from './usuario.interface';

/**
 * Interface para Documento
 */
export interface Documento {
  id: number;
  contribuyenteId: number;
  nombre: string;
  rutaArchivo: string;
  fechaCarga: Date;
  tipo: TipoDocumento;
  descripcion?: string;
  contribuyente?: Usuario;
  tamaño?: number; // En bytes
  extension?: string;
}

/**
 * Interface para subir un documento
 */
export interface SubirDocumento {
  archivo: File;
  tipo: TipoDocumento;
  descripcion?: string;
  contribuyenteId: number;
}

/**
 * Interface para actualizar un documento
 */
export interface ActualizarDocumento {
  nombre?: string;
  tipo?: TipoDocumento;
  descripcion?: string;
}

/**
 * Interface para filtros de documentos
 */
export interface FiltrosDocumento {
  tipo?: TipoDocumento;
  fechaInicio?: Date;
  fechaFin?: Date;
  contribuyenteId?: number;
  nombre?: string;
}

/**
 * Interface para resumen de documentos (dashboard)
 */
export interface ResumenDocumentos {
  total: number;
  porTipo: Record<TipoDocumento, number>;
  subidosHoy: number;
  subidosEstaSemana: number;
  tamaño_total: number; // En bytes
}

/**
 * Interface para respuesta de descarga de documento
 */
export interface DescargaDocumento {
  url: string;
  nombre: string;
  tipo: string;
}

/**
 * Interface para validación de archivo
 */
export interface ValidacionArchivo {
  valido: boolean;
  errores: string[];
  tamaño: number;
  extension: string;
}

/**
 * Configuración para validación de archivos
 */
export interface ConfiguracionArchivos {
  tiposPermitidos: string[];
  tamañoMaximo: number; // En bytes
  extensionesPermitidas: string[];
}
