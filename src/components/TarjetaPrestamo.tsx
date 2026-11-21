import { StyleSheet, Switch, Text, View } from 'react-native';

import { Boton } from '@/components/Boton';
import { colores, espacio, radio, tipografia } from '@/constants/tema';
import { formatearFecha } from '@/lib/fechas';
import type { Prestamo } from '@/types';

type Props = {
  prestamo: Prestamo;
  titulo: string;
  alCambiarRecordatorio: (activo: boolean) => void;
  alDevolver: () => void;
};

export function TarjetaPrestamo({ prestamo, titulo, alCambiarRecordatorio, alDevolver }: Props) {
  const fecha = formatearFecha(prestamo.fechaDevolucion);
  const recordatorioEnApp = prestamo.recordatorio && prestamo.notificacionId === null;

  return (
    <View style={estilos.tarjeta}>
      <Text style={estilos.titulo}>{titulo}</Text>
      <Text style={estilos.detalle}>Devolver antes del {fecha}</Text>

      <View style={estilos.fila}>
        <Text style={estilos.etiqueta}>Recordarme</Text>
        <Switch
          accessibilityLabel={`Recordarme la devolución de ${titulo}`}
          value={prestamo.recordatorio}
          onValueChange={alCambiarRecordatorio}
          trackColor={{ true: colores.primario, false: colores.borde }}
        />
      </View>

      {recordatorioEnApp ? (
        <Text style={estilos.nota}>
          Las notificaciones están desactivadas: te lo recordamos en esta pantalla.
        </Text>
      ) : null}

      <Boton titulo="Devolver" alPresionar={alDevolver} variante="secundario" />
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
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  etiqueta: {
    fontSize: tipografia.normal,
    color: colores.texto,
  },
  nota: {
    fontSize: tipografia.chica,
    color: colores.aviso,
  },
});
