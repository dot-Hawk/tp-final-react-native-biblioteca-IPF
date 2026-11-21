import { router, usePathname } from 'expo-router';

import { EstadoMensaje } from '@/components/EstadoMensaje';

export default function NoEncontrada() {
  const ruta = usePathname();

  return (
    <EstadoMensaje
      titulo="Esta página no existe"
      mensaje={`No hay nada en la dirección ${ruta}.`}
      textoAccion="Ir al catálogo"
      alAccionar={() => router.replace('/')}
    />
  );
}
