import { useCallback, useEffect, useState } from 'react';

import { obtenerLibros } from '@/lib/api';
import type { Libro } from '@/types';

type ResultadoUseLibros = {
  libros: Libro[];
  cargando: boolean;
  error: string | null;
  reintentar: () => void;
};

export function useLibros(): ResultadoUseLibros {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Cada reintento cambia este número y eso vuelve a disparar el efecto.
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let cancelado = false;

    obtenerLibros()
      .then((datos) => {
        if (!cancelado) setLibros(datos);
      })
      .catch(() => {
        if (!cancelado) setError('No pudimos cargar el catálogo. Revisá tu conexión e intentá de nuevo.');
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [intento]);

  const reintentar = useCallback(() => {
    setCargando(true);
    setError(null);
    setIntento((n) => n + 1);
  }, []);

  return { libros, cargando, error, reintentar };
}
