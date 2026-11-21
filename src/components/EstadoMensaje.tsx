import { StyleSheet, Text, View } from 'react-native';

import { Boton } from '@/components/Boton';
import { colores, espacio, tipografia } from '@/constants/tema';

type Props = {
  titulo: string;
  mensaje?: string;
  textoAccion?: string;
  alAccionar?: () => void;
};

/** Mensaje centrado para estados de error, vacío o "no encontrado". */
export function EstadoMensaje({ titulo, mensaje, textoAccion, alAccionar }: Props) {
  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo}>{titulo}</Text>
      {mensaje ? <Text style={estilos.mensaje}>{mensaje}</Text> : null}
      {textoAccion && alAccionar ? (
        <View style={estilos.accion}>
          <Boton titulo={textoAccion} alPresionar={alAccionar} variante="secundario" />
        </View>
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    padding: espacio.xl,
    alignItems: 'center',
    gap: espacio.s,
  },
  titulo: {
    fontSize: tipografia.media,
    fontWeight: '600',
    color: colores.texto,
    textAlign: 'center',
  },
  mensaje: {
    fontSize: tipografia.normal,
    color: colores.textoSecundario,
    textAlign: 'center',
  },
  accion: {
    marginTop: espacio.m,
    alignSelf: 'stretch',
  },
});
