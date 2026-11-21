import { useEffect, useState } from 'react';

import { buscarLibros } from '@/lib/api';
import type { Libro } from '@/types';

type Respuesta = {
  consulta: string;
  resultados: Libro[];
  error: string | null;
};

type ResultadoUseBusqueda = {
  resultados: Libro[];
  buscando: boolean;
  error: string | null;
};

/**
 * Llama a buscarLibros cada vez que cambia la consulta. La limpieza del efecto
 * marca la respuesta en vuelo como vieja: si llega tarde, se descarta.
 * Además cada respuesta recuerda para qué consulta fue, y "buscando" se calcula
 * comparándola con la consulta actual, sin estados extra que sincronizar.
 */
export function useBusqueda(consulta: string): ResultadoUseBusqueda {
  const [respuesta, setRespuesta] = useState<Respuesta | null>(null);
  const texto = consulta.trim();

  useEffect(() => {
    if (texto === '') return;

    let vigente = true;
    buscarLibros(texto)
      .then((resultados) => {
        if (vigente) setRespuesta({ consulta: texto, resultados, error: null });
      })
      .catch(() => {
        if (vigente) {
          setRespuesta({ consulta: texto, resultados: [], error: 'No pudimos completar la búsqueda. Probá de nuevo.' });
        }
      });

    return () => {
      vigente = false;
    };
  }, [texto]);

  if (texto === '') return { resultados: [], buscando: false, error: null };

  const alDia = respuesta !== null && respuesta.consulta === texto;
  return {
    resultados: alDia ? respuesta.resultados : [],
    buscando: !alDia,
    error: alDia ? respuesta.error : null,
  };
}
