import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { colores, TAMANIO_ICONO, TAMANIO_TACTIL } from '@/constants/tema';

type Props = {
  icono: ComponentProps<typeof Ionicons>['name'];
  etiqueta: string;
  alPresionar: () => void;
};

export function BotonIcono({ icono, etiqueta, alPresionar }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={etiqueta}
      onPress={alPresionar}
      hitSlop={4}
      style={({ pressed }) => [estilos.boton, pressed && estilos.presionado]}>
      <Ionicons name={icono} size={TAMANIO_ICONO} color={colores.texto} />
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  boton: {
    minWidth: TAMANIO_TACTIL,
    minHeight: TAMANIO_TACTIL,
    alignItems: 'center',
    justifyContent: 'center',
  },
  presionado: {
    opacity: 0.6,
  },
});
