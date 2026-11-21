import * as Notifications from 'expo-notifications';
import { AndroidImportance } from 'expo-notifications';
import { Platform } from 'react-native';

import { CANAL_PRESTAMOS, SEGUNDOS_RECORDATORIO_DEMO } from '@/constants/biblioteca';

export function configurarNotificaciones(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

/**
 * En Android 13+ el diálogo del sistema aparece recién cuando existe un canal,
 * por eso se crea antes de pedir el permiso.
 */
export async function crearCanalPrestamos(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(CANAL_PRESTAMOS, {
    name: 'Préstamos',
    description: 'Recordatorios de devolución y libros listos para retirar',
    importance: AndroidImportance.DEFAULT,
  });
}

export async function tienePermisoNotificaciones(): Promise<boolean> {
  const respuesta = await Notifications.getPermissionsAsync();
  return respuesta.granted;
}

export async function programarRecordatorio(titulo: string): Promise<string> {
  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'Devolución pendiente',
      body: `Recordá devolver "${titulo}" a la biblioteca.`,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: SEGUNDOS_RECORDATORIO_DEMO,
      channelId: CANAL_PRESTAMOS,
    },
  });
}

export async function cancelarRecordatorio(id: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(id);
}

export async function avisarLibroDisponible(titulo: string): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Tu libro está listo',
      body: `Ya podés retirar "${titulo}" en el mostrador.`,
    },
    trigger: Platform.OS === 'android' ? { channelId: CANAL_PRESTAMOS } : null,
  });
}
