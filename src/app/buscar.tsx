import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { CampoTexto } from '@/components/CampoTexto';
import { EstadoCarga } from '@/components/EstadoCarga';
import { EstadoMensaje } from '@/components/EstadoMensaje';
import { FilaLibro } from '@/components/FilaLibro';
import { Separador } from '@/components/Separador';
import { DEMORA_BUSQUEDA_MS } from '@/constants/biblioteca';
import { espacio } from '@/constants/tema';
import { useBiblioteca } from '@/hooks/useBiblioteca';
import { useBusqueda } from '@/hooks/useBusqueda';
import { primerValor } from '@/lib/parametros';
import type { Libro } from '@/types';

function abrirDetalle(libro: Libro) {
  router.dismissTo(`/libro/${libro.isbn}`);
}

export default function Buscar() {
  // La búsqueda vive en la URL: /buscar?q=borges
  const consulta = primerValor(useLocalSearchParams<'/buscar'>().q);
  // El input arranca con lo que trae la URL y después tiene su propio estado:
  // si leyera directo de la URL, al escribir rápido se perderían letras
  // mientras setParams todavía no se aplicó.
  const [texto, setTexto] = useState(consulta);

  // Debounce: la URL (y con ella la búsqueda) se actualiza recién cuando
  // la persona deja de escribir. La limpieza cancela el temporizador anterior.
  useEffect(() => {
    if (texto === consulta) return;
    const temporizador = setTimeout(() => router.setParams({ q: texto }), DEMORA_BUSQUEDA_MS);
    return () => clearTimeout(temporizador);
  }, [texto, consulta]);

  const { resultados, buscando, error } = useBusqueda(consulta);
  const { disponibles } = useBiblioteca();

  function renderVacio() {
    if (consulta.trim() === '') {
      return <EstadoMensaje titulo="Buscá por título o autor" mensaje="Por ejemplo: Borges, Rayuela, Cortázar." />;
    }
    if (buscando) return <EstadoCarga mensaje="Buscando..." />;
    if (error) {
      return (
        <EstadoMensaje
          titulo="Algo salió mal"
          mensaje={error}
          textoAccion="Limpiar búsqueda"
          alAccionar={() => setTexto('')}
        />
      );
    }
    return <EstadoMensaje titulo="Sin resultados" mensaje={`No encontramos libros para "${consulta}".`} />;
  }

  return (
    <View style={estilos.pantalla}>
      <View style={estilos.buscador}>
        <CampoTexto
          etiqueta="Título o autor"
          value={texto}
          onChangeText={setTexto}
          autoFocus
          autoCorrect={false}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>
      <FlatList
        data={buscando || error ? [] : resultados}
        keyExtractor={(libro) => libro.isbn}
        renderItem={({ item }) => (
          <FilaLibro libro={item} disponibles={disponibles(item)} alPresionar={abrirDetalle} />
        )}
        ItemSeparatorComponent={Separador}
        ListEmptyComponent={renderVacio()}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
  },
  buscador: {
    padding: espacio.l,
  },
});
