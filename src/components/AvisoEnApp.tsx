import { StyleSheet, Text, View } from 'react-native';

import { BotonIcono } from '@/components/BotonIcono';
import { colores, espacio, radio, tipografia } from '@/constants/tema';
import type { Aviso } from '@/types';

type Props = {
  aviso: Aviso;
  alDescartar: (id: string) => void;
};

export function AvisoEnApp({ aviso, alDescartar }: Props) {
  return (
    <View style={estilos.contenedor} accessibilityRole="alert">
      <Text style={estilos.texto}>{aviso.texto}</Text>
      <BotonIcono icono="close" etiqueta="Descartar aviso" alPresionar={() => alDescartar(aviso.id)} />
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacio.s,
    paddingLeft: espacio.l,
    borderRadius: radio.s,
    backgroundColor: colores.avisoFondo,
  },
  texto: {
    flex: 1,
    paddingVertical: espacio.m,
    fontSize: tipografia.normal,
    color: colores.aviso,
  },
});
