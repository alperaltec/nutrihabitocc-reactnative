import { View, StyleSheet, TouchableOpacity, Linking } from 'react-native'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Register, registerSchema } from '../../forms/schemas/registerSchema'
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { registerApi } from '../../api/AuthApi';
import { Button, Text, Checkbox } from 'react-native-paper';
import CustomInput from '../../components/CustomInput';
import { AppTheme } from '../../theme/theme';
import LayoutRegister from '../../components/LayoutRegister';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { scale, verticalScale } from 'react-native-size-matters';
import CustomAlert from '../../components/CustomAlert';
import { CheckCircle2, XCircle } from 'lucide-react-native';
import { useAuthStore } from '../../store/useAuthStore';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

interface AlertConfig {
  visible: boolean;
  title: string;
  description: string;
  type: 'success' | 'error';
  onConfirm: () => void;
}

const RegisterView = () => {
  const setSession = useAuthStore((state) => state.setSession);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets(); 

  const [alertConfig, setAlertConfig] = useState<AlertConfig>({
    visible: false,
    title: '',
    description: '',
    type: 'success',
    onConfirm: () => {},
  });

  const { control, handleSubmit, formState: { errors } } = useForm<Register>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      accepted_terms: false as unknown as true
    }
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: registerApi,
    onSuccess: (authData) => {
      setSession(authData.access_token, authData.user, authData.role);
      setAlertConfig({
        visible: true,
        title: '¡Registro Exitoso!',
        description: 'Tu cuenta ha sido creada correctamente. Bienvenido a Nutrihabitocc.',
        type: 'success',
        onConfirm: () => {
          setAlertConfig(prev => ({ ...prev, visible: false }));
        }
      });
    },
    onError: (error: any) => {
      setAlertConfig({
        visible: true,
        title: 'Error de Registro',
        description: error.message || 'Ocurrió un problema inesperado. Por favor, inténtalo de nuevo.',
        type: 'error',
        onConfirm: () => setAlertConfig(prev => ({ ...prev, visible: false }))
      });
    }
  });

  const onSubmit = async (data: Register) => {
    try {
      await mutateAsync(data)
    } catch (e) {
      console.log("Submit Catch:", e)
    }
  };

  const openTerminos = () => {
    navigation.navigate('TerminosCondiciones')
  };

  const openPrivacidad = () => {
    navigation.navigate('PoliticaPrivacidad')
  };

  return (
    <LayoutRegister>
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <KeyboardAwareScrollView
          enableOnAndroid={true}
          extraScrollHeight={80}
          enableAutomaticScroll={true}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps='handled' 
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: verticalScale(20) }}
        >
          <View style={styles.formContainer}>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomInput variantText='titleMedium' title='Nombres' placeholder="" onBlur={onBlur} onChangeText={onChange} value={value} errorText={errors.name?.message} />
              )}
              name="name"
            />
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomInput variantText='titleMedium' title='Apellidos' placeholder="" onBlur={onBlur} onChangeText={onChange} value={value} errorText={errors.last_name?.message} />
              )}
              name="last_name"
            />
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomInput variantText='titleMedium' title='Correo' placeholder="ejemplo@dominio.com" onBlur={onBlur} onChangeText={onChange} value={value} errorText={errors.email?.message} />
              )}
              name="email"
            />
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomInput variantText='titleMedium' title='Teléfono' placeholder="0995667688" onBlur={onBlur} onChangeText={onChange} value={value} errorText={errors.phone_number?.message} />
              )}
              name="phone_number"
            />
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomInput variantText='titleMedium' title='Contraseña' placeholder="" onBlur={onBlur} onChangeText={onChange} value={value} isPassword={true} errorText={errors.password?.message} />
              )}
              name="password"
            />
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomInput variantText='titleMedium' title='Confirmación de Contraseña' placeholder="" onBlur={onBlur} onChangeText={onChange} value={value} isPassword={true} errorText={errors.password_confirmation?.message} />
              )}
              name="password_confirmation"
            />

            <View style={styles.termsContainer}>
              <Controller
                control={control}
                name="accepted_terms"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.checkboxRow}>
                    <Checkbox.Android
                      status={value ? 'checked' : 'unchecked'}
                      onPress={() => onChange(!value)}
                      color={AppTheme.primary}
                      uncheckedColor={errors.accepted_terms ? AppTheme.error : '#757575'}
                    />
                    <Text style={styles.termsText}>
                      Acepto los{' '}
                      <Text onPress={openTerminos} style={styles.linkText}>
                        Términos y Condiciones
                      </Text>{' '}
                      y las{' '}
                      <Text onPress={openPrivacidad} style={styles.linkText}>
                        Políticas de Privacidad
                      </Text>
                    </Text>
                  </View>
                )}
              />
              {errors.accepted_terms && (
                <Text style={styles.errorText}>{errors.accepted_terms.message}</Text>
              )}
            </View>

            <Button 
              loading={isPending}
              disabled={isPending}
              style={styles.btn} 
              buttonColor={AppTheme.primary} 
              rippleColor={"transparent"} 
              mode='contained' 
              onPress={handleSubmit(onSubmit)}
            >
              Registrarse
            </Button>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>

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
    </LayoutRegister>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  formContainer: {
    marginTop: verticalScale(10)
  },
  btn: {
    marginHorizontal: scale(85),
    marginTop: verticalScale(15)
  },
  termsContainer: {
    paddingHorizontal: scale(15),
    marginVertical: verticalScale(10),
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  termsText: {
    fontSize: scale(11),
    color: '#424242',
    flex: 1,
    flexWrap: 'wrap',
  },
  linkText: {
    color: AppTheme.primary,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  errorText: {
    color: AppTheme.error || '#D32F2F',
    fontSize: scale(10),
    marginLeft: scale(8),
    marginTop: verticalScale(2),
  },
});

export default RegisterView;