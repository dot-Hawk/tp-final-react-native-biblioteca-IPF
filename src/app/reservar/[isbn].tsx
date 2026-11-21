import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Boton } from '@/components/Boton';
import { EstadoCarga } from '@/components/EstadoCarga';
import { EstadoMensaje } from '@/components/EstadoMensaje';
import { DIAS_PRESTAMO } from '@/constants/biblioteca';
import { colores, espacio, tipografia } from '@/constants/tema';
import { useBiblioteca } from '@/hooks/useBiblioteca';
import { useLibros } from '@/hooks/useLibros';
import { formatearFecha, sumarDias } from '@/lib/fechas';
import { esIsbnValido } from '@/lib/isbn';
import { primerValor } from '@/lib/parametros';

function cerrar() {
  router.back();
}

export default function ConfirmarReserva() {
  const isbn = primerValor(useLocalSearchParams<'/reservar/[isbn]'>().isbn);
  const { libros, cargando, error, reintentar } = useLibros();
  const { disponibles, listaDeEspera, reservar } = useBiblioteca();
  const [mensajeError, setMensajeError] = useState<string | null>(null);
  // Se calcula una sola vez al abrir la confirmación, no en cada render.
  const [fechaDevolucion] = useState(() => sumarDias(Date.now(), DIAS_PRESTAMO));

  const libro = esIsbnValido(isbn) ? libros.find((l) => l.isbn === isbn) : undefined;

  if (cargando) return <EstadoCarga mensaje="Preparando la reserva..." />;
  if (error) {
    return <EstadoMensaje titulo="Algo salió mal" mensaje={error} textoAccion="Reintentar" alAccionar={reintentar} />;
  }
  if (!libro) {
    return <EstadoMensaje titulo="Libro no encontrado" mensaje="No podemos reservar este libro." textoAccion="Cerrar" alAccionar={cerrar} />;
  }

  const hayEjemplares = disponibles(libro) > 0;
  const posicionFutura = listaDeEspera(libro.isbn).length + 1;

  function confirmar() {
    if (!libro) return;
    const resultado = reservar(libro);
    if (resultado.tipo === 'duplicada') {
      setMensajeError('Ya tenés este libro prestado o estás en su lista de espera.');
      return;
    }
    // dismissTo saca el modal de la pila: "atrás" no vuelve a esta confirmación.
    router.dismissTo('/reservas');
  }

  return (
    <View style={estilos.contenido}>
      <Text style={estilos.titulo}>{libro.titulo}</Text>
      <Text style={estilos.autor}>{libro.autor}</Text>

      <Text style={estilos.explicacion}>
        {hayEjemplares
          ? `Hay ejemplares disponibles. Te lo llevás prestado por ${DIAS_PRESTAMO} días: devolvelo antes del ${formatearFecha(fechaDevolucion)}.`
          : `No quedan ejemplares. Vas a entrar a la lista de espera en la posición ${posicionFutura}.`}
      </Text>

      {mensajeError ? <Text style={estilos.error}>{mensajeError}</Text> : null}

      <View style={estilos.acciones}>
        <Boton titulo={hayEjemplares ? 'Confirmar préstamo' : 'Anotarme en la lista'} alPresionar={confirmar} />
        <Boton titulo="Cancelar" alPresionar={cerrar} variante="secundario" />
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenido: {
    flex: 1,
    gap: espacio.m,
    padding: espacio.l,
  },
  titulo: {
    fontSize: tipografia.titulo,
    fontWeight: '700',
    color: colores.texto,
  },
  autor: {
    fontSize: tipografia.normal,
    color: colores.textoSecundario,
  },
  explicacion: {
    marginTop: espacio.m,
    fontSize: tipografia.media,
    lineHeight: 24,
    color: colores.texto,
  },
  error: {
    fontSize: tipografia.normal,
    color: colores.peligro,
  },
  acciones: {
    marginTop: espacio.l,
    gap: espacio.s,
  },
});
