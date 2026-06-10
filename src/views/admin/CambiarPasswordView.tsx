import React, { ReactNode, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useMutation } from '@tanstack/react-query';
import { scale, verticalScale } from 'react-native-size-matters';
import { KeyRound, CheckCircle2, XCircle } from 'lucide-react-native'; // Íconos para la alerta
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';

import Layout from '../../components/Layout';
import { AppTheme } from '../../theme/theme';
import { resetpassword } from '../../api/UserApi';
import CustomInput from '../../components/CustomInput';
import CustomAlert from '../../components/CustomAlert'; 
import { RootStackParamList } from '../../navigation/rootNavigation';

const CambiarPasswordView = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'CambiarPassword'>>();
  const navigation = useNavigation();

  const { userId, userName } = route.params || {};

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    description: '',
    icon: null as ReactNode | null,
    onConfirm: () => {},
  });

  const { mutate, isPending } = useMutation({
    mutationFn: resetpassword,
    onSuccess: () => {
      setAlertConfig({
        visible: true,
        title: '¡Clave Actualizada!',
        description: 'La contraseña ha sido modificada con éxito de manera segura.',
        icon: <CheckCircle2 size={scale(45)} color="#4CAF50" />, // Verde éxito
        onConfirm: () => {
          setAlertConfig(prev => ({ ...prev, visible: false }));
          navigation.goBack(); 
        }
      });
    },
    onError: (error: any) => {
      setAlertConfig({
        visible: true,
        title: 'Error de Actualización',
        description: error.message || 'No se pudo procesar el cambio de contraseña en este momento.',
        icon: <XCircle size={scale(45)} color="#D32F2F" />, // Rojo error
        onConfirm: () => setAlertConfig(prev => ({ ...prev, visible: false })) 
      });
    }
  });

  const isPasswordShort = password.length > 0 && password.length < 6;
  const passwordsMatch = password === confirmPassword;
  const showConfirmError = password.length >= 6 && confirmPassword.length > 0 && !passwordsMatch;
  const canSubmit = password.length >= 6 && passwordsMatch && !isPending;

  const handleSubmit = () => {
    if (!userId) {
      setAlertConfig({
        visible: true,
        title: 'Atención',
        description: 'ID de usuario inválido o no encontrado en la sesión.',
        icon: <XCircle size={scale(45)} color="#D32F2F" />,
        onConfirm: () => setAlertConfig(prev => ({ ...prev, visible: false }))
      });
      return;
    }
    
    mutate({ user_id: userId, password: password });
  };

  return (
    <Layout>
        <View style={styles.header}>
          <KeyRound color={AppTheme.primary} size={scale(40)} />
          <Text variant="titleLarge" style={styles.title}>Nueva Contraseña</Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Vas a cambiar la clave de acceso para:{"\n"}
            <Text style={styles.username}>{userName}</Text>
          </Text>
        </View>

        <CustomInput
          title="Nueva Contraseña"
          variantText="bodyLarge"
          placeholder="Escribe la nueva contraseña"
          value={password}
          onChangeText={setPassword}
          isPassword={true}
          errorText={isPasswordShort ? "La contraseña debe tener al menos 6 caracteres." : undefined}
        />

        <CustomInput
          title="Confirmar Contraseña"
          variantText="bodyLarge"
          placeholder="Repite la contraseña"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          isPassword={true}
          errorText={showConfirmError ? "Las contraseñas no coinciden." : undefined}
        />

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={isPending}
          disabled={!canSubmit}
          style={styles.btn}
          buttonColor={AppTheme.primary}
          labelStyle={styles.btnLabel}
        >
          Actualizar Contraseña
        </Button>

        <CustomAlert
          visible={alertConfig.visible}
          title={alertConfig.title}
          description={alertConfig.description}
          icon={alertConfig.icon}
          onConfirm={alertConfig.onConfirm}
        />
    </Layout>
  );
};

const styles = StyleSheet.create({
  header: { 
    alignItems: 'center', 
    marginBottom: verticalScale(20) 
  },
  title: { 
    fontWeight: 'bold', 
    color: '#1F2937', 
    marginTop: verticalScale(10) 
  },
  subtitle: { 
    color: '#6B7280', 
    textAlign: 'center', 
    marginTop: verticalScale(5), 
    lineHeight: verticalScale(18)
   },
  username: { 
    fontWeight: 'bold', 
    color: '#1F2937' 
  },
  btn: { 
    marginTop: verticalScale(20), 
    marginHorizontal: scale(20), 
    borderRadius: scale(12), 
    paddingVertical: verticalScale(4)
   },
  btnLabel: { 
    fontWeight: 'bold', 
    fontSize: scale(14)
   }
});

export default CambiarPasswordView;