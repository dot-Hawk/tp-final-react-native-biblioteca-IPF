import { StyleSheet, Text, View } from 'react-native';

import { Boton } from '@/components/Boton';
import { colores, espacio, radio, tipografia } from '@/constants/tema';

type Props = {
  titulo: string;
  enEspera: string[];
  ocupado: boolean;
  alEntregar: () => void;
};

export function FilaMostrador({ titulo, enEspera, ocupado, alEntregar }: Props) {
  const frente = enEspera[0];
  const cantidad = enEspera.length;

  return (
    <View style={estilos.tarjeta}>
      <Text style={estilos.titulo}>{titulo}</Text>
      <Text style={estilos.detalle}>Al frente: {frente ?? 'nadie'}</Text>
      <Text style={estilos.detalle}>
        {cantidad === 1 ? '1 persona esperando' : `${cantidad} personas esperando`}
      </Text>
      <Boton
        titulo="Entregar al siguiente"
        alPresionar={alEntregar}
        deshabilitado={ocupado || cantidad === 0}
        accessibilityHint={frente ? `Entrega el ejemplar a ${frente}` : undefined}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    gap: espacio.s,
    padding: espacio.l,
    borderRadius: radio.m,
    borderWidth: 1,
    borderColor: colores.borde,
    backgroundColor: colores.superficie,
  },
  titulo: {
    fontSize: tipografia.media,
    fontWeight: '600',
    color: colores.texto,
  },
  detalle: {
    fontSize: tipografia.normal,
    color: colores.textoSecundario,
  },
});
