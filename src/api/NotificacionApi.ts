import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { onMessage, setBackgroundMessageHandler } from '@react-native-firebase/messaging'; 
import notifee, { AndroidImportance, AndroidVisibility } from '@notifee/react-native';

async function mostrarNotificacionLocal(remoteMessage: FirebaseMessagingTypes.RemoteMessage) {
  const { data, notification } = remoteMessage;
  const tituloFinal = data?.title || notification?.title;
  const cuerpoFinal = data?.body || notification?.body;

  if (!tituloFinal || !cuerpoFinal) {
    console.log('Notificación omitida: No se encontró title o body en el payload.');
    return;
  }

  const stringTitle = typeof tituloFinal === 'string' ? tituloFinal : JSON.stringify(tituloFinal);
  const stringBody = typeof cuerpoFinal === 'string' ? cuerpoFinal : JSON.stringify(cuerpoFinal);

  // Creación o lectura del canal de alta prioridad
  const channelId = await notifee.createChannel({
    id: 'nutrihabitocc-recordatorios',
    name: 'Recordatorios de Planes',
    importance: AndroidImportance.HIGH,
    visibility: AndroidVisibility.PUBLIC,
    sound: 'default',
  });


  await notifee.displayNotification({
    title: stringTitle,
    body: stringBody,
    data: data as any, 
    android: {
      channelId,
      importance: AndroidImportance.HIGH,
      smallIcon: 'ic_launcher',
      color: '#FFFFFF',
      pressAction: { id: 'default' },
    },
    ios: {
      critical: true,
      foregroundPresentationOptions: {
        badge: true,
        sound: true,
        banner: true,
      },
    },
  });
}

export function registerNotificationListeners() {
  const messagingInstance = messaging();
  onMessage(messagingInstance, async (remoteMessage) => {
    console.log('Notificación recibida en primer plano:', remoteMessage);
    await mostrarNotificacionLocal(remoteMessage);
  });

  setBackgroundMessageHandler(messagingInstance, async (remoteMessage) => {
    console.log('Notificación recibida en segundo plano:', remoteMessage);
    await mostrarNotificacionLocal(remoteMessage);
    return Promise.resolve();
  });
}