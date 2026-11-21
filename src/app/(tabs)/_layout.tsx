import { Tabs } from 'expo-router';

import { IconoPestania } from '@/components/IconoPestania';
import { colores } from '@/constants/tema';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colores.primario,
        tabBarInactiveTintColor: colores.textoSecundario,
        tabBarStyle: { backgroundColor: colores.superficie },
        headerStyle: { backgroundColor: colores.superficie },
        headerTintColor: colores.texto,
        sceneStyle: { backgroundColor: colores.fondo },
      }}>
      <Tabs.Screen
        name="(catalogo)"
        options={{
          title: 'Catálogo',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <IconoPestania nombre="library-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="reservas"
        options={{
          title: 'Mis reservas',
          tabBarIcon: ({ color, size }) => <IconoPestania nombre="bookmark-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
