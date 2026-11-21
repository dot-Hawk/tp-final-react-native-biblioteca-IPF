import { useCameraPermissions } from 'expo-camera';
import { createPermissionHook } from 'expo';
import * as Notifications from 'expo-notifications';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { AppState, Linking } from 'react-native';

import { crearCanalPrestamos } from '@/lib/notificaciones';
import type { EstadoPermiso, RecursoPermiso } from '@/types';

const usePermisoNotificaciones = createPermissionHook({
  getMethod: Notifications.getPermissionsAsync,
  requestMethod: Notifications.requestPermissionsAsync,
});

type ResultadoUsePermiso = {
  estado: EstadoPermiso;
  pedir: () => Promise<EstadoPermiso>;
  abrirAjustes: () => Promise<void>;
};

function aEstado(respuesta: { granted: boolean; canAskAgain: boolean } | null): EstadoPermiso {
  if (respuesta === null) return 'cargando';
  if (respuesta.granted) return 'concedido';
  // status solo dice "denied"; canAskAgain distingue si todavía se puede preguntar.
  return respuesta.canAskAgain ? 'preguntable' : 'bloqueado';
}

export function usePermiso(recurso: RecursoPermiso): ResultadoUsePermiso {
  const camara = useCameraPermissions({ get: recurso === 'camara' });
  const notificaciones = usePermisoNotificaciones({ get: recurso === 'notificaciones' });
  const [respuesta, pedirAlSistema, consultar] = recurso === 'camara' ? camara : notificaciones;

  // Al volver de Ajustes la app pasa a primer plano: se vuelve a consultar.
  useEffect(() => {
    const suscripcion = AppState.addEventListener('change', (estadoApp) => {
      if (estadoApp === 'active') consultar();
    });
    return () => suscripcion.remove();
  }, [consultar]);

  // Al volver a esta pantalla (por ejemplo, después de la pantalla previa).
  useFocusEffect(
    useCallback(() => {
      consultar();
    }, [consultar]),
  );

  const pedir = useCallback(async () => {
    if (recurso === 'notificaciones') await crearCanalPrestamos();
    return aEstado(await pedirAlSistema());
  }, [recurso, pedirAlSistema]);

  const abrirAjustes = useCallback(() => Linking.openSettings(), []);

  return { estado: aEstado(respuesta), pedir, abrirAjustes };
}
