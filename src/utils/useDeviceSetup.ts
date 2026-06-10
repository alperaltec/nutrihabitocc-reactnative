import { Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { requestPermission, getToken } from '@react-native-firebase/messaging';
import * as Device from 'expo-device';
import { useAuthStore } from '../store/useAuthStore';
import { URLS } from '../api/Url';
import { api } from '../api/AxiosInterceptor';


export const useDeviceSetup = () => {
  const user = useAuthStore((state) => state.user);

  const registrarDispositivoEnBackend = async () => {
    if (!user?.id) return;

    try {
      const messagingInstance = messaging();
      const authStatus = await requestPermission(messagingInstance);
      const tienePermisos = authStatus === 1 || authStatus === 2;

      if (!tienePermisos) {
        console.log('Permisos de notificación denegados por el usuario');
        return;
      }

      const fcmToken = await getToken(messagingInstance);

      if (!fcmToken) {
        console.log('No se pudo generar el token de Firebase');
        return;
      }

      const deviceType = `${Device.brand || Platform.OS} ${Device.modelName || ''}`.trim();
      const deviceOs = Platform.OS === 'ios' ? 'ios' : 'android';

      const payload = {
        device_token: fcmToken,
        device_type: deviceType,
        device_os: deviceOs,
        user_id: user.id,
      };

      await api.post(URLS.USER.NOTIFICACIONES, payload);

      console.log('Dispositivo registrado y sincronizado en Nutrihabitocc usando la instancia global');
    } catch (error) {
      console.error('Error al sincronizar el dispositivo con el backend:', error);
    }
  };

  return { registrarDispositivoEnBackend };
};