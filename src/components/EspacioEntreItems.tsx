import { StyleSheet, View } from 'react-native';

import { espacio } from '@/constants/tema';

export function EspacioEntreItems() {
  return <View style={estilos.espacio} />;
}

const estilos = StyleSheet.create({
  espacio: {
    height: espacio.s,
  },
});
