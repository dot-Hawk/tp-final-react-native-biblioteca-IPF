import { StyleSheet, Text, View } from 'react-native';

import { colores, espacio, radio, tipografia } from '@/constants/tema';

type Props = {
  titulo: string;
  posicion: number;
};

export function TarjetaEspera({ titulo, posicion }: Props) {
  return (
    <View style={estilos.tarjeta}>
      <Text style={estilos.titulo}>{titulo}</Text>
      <Text style={estilos.detalle}>
        {posicion === 1 ? 'Sos la próxima persona en la lista' : `Posición ${posicion} en la lista de espera`}
      </Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    gap: espacio.xs,
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
