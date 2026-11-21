import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Boton } from '@/components/Boton';
import { Seccion } from '@/components/Seccion';
import { colores, espacio, tipografia } from '@/constants/tema';
import type { Libro } from '@/types';

type Props = {
  recientes: Libro[];
};

export function CabeceraCatalogo({ recientes }: Props) {
  return (
    <View style={estilos.contenedor}>
      {recientes.length > 0 ? (
        <Seccion titulo="Vistos recientemente">
          {recientes.map((libro) => (
            <Text
              key={libro.isbn}
              accessibilityRole="link"
              onPress={() => router.push(`/libro/${libro.isbn}`)}
              style={estilos.reciente}>
              {libro.titulo}
            </Text>
          ))}
        </Seccion>
      ) : null}

      <View style={estilos.accesos}>
        <View style={estilos.acceso}>
          <Boton titulo="Buscar" alPresionar={() => router.push('/buscar')} variante="secundario" />
        </View>
        <View style={estilos.acceso}>
          <Boton titulo="Escanear" alPresionar={() => router.push('/escanear')} variante="secundario" />
        </View>
      </View>

      <Text style={estilos.encabezadoLista} accessibilityRole="header">
        Catálogo completo
      </Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    gap: espacio.l,
    padding: espacio.l,
  },
  reciente: {
    paddingVertical: espacio.m,
    fontSize: tipografia.normal,
    color: colores.primario,
  },
  accesos: {
    flexDirection: 'row',
    gap: espacio.s,
  },
  acceso: {
    flex: 1,
  },
  encabezadoLista: {
    fontSize: tipografia.chica,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: colores.textoSecundario,
  },
});
