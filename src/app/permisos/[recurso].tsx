import { router, Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Boton } from '@/components/Boton';
import { EstadoCarga } from '@/components/EstadoCarga';
import { EstadoMensaje } from '@/components/EstadoMensaje';
import { colores, espacio, tipografia } from '@/constants/tema';
import { useBiblioteca } from '@/hooks/useBiblioteca';
import { usePermiso } from '@/hooks/usePermiso';
import { primerValor } from '@/lib/parametros';
import type { RecursoPermiso } from '@/types';

const TEXTOS: Record<RecursoPermiso, { titulo: string; beneficio: string }> = {
  camara: {
    titulo: 'Cámara',
    beneficio: 'Con la cámara leés el código de barras de la contratapa y abrís el libro sin escribir el ISBN.',
  },
  notificaciones: {
    titulo: 'Notificaciones',
    beneficio: 'Con las notificaciones te avisamos antes de que venza la devolución de tu préstamo.',
  },
};

function esRecurso(valor: string): valor is RecursoPermiso {
  return valor === 'camara' || valor === 'notificaciones';
}

function cerrar() {
  router.back();
}

type Props = {
  recurso: RecursoPermiso;
  isbn?: string;
  titulo?: string;
};

function PantallaPrevia({ recurso, isbn, titulo }: Props) {
  const { estado, pedir, abrirAjustes } = usePermiso(recurso);
  const { activarRecordatorio } = useBiblioteca();
  const textos = TEXTOS[recurso];

  async function continuar() {
    await pedir();
    // Si se llegó desde el interruptor "Recordarme", se activa con o sin permiso:
    // sin permiso, el recordatorio queda dentro de la app.
    if (recurso === 'notificaciones' && isbn && titulo) {
      await activarRecordatorio(isbn, titulo);
    }
    cerrar();
  }

  if (estado === 'cargando') return <EstadoCarga mensaje="Consultando permiso..." />;

  return (
    <View style={estilos.contenido}>
      <Stack.Screen options={{ title: textos.titulo }} />
      <Text style={estilos.beneficio}>{textos.beneficio}</Text>

      {estado === 'bloqueado' ? (
        <>
          <Text style={estilos.nota}>
            El permiso está desactivado. Podés habilitarlo desde Ajustes; mientras tanto la app sigue funcionando.
          </Text>
          <Boton titulo="Abrir Ajustes" alPresionar={abrirAjustes} />
        </>
      ) : null}

      {estado === 'preguntable' ? <Boton titulo="Continuar" alPresionar={continuar} /> : null}

      {estado === 'concedido' ? (
        <>
          <Text style={estilos.nota}>El permiso ya está concedido.</Text>
          <Boton titulo="Volver" alPresionar={cerrar} />
        </>
      ) : null}
    </View>
  );
}

export default function Permiso() {
  const parametros = useLocalSearchParams<{ recurso: string; isbn?: string; titulo?: string }>();
  const recurso = primerValor(parametros.recurso);
  const isbn = primerValor(parametros.isbn);
  const titulo = primerValor(parametros.titulo);

  if (!esRecurso(recurso)) {
    return <EstadoMensaje titulo="Permiso desconocido" mensaje="Esta pantalla no existe." textoAccion="Volver" alAccionar={cerrar} />;
  }
  return <PantallaPrevia recurso={recurso} isbn={isbn} titulo={titulo} />;
}

const estilos = StyleSheet.create({
  contenido: {
    flex: 1,
    gap: espacio.l,
    padding: espacio.xl,
    justifyContent: 'center',
  },
  beneficio: {
    fontSize: tipografia.media,
    lineHeight: 24,
    color: colores.texto,
  },
  nota: {
    fontSize: tipografia.normal,
    color: colores.textoSecundario,
  },
});
