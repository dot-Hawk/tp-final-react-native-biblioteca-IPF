import { CameraView, type BarcodeScanningResult } from 'expo-camera';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Boton } from '@/components/Boton';
import { EntradaIsbn } from '@/components/EntradaIsbn';
import { EstadoCarga } from '@/components/EstadoCarga';
import { colores, espacio, radio, tipografia } from '@/constants/tema';
import { useLibros } from '@/hooks/useLibros';
import { usePermiso } from '@/hooks/usePermiso';
import { esIsbnValido } from '@/lib/isbn';

const AJUSTES_ESCANER = { barcodeTypes: ['ean13' as const] };

function abrirPantallaPrevia() {
  router.push('/permisos/camara');
}

export default function Escanear() {
  const { estado } = usePermiso('camara');
  const { libros, cargando, error, reintentar } = useLibros();
  const [mensaje, setMensaje] = useState<string | null>(null);

  // useRef y no useState: el cambio tiene que verse en la próxima llamada
  // de onBarcodeScanned, aunque todavía no haya ocurrido un nuevo render.
  const navegando = useRef(false);
  const ultimoDesconocido = useRef<string | null>(null);

  function abrirIsbn(isbn: string, desdeCamara: boolean) {
    if (navegando.current) return;

    if (!esIsbnValido(isbn)) {
      if (!desdeCamara) setMensaje('El ISBN tiene que tener 13 dígitos, sin letras.');
      return;
    }

    // Si el catálogo no cargó, el ISBN escrito a mano lo valida el detalle.
    const catalogoListo = !cargando && !error;
    if (catalogoListo && !libros.some((libro) => libro.isbn === isbn)) {
      // Evita repetir el mismo aviso mientras el código sigue frente a la cámara.
      if (desdeCamara && ultimoDesconocido.current === isbn) return;
      ultimoDesconocido.current = isbn;
      setMensaje(`El ISBN ${isbn} no está en el catálogo. Probá con otro libro.`);
      return;
    }

    navegando.current = true;
    router.dismissTo(`/libro/${isbn}`);
  }

  function alEscanear({ data }: BarcodeScanningResult) {
    if (cargando || error) return;
    abrirIsbn(data, true);
  }

  return (
    <ScrollView contentContainerStyle={estilos.contenido} keyboardShouldPersistTaps="handled">
      {estado === 'cargando' ? <EstadoCarga mensaje="Consultando permiso de cámara..." /> : null}

      {estado === 'concedido' ? (
        <View style={estilos.marcoCamara}>
          <CameraView
            style={estilos.camara}
            facing="back"
            barcodeScannerSettings={AJUSTES_ESCANER}
            onBarcodeScanned={alEscanear}
          />
        </View>
      ) : null}

      {estado === 'preguntable' ? (
        <View style={estilos.bloque}>
          <Text style={estilos.texto}>Para leer el código de barras necesitamos usar la cámara.</Text>
          <Boton titulo="Usar la cámara" alPresionar={abrirPantallaPrevia} />
        </View>
      ) : null}

      {estado === 'bloqueado' ? (
        <View style={estilos.bloque}>
          <Text style={estilos.texto}>
            La cámara está desactivada para esta app. Podés habilitarla en Ajustes o escribir el ISBN.
          </Text>
          <Boton titulo="Cómo habilitarla" alPresionar={abrirPantallaPrevia} variante="secundario" />
        </View>
      ) : null}

      {estado === 'concedido' && error ? (
        <View style={estilos.bloque}>
          <Text style={estilos.texto}>No pudimos cargar el catálogo para validar el código.</Text>
          <Boton titulo="Reintentar" alPresionar={reintentar} variante="secundario" />
        </View>
      ) : null}

      {mensaje ? (
        <Text style={estilos.mensaje} accessibilityLiveRegion="polite">
          {mensaje}
        </Text>
      ) : null}

      <EntradaIsbn alConfirmar={(isbn) => abrirIsbn(isbn, false)} />
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  contenido: {
    gap: espacio.l,
    padding: espacio.l,
  },
  marcoCamara: {
    height: 280,
    overflow: 'hidden',
    borderRadius: radio.m,
    backgroundColor: colores.texto,
  },
  camara: {
    flex: 1,
  },
  bloque: {
    gap: espacio.m,
  },
  texto: {
    fontSize: tipografia.normal,
    color: colores.texto,
  },
  mensaje: {
    padding: espacio.m,
    borderRadius: radio.s,
    backgroundColor: colores.avisoFondo,
    fontSize: tipografia.normal,
    color: colores.aviso,
  },
});
