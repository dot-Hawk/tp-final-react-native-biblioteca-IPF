import { Pressable, StyleSheet, Text } from 'react-native';

import { colores, espacio, radio, TAMANIO_TACTIL, tipografia } from '@/constants/tema';

type Variante = 'primario' | 'secundario' | 'peligro';

type Props = {
  titulo: string;
  alPresionar: () => void;
  variante?: Variante;
  deshabilitado?: boolean;
  accessibilityHint?: string;
};

export function Boton({
  titulo,
  alPresionar,
  variante = 'primario',
  deshabilitado = false,
  accessibilityHint,
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: deshabilitado }}
      accessibilityHint={accessibilityHint}
      disabled={deshabilitado}
      onPress={alPresionar}
      style={({ pressed }) => [
        estilos.base,
        estilos[variante],
        pressed && estilos.presionado,
        deshabilitado && estilos.deshabilitado,
      ]}>
      <Text style={[estilos.texto, variante === 'secundario' ? estilos.textoSecundario : estilos.textoClaro]}>
        {titulo}
      </Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  base: {
    minHeight: TAMANIO_TACTIL,
    paddingHorizontal: espacio.l,
    borderRadius: radio.s,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primario: {
    backgroundColor: colores.primario,
  },
  secundario: {
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
  },
  peligro: {
    backgroundColor: colores.peligro,
  },
  presionado: {
    opacity: 0.8,
  },
  deshabilitado: {
    backgroundColor: colores.deshabilitado,
    borderColor: colores.deshabilitado,
  },
  texto: {
    fontSize: tipografia.normal,
    fontWeight: '600',
  },
  textoClaro: {
    color: colores.primarioTexto,
  },
  textoSecundario: {
    color: colores.texto,
  },
});
