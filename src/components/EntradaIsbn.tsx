import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Boton } from '@/components/Boton';
import { CampoTexto } from '@/components/CampoTexto';
import { espacio } from '@/constants/tema';
import { limpiarIsbn } from '@/lib/isbn';

type Props = {
  alConfirmar: (isbn: string) => void;
};

export function EntradaIsbn({ alConfirmar }: Props) {
  const [texto, setTexto] = useState('');

  function confirmar() {
    alConfirmar(limpiarIsbn(texto));
  }

  return (
    <View style={estilos.contenedor}>
      <CampoTexto
        etiqueta="O escribí el ISBN (13 dígitos)"
        value={texto}
        onChangeText={setTexto}
        keyboardType="number-pad"
        maxLength={17}
        returnKeyType="search"
        onSubmitEditing={confirmar}
        placeholder="9789500441001"
      />
      <Boton titulo="Abrir libro" alPresionar={confirmar} variante="secundario" deshabilitado={texto.trim() === ''} />
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    gap: espacio.s,
  },
});
