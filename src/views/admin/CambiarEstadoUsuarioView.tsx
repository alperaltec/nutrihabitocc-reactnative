import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, Card } from 'react-native-paper';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { scale, verticalScale } from 'react-native-size-matters';
import { UserX, UserCheck, CheckCircle2, XCircle } from 'lucide-react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';

import Layout from '../../components/Layout';
import { AppTheme } from '../../theme/theme';
import { modificarestadoUsuario } from '../../api/UserApi';
import CustomAlert from '../../components/CustomAlert';
import { RootStackParamList } from '../../navigation/rootNavigation';

const CambiarEstadoUsuarioView = () => {
  const queryClient = useQueryClient();
  const route = useRoute<RouteProp<RootStackParamList, 'CambiarUsuarioEstado'>>();
  const navigation = useNavigation<any>();

  const { userId, userName, isActive } = route.params || {};

  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    description: '',
    icon: null as React.ReactNode | null,
    onConfirm: () => {},
  });

  const { mutate, isPending } = useMutation({
    mutationFn: modificarestadoUsuario,
    onSuccess: (message) => {
      queryClient.invalidateQueries({ queryKey: ['listadoUsuarios'] });

      setAlertConfig({
        visible: true,
        title: '¡Operación Exitosa!',
        description: message || 'El estado del usuario ha sido modificado correctamente.',
        icon: <CheckCircle2 size={scale(45)} color="#4CAF50" />,
        onConfirm: () => {
          setAlertConfig(prev => ({ ...prev, visible: false }));
          navigation.goBack(); 
        }
      });
    },
    onError: (error: any) => {
      setAlertConfig({
        visible: true,
        title: 'Error en la solicitud',
        description: error.message || 'No se pudo cambiar el estado del usuario.',
        icon: <XCircle size={scale(45)} color="#D32F2F" />,
        onConfirm: () => setAlertConfig(prev => ({ ...prev, visible: false }))
      });
    }
  });

  const handleConfirmAction = () => {
    if (!userId || isPending) return;
    mutate({
      user_id: userId
    });
  };

  const actionColor = isActive ? '#D32F2F' : AppTheme.primary; // Rojo si vas a desactivar, Primario si vas a activar
  const titleText = isActive ? '¿Desactivar cuenta de usuario?' : '¿Activar cuenta de usuario?';
  const descriptionText = isActive 
    ? 'Vas a suspender el acceso al sistema para el siguiente usuario:' 
    : 'Vas a conceder acceso al sistema nuevamente para el siguiente usuario:';

  return (
    <Layout>
      <View style={styles.container}>
        <Card style={styles.card} mode="outlined">
          <Card.Content style={styles.cardContent}>

            <View style={[styles.iconWrapper, { backgroundColor: isActive ? '#FFEBEE' : '#E8F5E9' }]}>
              {isActive ? (
                <UserX color={actionColor} size={scale(40)} />
              ) : (
                <UserCheck color={actionColor} size={scale(40)} />
              )}
            </View>
            
            <Text variant="titleMedium" style={styles.warningTitle}>
              {titleText}
            </Text>
            
            <Text variant="bodyMedium" style={styles.description}>
              {descriptionText}
            </Text>

            <View style={styles.userBadge}>
              <Text variant="bodyLarge" style={styles.username}>
                {userName}
              </Text>
              <Text variant="labelSmall" style={styles.userId}>
                ID de Usuario: #{userId}
              </Text>
              <Text 
                variant="labelSmall" 
                style={[styles.statusBadge, { color: isActive ? '#4CAF50' : '#D32F2F' }]}
              >
                Estado Actual: {isActive ? 'Activo 🟢' : 'Inactivo 🔴'}
              </Text>
            </View>

            <Text variant="bodySmall" style={styles.footnote}>
              {isActive 
                ? 'El usuario no podrá iniciar sesión en la aplicación ni consumir los servicios hasta que sea reactivado.'
                : 'El usuario recuperará de inmediato todos sus accesos normales al sistema.'}
            </Text>
          </Card.Content>
        </Card>

        <View style={styles.actionsContainer}>
          <Button
            mode="contained"
            onPress={handleConfirmAction}
            loading={isPending}
            disabled={isPending}
            style={styles.btnConfirm}
            buttonColor={actionColor}
            labelStyle={styles.btnLabel}
          >
            {isActive ? 'Sí, Desactivar' : 'Sí, Activar'}
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.goBack()}
            disabled={isPending}
            textColor="#6B7280"
            style={styles.btnCancel}
            labelStyle={styles.btnLabel}
          >
            Cancelar
          </Button>
        </View>

        <CustomAlert
          visible={alertConfig.visible}
          title={alertConfig.title}
          description={alertConfig.description}
          icon={alertConfig.icon}
          onConfirm={alertConfig.onConfirm}
        />

      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(20),
    flex: 1,
    justifyContent: 'flex-start', 
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: scale(16),
    borderColor: '#E5E7EB',
    borderWidth: 1,
    elevation: 0,
  },
  cardContent: {
    alignItems: 'center',
    paddingVertical: verticalScale(20),
  },
  iconWrapper: {
    padding: scale(15),
    borderRadius: scale(50),
    marginBottom: verticalScale(15),
  },
  warningTitle: {
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: verticalScale(10),
  },
  description: {
    color: '#4B5563',
    textAlign: 'center',
    paddingHorizontal: scale(10),
    lineHeight: verticalScale(18),
  },
  userBadge: {
    backgroundColor: '#F9FAFB',
    borderRadius: scale(12),
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(20),
    width: '100%',
    alignItems: 'center',
    marginVertical: verticalScale(15),
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  username: {
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  userId: {
    color: '#9CA3AF',
    marginTop: verticalScale(2),
  },
  statusBadge: {
    fontWeight: '600',
    marginTop: verticalScale(4),
  },
  footnote: {
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: scale(15),
    lineHeight: verticalScale(14),
  },
  actionsContainer: {
    marginTop: verticalScale(25),
    gap: verticalScale(8),
  },
  btnConfirm: {
    borderRadius: scale(12),
    paddingVertical: verticalScale(4),
  },
  btnCancel: {
    borderRadius: scale(12),
    paddingVertical: verticalScale(4),
  },
  btnLabel: {
    fontWeight: 'bold',
    fontSize: scale(14),
  },
});

export default CambiarEstadoUsuarioView;