import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colores, espacio, tipografia } from '@/constants/tema';

type Props = {
  titulo: string;
  children: ReactNode;
};

export function Seccion({ titulo, children }: Props) {
  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo} accessibilityRole="header">
        {titulo}
      </Text>
      {children}
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    gap: espacio.s,
  },
  titulo: {
    fontSize: tipografia.chica,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: colores.textoSecundario,
  },
});
