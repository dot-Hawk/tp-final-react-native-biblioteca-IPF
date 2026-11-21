import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Boton } from '@/components/Boton';
import { CampoTexto } from '@/components/CampoTexto';
import { colores, espacio, tipografia } from '@/constants/tema';
import { useBiblioteca } from '@/hooks/useBiblioteca';

export default function Login() {
  const { iniciarSesion } = useBiblioteca();
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState<string | null>(null);

  function ingresar() {
    // Al iniciar sesión, Stack.Protected saca esta pantalla de la pila.
    if (!iniciarSesion(usuario, clave)) {
      setError('Usuario o clave incorrectos.');
    }
  }

  return (
    <View style={estilos.contenido}>
      <Text style={estilos.explicacion}>Acceso exclusivo para el personal de la biblioteca.</Text>
      <CampoTexto
        etiqueta="Usuario"
        value={usuario}
        onChangeText={setUsuario}
        autoCapitalize="none"
        autoCorrect={false}
        textContentType="username"
      />
      <CampoTexto
        etiqueta="Clave"
        value={clave}
        onChangeText={setClave}
        secureTextEntry
        textContentType="password"
        onSubmitEditing={ingresar}
      />
      {error ? (
        <Text style={estilos.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}
      <Boton titulo="Ingresar" alPresionar={ingresar} deshabilitado={usuario === '' || clave === ''} />
    </View>
  );
}

const estilos = StyleSheet.create({
  contenido: {
    flex: 1,
    gap: espacio.l,
    padding: espacio.xl,
  },
  explicacion: {
    fontSize: tipografia.normal,
    color: colores.textoSecundario,
  },
  error: {
    fontSize: tipografia.normal,
    color: colores.peligro,
  },
});
