import { View, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Camera, CheckCircle2, UserRound, XCircle } from 'lucide-react-native';
import { Controller, useForm } from 'react-hook-form';
import { Login, loginSchema } from '../../forms/schemas/loginSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loginApi } from '../../api/AuthApi';
import CustomInput from '../../components/CustomInput';
import { AppTheme } from '../../theme/theme';
import { Button, HelperText, Text } from 'react-native-paper';
import { s, scale, verticalScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import LayoutAuth from '../../components/LayoutAuth';
import CustomAlert from '../../components/CustomAlert';
import { useAuthStore } from '../../store/useAuthStore';

interface AlertConfig {
  visible: boolean;
  title: string;
  description: string;
  type: 'success' | 'error';
  onConfirm: () => void;
}

const LoginView = () => {
  const navigation = useNavigation();
  const setSession = useAuthStore((state) => state.setSession);
  const { control, handleSubmit, formState: { errors } } = useForm<Login>({
    resolver: zodResolver(loginSchema)
  })

  const [alertConfig, setAlertConfig] = useState<AlertConfig>({
    visible: false,
    title: '',
    description: '',
    type: 'success',
    onConfirm: () => {},
  });

  const { mutateAsync, isPending, data, error } = useMutation({
    mutationFn: loginApi,
    onSuccess: (authData)=>{
      setSession(authData.access_token, authData.user, authData.role);
    },
    onError: (error: any) => {
      console.error("Error al iniciar sesión:", error.message);
      setAlertConfig({
        visible: true,
        title: 'Fallo de Autenticación',
        description: error.message || 'El correo o la contraseña son incorrectos. Por favor, verifica tus datos.',
        type: 'error',
        onConfirm: () => setAlertConfig(prev => ({ ...prev, visible: false }))
      });
    }
  })

  const onSubmit = async (data: Login) => {
    try {
      await mutateAsync(data)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <LayoutAuth>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (

          <CustomInput
            variantText='titleMedium'
            title='Correo'
            placeholder="ejemplo@dominio.com"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            errorText={errors.email?.message}
          />
        )}
        name="email"
      />
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <CustomInput
            variantText='titleMedium'
            title='Contraseña'
            placeholder="contraseña"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            isPassword={true}
            errorText={errors.password?.message}
          />
        )}
        name="password"
      />
      <Button mode='text' rippleColor={"transparent"} onPress={() => navigation.navigate('ForgotPassword')} style={styles.buttonForgotPassword}>
        <Text style={styles.textCustom}>
            Olvidaste la contraseña?
          </Text>
      </Button>
      <Button mode="contained" buttonColor={AppTheme.primary} disabled={isPending} loading={isPending} onPress={handleSubmit(onSubmit)} style={styles.buttonLogin}>
        Iniciar Sesión
      </Button>
      <View style={styles.containerRegister}>
        <Text style={{ fontSize: scale(11), color: AppTheme.primary }}>
          Necesitas una cuenta?
        </Text>
        <Button mode='text' rippleColor={"transparent"} onPress={()=>navigation.navigate('Register')} style={{ alignSelf: 'center' }}>
          <Text style={styles.textCustom}>
            Registrarse
          </Text>
        </Button>
      </View>
      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        description={alertConfig.description}
        onConfirm={alertConfig.onConfirm}
        confirmText="Entendido"
        icon={
          alertConfig.type === 'success' ? (
            <CheckCircle2 size={55} color={AppTheme.primary} />
          ) : (
            <XCircle size={55} color={AppTheme.error} />
          )
        }
      />
    </LayoutAuth>
  )
}

const styles = StyleSheet.create({
  buttonLogin: {
    marginHorizontal: scale(85)
  },
  buttonForgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: verticalScale(12),
    marginRight: scale(15),
  },
  containerRegister: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center'
  },
  textCustom: {
    fontSize: scale(11), 
    color: AppTheme.primary,
    fontWeight: 'bold' 
  }
})

export default LoginView