import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Boton } from '@/components/Boton';
import { EstadoCarga } from '@/components/EstadoCarga';
import { EstadoMensaje } from '@/components/EstadoMensaje';
import { Seccion } from '@/components/Seccion';
import { colores, espacio, tipografia } from '@/constants/tema';
import { useBiblioteca } from '@/hooks/useBiblioteca';
import { useLibros } from '@/hooks/useLibros';
import { esIsbnValido } from '@/lib/isbn';
import { primerValor } from '@/lib/parametros';

function volverAlCatalogo() {
  router.dismissTo('/');
}

export default function DetalleLibro() {
  const isbn = primerValor(useLocalSearchParams<'/libro/[isbn]'>().isbn);
  const { libros, cargando, error, reintentar } = useLibros();
  const { disponibles, listaDeEspera, posicionEnEspera, prestamos, registrarVisita } = useBiblioteca();

  const isbnValido = esIsbnValido(isbn);
  const libro = isbnValido ? libros.find((l) => l.isbn === isbn) : undefined;

  useEffect(() => {
    if (libro) registrarVisita(libro.isbn);
  }, [libro, registrarVisita]);

  if (!isbnValido) {
    return (
      <EstadoMensaje
        titulo="ISBN inválido"
        mensaje={`"${isbn}" no es un ISBN. Tiene que tener 13 dígitos, sin guiones.`}
        textoAccion="Ir al catálogo"
        alAccionar={volverAlCatalogo}
      />
    );
  }

  if (cargando) return <EstadoCarga mensaje="Cargando libro..." />;

  if (error) {
    return <EstadoMensaje titulo="Algo salió mal" mensaje={error} textoAccion="Reintentar" alAccionar={reintentar} />;
  }

  if (!libro) {
    return (
      <EstadoMensaje
        titulo="Libro no encontrado"
        mensaje={`No hay ningún libro con ISBN ${isbn} en la biblioteca.`}
        textoAccion="Ir al catálogo"
        alAccionar={volverAlCatalogo}
      />
    );
  }

  const enEspera = listaDeEspera(libro.isbn);
  const cantidadDisponible = disponibles(libro);
  const tienePrestamo = prestamos.some((p) => p.isbn === libro.isbn);
  const posicion = posicionEnEspera(libro.isbn);
  const yaReservado = tienePrestamo || posicion > 0;

  return (
    <ScrollView contentContainerStyle={estilos.contenido}>
      <Stack.Screen options={{ title: libro.titulo }} />

      <View style={estilos.cabecera}>
        <Text style={estilos.titulo}>{libro.titulo}</Text>
        <Text style={estilos.autor}>{libro.autor}</Text>
        <Text style={estilos.dato}>
          Año {libro.anio} · ISBN {libro.isbn}
        </Text>
      </View>

      <Seccion titulo="Disponibilidad">
        <Text style={estilos.dato}>
          {cantidadDisponible > 0
            ? `${cantidadDisponible} de ${libro.ejemplares} ejemplares en el estante`
            : 'No quedan ejemplares en el estante'}
        </Text>
      </Seccion>

      <Seccion titulo="Lista de espera">
        {enEspera.length === 0 ? (
          <Text style={estilos.dato}>Nadie está esperando este libro.</Text>
        ) : (
          enEspera.map((persona, indice) => (
            <Text key={persona} style={estilos.dato}>
              {indice + 1}. {persona}
            </Text>
          ))
        )}
      </Seccion>

      {tienePrestamo ? <Text style={estilos.nota}>Ya tenés este libro prestado.</Text> : null}
      {posicion > 0 ? <Text style={estilos.nota}>Estás en la posición {posicion} de la lista de espera.</Text> : null}

      <Boton
        titulo="Reservar"
        alPresionar={() => router.push(`/reservar/${libro.isbn}`)}
        deshabilitado={yaReservado}
      />
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  contenido: {
    gap: espacio.xl,
    padding: espacio.l,
  },
  cabecera: {
    gap: espacio.xs,
  },
  titulo: {
    fontSize: tipografia.grande,
    fontWeight: '700',
    color: colores.texto,
  },
  autor: {
    fontSize: tipografia.media,
    color: colores.texto,
  },
  dato: {
    fontSize: tipografia.normal,
    color: colores.textoSecundario,
  },
  nota: {
    fontSize: tipografia.normal,
    color: colores.aviso,
  },
});
