import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colores, espacio, tipografia } from '@/constants/tema';

type Props = {
  mensaje: string;
};

export function EstadoCarga({ mensaje }: Props) {
  return (
    <View style={estilos.contenedor} accessibilityLiveRegion="polite">
      <ActivityIndicator color={colores.primario} />
      <Text style={estilos.texto}>{mensaje}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    padding: espacio.xl,
    alignItems: 'center',
    gap: espacio.m,
  },
  texto: {
    fontSize: tipografia.normal,
    color: colores.textoSecundario,
  },
});
