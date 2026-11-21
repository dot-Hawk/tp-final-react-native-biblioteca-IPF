import { router } from 'expo-router';
import { useMemo } from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';

import { AvisoEnApp } from '@/components/AvisoEnApp';
import { EspacioEntreItems } from '@/components/EspacioEntreItems';
import { EstadoCarga } from '@/components/EstadoCarga';
import { EstadoMensaje } from '@/components/EstadoMensaje';
import { TarjetaEspera } from '@/components/TarjetaEspera';
import { TarjetaPrestamo } from '@/components/TarjetaPrestamo';
import { colores, espacio, tipografia } from '@/constants/tema';
import { useBiblioteca } from '@/hooks/useBiblioteca';
import { useLibros } from '@/hooks/useLibros';
import { usePermiso } from '@/hooks/usePermiso';
import type { Prestamo } from '@/types';

type Item = { tipo: 'prestamo'; prestamo: Prestamo } | { tipo: 'espera'; isbn: string; posicion: number };

function claveItem(item: Item): string {
  return item.tipo === 'prestamo' ? item.prestamo.isbn : item.isbn;
}

const TEXTO_PERMISO = {
  cargando: 'Consultando permiso de notificaciones...',
  concedido: 'Notificaciones activadas.',
  preguntable: 'Las notificaciones se piden al activar "Recordarme".',
  bloqueado: 'Notificaciones desactivadas: los avisos aparecen en esta pantalla.',
} as const;

export default function MisReservas() {
  const { libros, cargando, error, reintentar } = useLibros();
  const {
    prestamos,
    avisos,
    posicionEnEspera,
    devolver,
    activarRecordatorio,
    desactivarRecordatorio,
    descartarAviso,
  } = useBiblioteca();
  const permiso = usePermiso('notificaciones');

  const secciones = useMemo(() => {
    const enEspera: Item[] = libros
      .map((libro) => ({ tipo: 'espera' as const, isbn: libro.isbn, posicion: posicionEnEspera(libro.isbn) }))
      .filter((item) => item.posicion > 0);
    const prestados: Item[] = prestamos.map((prestamo) => ({ tipo: 'prestamo' as const, prestamo }));

    return [
      { titulo: 'Mis préstamos', data: prestados },
      { titulo: 'En lista de espera', data: enEspera },
    ].filter((seccion) => seccion.data.length > 0);
  }, [libros, prestamos, posicionEnEspera]);

  function tituloDe(isbn: string): string {
    return libros.find((libro) => libro.isbn === isbn)?.titulo ?? isbn;
  }

  async function cambiarRecordatorio(isbn: string, activo: boolean) {
    if (!activo) {
      await desactivarRecordatorio(isbn);
      return;
    }
    // Primera vez: antes del diálogo del sistema va la pantalla previa.
    if (permiso.estado === 'preguntable') {
      router.push({ pathname: '/permisos/[recurso]', params: { recurso: 'notificaciones', isbn, titulo: tituloDe(isbn) } });
      return;
    }
    await activarRecordatorio(isbn, tituloDe(isbn));
  }

  function renderItem({ item }: { item: Item }) {
    if (item.tipo === 'espera') {
      return <TarjetaEspera titulo={tituloDe(item.isbn)} posicion={item.posicion} />;
    }
    const { isbn } = item.prestamo;
    return (
      <TarjetaPrestamo
        prestamo={item.prestamo}
        titulo={tituloDe(isbn)}
        alCambiarRecordatorio={(activo) => cambiarRecordatorio(isbn, activo)}
        alDevolver={() => devolver(isbn)}
      />
    );
  }

  function renderVacio() {
    if (cargando) return <EstadoCarga mensaje="Cargando tus reservas..." />;
    if (error) return <EstadoMensaje titulo="Algo salió mal" mensaje={error} textoAccion="Reintentar" alAccionar={reintentar} />;
    return (
      <EstadoMensaje
        titulo="No tenés reservas"
        mensaje="Elegí un libro del catálogo y tocá Reservar."
        textoAccion="Ir al catálogo"
        alAccionar={() => router.navigate('/')}
      />
    );
  }

  return (
    <SectionList
      sections={cargando || error ? [] : secciones}
      keyExtractor={claveItem}
      renderItem={renderItem}
      renderSectionHeader={({ section }) => <Text style={estilos.encabezado}>{section.titulo}</Text>}
      ListHeaderComponent={
        <View style={estilos.cabecera}>
          {avisos.map((aviso) => (
            <AvisoEnApp key={aviso.id} aviso={aviso} alDescartar={descartarAviso} />
          ))}
          <Text style={estilos.permiso}>{TEXTO_PERMISO[permiso.estado]}</Text>
        </View>
      }
      ListEmptyComponent={renderVacio()}
      ItemSeparatorComponent={EspacioEntreItems}
      stickySectionHeadersEnabled={false}
      contentContainerStyle={estilos.contenido}
    />
  );
}

const estilos = StyleSheet.create({
  contenido: {
    padding: espacio.l,
    paddingBottom: espacio.xxl,
  },
  cabecera: {
    gap: espacio.s,
  },
  permiso: {
    fontSize: tipografia.chica,
    color: colores.textoSecundario,
  },
  encabezado: {
    marginTop: espacio.xl,
    marginBottom: espacio.s,
    fontSize: tipografia.chica,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: colores.textoSecundario,
  },
});
