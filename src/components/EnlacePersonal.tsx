import { router } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colores, TAMANIO_TACTIL, tipografia } from '@/constants/tema';
import { useBiblioteca } from '@/hooks/useBiblioteca';

export function EnlacePersonal() {
  const { sesionIniciada } = useBiblioteca();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityHint="Acceso para el personal de la biblioteca"
      onPress={() => router.push(sesionIniciada ? '/mostrador' : '/login')}
      style={estilos.boton}>
      <Text style={estilos.texto}>{sesionIniciada ? 'Mostrador' : 'Personal'}</Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  boton: {
    minHeight: TAMANIO_TACTIL,
    minWidth: TAMANIO_TACTIL,
    justifyContent: 'center',
  },
  texto: {
    fontSize: tipografia.normal,
    color: colores.primario,
    fontWeight: '600',
  },
});
