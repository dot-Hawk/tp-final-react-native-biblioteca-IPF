import { router } from 'expo-router';
import { useMemo } from 'react';
import { FlatList, StyleSheet } from 'react-native';

import { CabeceraCatalogo } from '@/components/CabeceraCatalogo';
import { EstadoCarga } from '@/components/EstadoCarga';
import { EstadoMensaje } from '@/components/EstadoMensaje';
import { FilaLibro } from '@/components/FilaLibro';
import { Separador } from '@/components/Separador';
import { espacio } from '@/constants/tema';
import { useBiblioteca } from '@/hooks/useBiblioteca';
import { useLibros } from '@/hooks/useLibros';
import type { Libro } from '@/types';

function abrirDetalle(libro: Libro) {
  router.push(`/libro/${libro.isbn}`);
}

export default function Catalogo() {
  const { libros, cargando, error, reintentar } = useLibros();
  const { recientes, disponibles } = useBiblioteca();

  const librosRecientes = useMemo(
    () =>
      recientes
        .map((isbn) => libros.find((libro) => libro.isbn === isbn))
        .filter((libro): libro is Libro => libro !== undefined),
    [recientes, libros],
  );

  function renderVacio() {
    if (cargando) return <EstadoCarga mensaje="Cargando catálogo..." />;
    if (error) return <EstadoMensaje titulo="Algo salió mal" mensaje={error} textoAccion="Reintentar" alAccionar={reintentar} />;
    return <EstadoMensaje titulo="El catálogo está vacío" mensaje="Todavía no hay libros cargados." />;
  }

  return (
    <FlatList
      data={cargando || error ? [] : libros}
      keyExtractor={(libro) => libro.isbn}
      renderItem={({ item }) => (
        <FilaLibro libro={item} disponibles={disponibles(item)} alPresionar={abrirDetalle} />
      )}
      ItemSeparatorComponent={Separador}
      ListHeaderComponent={<CabeceraCatalogo recientes={librosRecientes} />}
      ListEmptyComponent={renderVacio()}
      contentContainerStyle={estilos.contenido}
    />
  );
}

const estilos = StyleSheet.create({
  contenido: {
    paddingBottom: espacio.xxl,
  },
});
