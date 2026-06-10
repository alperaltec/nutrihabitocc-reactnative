import { View, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { UserKey, CheckCircle2, XCircle } from 'lucide-react-native';
import { AppTheme } from '../../theme/theme';
import { Controller, useForm } from 'react-hook-form';
import { ForgotPasswordI, forgotpasswordSchema, RecoveryPassword, recoverypasswordScheme } from '../../forms/schemas/forgotpasswordSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import { recoverypasswordApi, sendcorreoforgotpasswordApi } from '../../api/AuthApi';
import CustomInput from '../../components/CustomInput';
import { Button, Text } from 'react-native-paper';
import { scale, verticalScale } from 'react-native-size-matters';
import CustomAlert from '../../components/CustomAlert';

interface AlertConfig {
  visible: boolean;
  title: string;
  description: string;
  type: 'success' | 'error';
  onConfirm: () => void;
}

const ForgotPassword = () => {
  const navigation = useNavigation();
  const [step, setStep] = useState<1 | 2>(1);

  const [alertConfig, setAlertConfig] = useState<AlertConfig>({
    visible: false,
    title: '',
    description: '',
    type: 'success',
    onConfirm: () => {},
  });

  const {
    control: controlEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: errorsEmail }
  } = useForm<ForgotPasswordI>({
    resolver: zodResolver(forgotpasswordSchema)
  });

  const {
    control: controlReset,
    handleSubmit: handleSubmitReset,
    setValue: setValueReset,
    formState: { errors: errorsReset }
  } = useForm<RecoveryPassword>({
    resolver: zodResolver(recoverypasswordScheme),
    defaultValues: {
      code: '',
      password: '',
      password_confirmation: ''
    }
  });

  const { mutateAsync: sendEmailMutate, isPending: isSendingEmail } = useMutation<any, any, ForgotPasswordI>({
    mutationFn: sendcorreoforgotpasswordApi,
    onSuccess: (responseData, variables) => {
      setValueReset('email', variables.email);
      setAlertConfig({
        visible: true,
        title: 'Código Enviado',
        description: 'Revisa tu bandeja de entrada. Te hemos enviado un código de verificación.',
        type: 'success',
        onConfirm: () => {
          setAlertConfig(prev => ({ ...prev, visible: false }));
          setStep(2); 
        }
      });
    },
    onError: (error: any) => {
      setAlertConfig({
        visible: true,
        title: 'Error de Envío',
        description: error?.response?.data?.message || 'No pudimos procesar tu solicitud en este momento. Inténtalo de nuevo.',
        type: 'error',
        onConfirm: () => setAlertConfig(prev => ({ ...prev, visible: false }))
      });
    }
  });

  const { mutateAsync: resetPasswordMutate, isPending: isResettingPassword } = useMutation({
    mutationFn: recoverypasswordApi,
    onSuccess: () => {
      setAlertConfig({
        visible: true,
        title: '¡Contraseña Restablecida!',
        description: 'Tu contraseña ha sido actualizada con éxito. Ya puedes iniciar sesión.',
        type: 'success',
        onConfirm: () => {
          setAlertConfig(prev => ({ ...prev, visible: false }));
          navigation.navigate('Login'); 
        }
      });
    },
    onError: (error: any) => {
      setAlertConfig({
        visible: true,
        title: 'Código Inválido',
        description: error?.response?.data?.message || 'El código ingresado es incorrecto o ya ha expirado.',
        type: 'error',
        onConfirm: () => setAlertConfig(prev => ({ ...prev, visible: false }))
      });
    }
  });


  const onSubmitEmail = async (data: ForgotPasswordI) => {
    try {
      await sendEmailMutate(data);
    } catch (e) {
      console.log(e);
    }
  };

  const onSubmitReset = async (data: RecoveryPassword) => {
    try {
      await resetPasswordMutate(data);
    } catch (e) {
      console.log(e);
    }
  };


  return (
    <View style={style.main}>
      <UserKey size={100} color={AppTheme.primary} style={{ alignSelf: 'center', marginTop: verticalScale(20) }} />
      {
        step === 2 ? (
          <View key="step2" style={style.formContainer}>
            <Controller
              control={controlReset}
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomInput
                  variantText='titleMedium'
                  title='Código de Verificación'
                  placeholder="123456"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  errorText={errorsReset.code?.message}
                />
              )}
              name="code"
            />

            <Controller
              control={controlReset}
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomInput
                  variantText='titleMedium'
                  title='Nueva Contraseña'
                  placeholder="••••••••"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  isPassword={true}
                  errorText={errorsReset.password?.message}
                />
              )}
              name="password"
            />

            <Controller
              control={controlReset}
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomInput
                  variantText='titleMedium'
                  title='Confirmación de Contraseña'
                  placeholder="••••••••"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  isPassword={true}
                  errorText={errorsReset.password_confirmation?.message}
                />
              )}
              name="password_confirmation"
            />

            <Button
              loading={isResettingPassword}
              disabled={isResettingPassword}
              style={style.btn}
              buttonColor={AppTheme.primary}
              mode='contained'
              onPress={handleSubmitReset(onSubmitReset)}
            >
              Restablecer Contraseña
            </Button>
          </View>
        ) : (
          <View key="step1" style={style.formContainer}>
            <Text variant="bodyLarge" style={style.description}>
              Escribe el correo asociado a tu cuenta y te enviaremos un código para que puedas recuperarla de inmediato.
            </Text>

            <Controller
              control={controlEmail}
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomInput
                  variantText='titleMedium'
                  placeholder="ejemplo@dominio.com"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  errorText={errorsEmail.email?.message}
                />
              )}
              name="email"
            />

            <Button
              loading={isSendingEmail}
              disabled={isSendingEmail}
              style={style.btn}
              buttonColor={AppTheme.primary}
              mode='contained'
              onPress={handleSubmitEmail(onSubmitEmail)}
            >
              Enviar Código
            </Button>
          </View>
        )
      }

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

    </View>
  )
}

const style = StyleSheet.create({
  main: {
    backgroundColor: AppTheme.background,
    flex: 1
  },
  formContainer: {
    marginTop: verticalScale(25),
  },
  description: {
    textAlign: 'justify',
    color: AppTheme.primary,
    marginTop: verticalScale(15),
    marginBottom: verticalScale(5),
    paddingHorizontal: scale(20),
  },
  btn: {
    marginHorizontal: scale(50),
    marginTop: verticalScale(20)
  }
})

export default ForgotPassword;