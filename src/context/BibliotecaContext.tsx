import { createContext, useCallback, useMemo, useRef, useState, type ReactNode } from 'react';

import {
  CANTIDAD_RECIENTES,
  CLAVE_PERSONAL,
  DIAS_PRESTAMO,
  PERSONA_ACTUAL,
  USUARIO_PERSONAL,
} from '@/constants/biblioteca';
import { ESPERAS_INICIALES } from '@/data/esperas';
import { Cola } from '@/estructuras/Cola';
import { Pila } from '@/estructuras/Pila';
import { sumarDias } from '@/lib/fechas';
import {
  avisarLibroDisponible,
  cancelarRecordatorio,
  programarRecordatorio,
  tienePermisoNotificaciones,
} from '@/lib/notificaciones';
import type { Aviso, Libro, Prestamo, ResultadoReserva } from '@/types';

type Esperas = Record<string, Cola<string>>;

export type ValorBiblioteca = {
  prestamos: Prestamo[];
  recientes: string[];
  sesionIniciada: boolean;
  avisos: Aviso[];
  disponibles: (libro: Libro) => number;
  listaDeEspera: (isbn: string) => string[];
  posicionEnEspera: (isbn: string) => number;
  registrarVisita: (isbn: string) => void;
  reservar: (libro: Libro) => ResultadoReserva;
  devolver: (isbn: string) => Promise<void>;
  activarRecordatorio: (isbn: string, titulo: string) => Promise<'notificacion' | 'en-app'>;
  desactivarRecordatorio: (isbn: string) => Promise<void>;
  entregarAlSiguiente: (libro: Libro) => Promise<string | undefined>;
  iniciarSesion: (usuario: string, clave: string) => boolean;
  cerrarSesion: () => void;
  descartarAviso: (id: string) => void;
};

export const BibliotecaContext = createContext<ValorBiblioteca | null>(null);

function crearEsperasIniciales(): Esperas {
  const esperas: Esperas = {};
  for (const [isbn, personas] of Object.entries(ESPERAS_INICIALES)) {
    esperas[isbn] = new Cola(personas);
  }
  return esperas;
}

function crearPrestamo(isbn: string, origen: Prestamo['origen']): Prestamo {
  const ahora = Date.now();
  return {
    isbn,
    fechaPrestamo: ahora,
    fechaDevolucion: sumarDias(ahora, DIAS_PRESTAMO),
    origen,
    recordatorio: false,
    notificacionId: null,
  };
}

type Props = { children: ReactNode };

export function BibliotecaProvider({ children }: Props) {
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  // Las clases se tratan como inmutables: cada cambio crea una instancia
  // nueva a partir de la anterior para que React detecte el cambio.
  const [esperas, setEsperas] = useState<Esperas>(crearEsperasIniciales);
  const [pilaRecientes, setPilaRecientes] = useState(() => new Pila<string>());
  const [sesionIniciada, setSesionIniciada] = useState(false);
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const contadorAvisos = useRef(0);

  const agregarAviso = useCallback((texto: string) => {
    contadorAvisos.current += 1;
    const id = String(contadorAvisos.current);
    setAvisos((anteriores) => [...anteriores, { id, texto }]);
  }, []);

  const descartarAviso = useCallback((id: string) => {
    setAvisos((anteriores) => anteriores.filter((aviso) => aviso.id !== id));
  }, []);

  const recientes = useMemo(
    () => pilaRecientes.aArray().reverse().slice(0, CANTIDAD_RECIENTES),
    [pilaRecientes],
  );

  const registrarVisita = useCallback((isbn: string) => {
    setPilaRecientes((anterior) => {
      if (anterior.verTope() === isbn) return anterior;
      const nueva = new Pila(anterior.aArray());
      nueva.apilar(isbn);
      return nueva;
    });
  }, []);

  const disponibles = useCallback(
    (libro: Libro) => {
      const prestadosDelEstante = prestamos.filter(
        (p) => p.isbn === libro.isbn && p.origen === 'estante',
      ).length;
      return Math.max(libro.ejemplares - prestadosDelEstante, 0);
    },
    [prestamos],
  );

  const listaDeEspera = useCallback(
    (isbn: string) => esperas[isbn]?.aArray() ?? [],
    [esperas],
  );

  const posicionEnEspera = useCallback(
    (isbn: string) => esperas[isbn]?.posicion(PERSONA_ACTUAL) ?? 0,
    [esperas],
  );

  const reservar = useCallback(
    (libro: Libro): ResultadoReserva => {
      const yaPrestado = prestamos.some((p) => p.isbn === libro.isbn);
      if (yaPrestado || posicionEnEspera(libro.isbn) > 0) {
        return { tipo: 'duplicada' };
      }

      if (disponibles(libro) > 0) {
        const prestamo = crearPrestamo(libro.isbn, 'estante');
        setPrestamos((anteriores) => [...anteriores, prestamo]);
        return { tipo: 'prestamo', prestamo };
      }

      const cola = new Cola(listaDeEspera(libro.isbn));
      cola.encolar(PERSONA_ACTUAL);
      setEsperas((anteriores) => ({ ...anteriores, [libro.isbn]: cola }));
      return { tipo: 'espera', posicion: cola.tamanio };
    },
    [prestamos, posicionEnEspera, disponibles, listaDeEspera],
  );

  const devolver = useCallback(
    async (isbn: string) => {
      const prestamo = prestamos.find((p) => p.isbn === isbn);
      if (prestamo?.notificacionId) {
        await cancelarRecordatorio(prestamo.notificacionId);
      }
      setPrestamos((anteriores) => anteriores.filter((p) => p.isbn !== isbn));
    },
    [prestamos],
  );

  const activarRecordatorio = useCallback(async (isbn: string, titulo: string) => {
    // Se consulta el permiso en este momento: la persona pudo cambiarlo en Ajustes.
    const conPermiso = await tienePermisoNotificaciones();
    const notificacionId = conPermiso ? await programarRecordatorio(titulo) : null;

    setPrestamos((anteriores) =>
      anteriores.map((p) =>
        p.isbn === isbn ? { ...p, recordatorio: true, notificacionId } : p,
      ),
    );
    return conPermiso ? 'notificacion' : 'en-app';
  }, []);

  const desactivarRecordatorio = useCallback(
    async (isbn: string) => {
      const prestamo = prestamos.find((p) => p.isbn === isbn);
      if (prestamo?.notificacionId) {
        await cancelarRecordatorio(prestamo.notificacionId);
      }
      setPrestamos((anteriores) =>
        anteriores.map((p) =>
          p.isbn === isbn ? { ...p, recordatorio: false, notificacionId: null } : p,
        ),
      );
    },
    [prestamos],
  );

  const entregarAlSiguiente = useCallback(
    async (libro: Libro) => {
      const cola = new Cola(listaDeEspera(libro.isbn));
      const persona = cola.desencolar();
      if (persona === undefined) return undefined;

      setEsperas((anteriores) => ({ ...anteriores, [libro.isbn]: cola }));

      if (persona === PERSONA_ACTUAL) {
        setPrestamos((anteriores) => [...anteriores, crearPrestamo(libro.isbn, 'espera')]);
        if (await tienePermisoNotificaciones()) {
          await avisarLibroDisponible(libro.titulo);
        } else {
          agregarAviso(`"${libro.titulo}" ya está disponible para vos. Retiralo en el mostrador.`);
        }
      }
      return persona;
    },
    [listaDeEspera, agregarAviso],
  );

  const iniciarSesion = useCallback((usuario: string, clave: string) => {
    const valida = usuario.trim() === USUARIO_PERSONAL && clave === CLAVE_PERSONAL;
    if (valida) setSesionIniciada(true);
    return valida;
  }, []);

  const cerrarSesion = useCallback(() => setSesionIniciada(false), []);

  const valor = useMemo<ValorBiblioteca>(
    () => ({
      prestamos,
      recientes,
      sesionIniciada,
      avisos,
      disponibles,
      listaDeEspera,
      posicionEnEspera,
      registrarVisita,
      reservar,
      devolver,
      activarRecordatorio,
      desactivarRecordatorio,
      entregarAlSiguiente,
      iniciarSesion,
      cerrarSesion,
      descartarAviso,
    }),
    [
      prestamos,
      recientes,
      sesionIniciada,
      avisos,
      disponibles,
      listaDeEspera,
      posicionEnEspera,
      registrarVisita,
      reservar,
      devolver,
      activarRecordatorio,
      desactivarRecordatorio,
      entregarAlSiguiente,
      iniciarSesion,
      cerrarSesion,
      descartarAviso,
    ],
  );

  return <BibliotecaContext.Provider value={valor}>{children}</BibliotecaContext.Provider>;
}
