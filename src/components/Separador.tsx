import { StyleSheet, View } from 'react-native';

import { colores } from '@/constants/tema';

export function Separador() {
  return <View style={estilos.linea} />;
}

const estilos = StyleSheet.create({
  linea: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colores.borde,
  },
});
