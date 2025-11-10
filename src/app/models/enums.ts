/**
 * Enumeraciones para ContabiliSync
 */

export enum TipoUsuario {
  CONTRIBUYENTE = 'contribuyente',
  CONTADOR = 'contador',
  ADMINISTRADOR = 'administrador'
}

export enum EstadoCita {
  PENDIENTE = 'pendiente',
  CONFIRMADA = 'confirmada',
  CANCELADA = 'cancelada',
  COMPLETADA = 'completada'
}

export enum TipoDocumento {
  CERTIFICADO_LABORAL = 'certificado_laboral',
  CERTIFICADO_BANCARIO = 'certificado_bancario',
  FACTURAS_GASTOS = 'facturas_gastos',
  DECLARACION_ANTERIOR = 'declaracion_anterior',
  OTRO = 'otro'
}

export const TipoDocumentoLabels: Record<TipoDocumento, string> = {
  [TipoDocumento.CERTIFICADO_LABORAL]: 'Certificado Laboral',
  [TipoDocumento.CERTIFICADO_BANCARIO]: 'Certificado Bancario',
  [TipoDocumento.FACTURAS_GASTOS]: 'Facturas y Gastos',
  [TipoDocumento.DECLARACION_ANTERIOR]: 'Declaración Anterior',
  [TipoDocumento.OTRO]: 'Otro'
};

export const EstadoCitaLabels: Record<EstadoCita, string> = {
  [EstadoCita.PENDIENTE]: 'Pendiente',
  [EstadoCita.CONFIRMADA]: 'Confirmada',
  [EstadoCita.CANCELADA]: 'Cancelada',
  [EstadoCita.COMPLETADA]: 'Completada'
};

export const TipoUsuarioLabels: Record<TipoUsuario, string> = {
  [TipoUsuario.CONTRIBUYENTE]: 'Contribuyente',
  [TipoUsuario.CONTADOR]: 'Contador',
  [TipoUsuario.ADMINISTRADOR]: 'Administrador'
};
