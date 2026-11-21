import { Stack } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { Boton } from '@/components/Boton';
import { EspacioEntreItems } from '@/components/EspacioEntreItems';
import { EstadoCarga } from '@/components/EstadoCarga';
import { EstadoMensaje } from '@/components/EstadoMensaje';
import { FilaMostrador } from '@/components/FilaMostrador';
import { colores, espacio, tipografia } from '@/constants/tema';
import { useBiblioteca } from '@/hooks/useBiblioteca';
import { useLibros } from '@/hooks/useLibros';
import type { Libro } from '@/types';

export default function Mostrador() {
  const { libros, cargando, error, reintentar } = useLibros();
  const { listaDeEspera, entregarAlSiguiente, cerrarSesion } = useBiblioteca();
  const [ocupado, setOcupado] = useState(false);
  const [ultimaEntrega, setUltimaEntrega] = useState<string | null>(null);

  const conEspera = libros.filter((libro) => listaDeEspera(libro.isbn).length > 0);

  async function entregar(libro: Libro) {
    setOcupado(true);
    const persona = await entregarAlSiguiente(libro);
    setUltimaEntrega(persona ? `"${libro.titulo}" se entregó a ${persona}.` : 'La lista de espera ya estaba vacía.');
    setOcupado(false);
  }

  function renderVacio() {
    if (cargando) return <EstadoCarga mensaje="Cargando listas de espera..." />;
    if (error) return <EstadoMensaje titulo="Algo salió mal" mensaje={error} textoAccion="Reintentar" alAccionar={reintentar} />;
    return <EstadoMensaje titulo="Sin listas de espera" mensaje="Ningún libro tiene personas esperando." />;
  }

  return (
    <FlatList
      data={cargando || error ? [] : conEspera}
      keyExtractor={(libro) => libro.isbn}
      renderItem={({ item }) => (
        <FilaMostrador
          titulo={item.titulo}
          enEspera={listaDeEspera(item.isbn)}
          ocupado={ocupado}
          alEntregar={() => entregar(item)}
        />
      )}
      ItemSeparatorComponent={EspacioEntreItems}
      ListHeaderComponent={
        <View style={estilos.cabecera}>
          <Stack.Screen options={{ title: 'Mostrador' }} />
          {ultimaEntrega ? <Text style={estilos.entrega}>{ultimaEntrega}</Text> : null}
        </View>
      }
      ListEmptyComponent={renderVacio()}
      ListFooterComponent={
        <View style={estilos.pie}>
          <Boton titulo="Cerrar sesión" alPresionar={cerrarSesion} variante="peligro" />
        </View>
      }
      contentContainerStyle={estilos.contenido}
    />
  );
}

const estilos = StyleSheet.create({
  contenido: {
    padding: espacio.l,
  },
  cabecera: {
    marginBottom: espacio.m,
  },
  entrega: {
    padding: espacio.m,
    backgroundColor: colores.exitoFondo,
    color: colores.exito,
    fontSize: tipografia.normal,
  },
  pie: {
    marginTop: espacio.xxl,
  },
});
