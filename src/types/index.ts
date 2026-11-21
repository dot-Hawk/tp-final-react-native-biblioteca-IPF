export type Libro = {
  isbn: string; // 13 dígitos, sin guiones
  titulo: string;
  autor: string;
  anio: number;
  ejemplares: number; // ejemplares en el estante al iniciar la app
};

/** De dónde salió el ejemplar prestado. */
export type OrigenPrestamo = 'estante' | 'espera';

export type Prestamo = {
  isbn: string;
  fechaPrestamo: number; // epoch en ms
  fechaDevolucion: number; // epoch en ms
  origen: OrigenPrestamo;
  recordatorio: boolean;
  notificacionId: string | null;
};

export type Aviso = {
  id: string;
  texto: string;
};

export type RecursoPermiso = 'camara' | 'notificaciones';

export type EstadoPermiso = 'cargando' | 'concedido' | 'preguntable' | 'bloqueado';

export type ResultadoReserva =
  | { tipo: 'prestamo'; prestamo: Prestamo }
  | { tipo: 'espera'; posicion: number }
  | { tipo: 'duplicada' }
  | { tipo: 'inexistente' };
