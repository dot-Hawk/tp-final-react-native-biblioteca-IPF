import { Stack } from 'expo-router';

import { EnlacePersonal } from '@/components/EnlacePersonal';
import { colores } from '@/constants/tema';

// Si se entra directo a /libro/[isbn], atrás vuelve al Catálogo.
export const unstable_settings = {
  anchor: 'index',
};

export default function CatalogoLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colores.superficie },
        headerTintColor: colores.texto,
        headerBackButtonDisplayMode: 'minimal',
        contentStyle: { backgroundColor: colores.fondo },
      }}>
      <Stack.Screen name="index" options={{ title: 'Catálogo', headerRight: EnlacePersonal }} />
      <Stack.Screen name="libro/[isbn]" options={{ title: 'Libro' }} />
    </Stack>
  );
}
