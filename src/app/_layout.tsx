import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { colores } from '@/constants/tema';
import { BibliotecaProvider } from '@/context/BibliotecaContext';
import { useBiblioteca } from '@/hooks/useBiblioteca';
import { configurarNotificaciones } from '@/lib/notificaciones';

configurarNotificaciones();

// Un deep link a /buscar o /escanear deja las pestañas debajo en la pila.
export const unstable_settings = {
  anchor: '(tabs)',
};

const opcionesEncabezado = {
  headerStyle: { backgroundColor: colores.superficie },
  headerTintColor: colores.texto,
  headerBackButtonDisplayMode: 'minimal',
  contentStyle: { backgroundColor: colores.fondo },
} as const;

function PilaRaiz() {
  const { sesionIniciada } = useBiblioteca();

  return (
    <Stack screenOptions={opcionesEncabezado}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="buscar" options={{ title: 'Buscar' }} />
      <Stack.Screen name="escanear" options={{ title: 'Escanear' }} />
      <Stack.Screen name="reservar/[isbn]" options={{ title: 'Confirmar reserva', presentation: 'modal' }} />
      <Stack.Screen name="permisos/[recurso]" options={{ title: 'Permiso', presentation: 'modal' }} />
      <Stack.Screen name="+not-found" options={{ title: 'Página no encontrada' }} />

      <Stack.Protected guard={!sesionIniciada}>
        <Stack.Screen name="login" options={{ title: 'Ingreso del personal', presentation: 'modal' }} />
      </Stack.Protected>

      <Stack.Protected guard={sesionIniciada}>
        <Stack.Screen name="mostrador" options={{ title: 'Mostrador' }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <BibliotecaProvider>
      <StatusBar style="dark" />
      <PilaRaiz />
    </BibliotecaProvider>
  );
}
