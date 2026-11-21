import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colores, espacio, TAMANIO_TACTIL, tipografia } from '@/constants/tema';
import type { Libro } from '@/types';

type Props = {
  libro: Libro;
  disponibles: number;
  alPresionar: (libro: Libro) => void;
};

export function FilaLibro({ libro, disponibles, alPresionar }: Props) {
  const textoDisponibles = disponibles > 0 ? `${disponibles} disponibles` : 'Sin ejemplares';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${libro.titulo}, de ${libro.autor}. ${textoDisponibles}`}
      onPress={() => alPresionar(libro)}
      style={({ pressed }) => [estilos.fila, pressed && estilos.presionada]}>
      <View style={estilos.textos}>
        <Text style={estilos.titulo}>{libro.titulo}</Text>
        <Text style={estilos.detalle}>
          {libro.autor} · {libro.anio}
        </Text>
      </View>
      <Text style={[estilos.disponibles, disponibles === 0 && estilos.agotado]}>{textoDisponibles}</Text>
      <Ionicons name="chevron-forward" size={18} color={colores.textoSecundario} />
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  fila: {
    minHeight: TAMANIO_TACTIL,
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacio.s,
    paddingVertical: espacio.m,
    paddingHorizontal: espacio.l,
    backgroundColor: colores.superficie,
  },
  presionada: {
    backgroundColor: colores.fondo,
  },
  textos: {
    flex: 1,
    gap: espacio.xs,
  },
  titulo: {
    fontSize: tipografia.normal,
    fontWeight: '600',
    color: colores.texto,
  },
  detalle: {
    fontSize: tipografia.chica,
    color: colores.textoSecundario,
  },
  disponibles: {
    fontSize: tipografia.chica,
    color: colores.exito,
  },
  agotado: {
    color: colores.aviso,
  },
});
