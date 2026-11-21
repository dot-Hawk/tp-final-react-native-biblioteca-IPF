import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { colores, espacio, radio, TAMANIO_TACTIL, tipografia } from '@/constants/tema';

type Props = Omit<TextInputProps, 'style'> & {
  etiqueta: string;
};

export function CampoTexto({ etiqueta, ...props }: Props) {
  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.etiqueta}>{etiqueta}</Text>
      <TextInput
        accessibilityLabel={etiqueta}
        placeholderTextColor={colores.textoSecundario}
        style={estilos.entrada}
        {...props}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    gap: espacio.xs,
  },
  etiqueta: {
    fontSize: tipografia.chica,
    color: colores.textoSecundario,
  },
  entrada: {
    minHeight: TAMANIO_TACTIL,
    paddingHorizontal: espacio.m,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: radio.s,
    backgroundColor: colores.superficie,
    fontSize: tipografia.normal,
    color: colores.texto,
  },
});
