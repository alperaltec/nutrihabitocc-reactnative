import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { scale, verticalScale } from 'react-native-size-matters';
import { Save, CheckCircle2, XCircle } from 'lucide-react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppTheme } from '../../theme/theme';
import Layout from '../../components/Layout';
import CustomAlert from '../../components/CustomAlert';
import { InputField } from '../../components/CustomComponentsForm';
import { actualizarDatosPersonales } from '../../api/UserApi'; 

const EditarPerfilConfigView = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const { userId, name, lastName, email, phone } = route.params;

  const [form, setForm] = useState({
    name: name || '',
    last_name: lastName || '',
    email: email || '',
    phone: phone || ''
  });


  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    description: '',
    icon: null as React.ReactNode | null,
    confirmText: 'Aceptar',
    shouldGoBack: false
  });

  const { mutate: guardarCambios, isPending } = useMutation({
    mutationFn: actualizarDatosPersonales,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['detalleWorkspace'] });
      
      setAlertConfig({
        visible: true,
        title: '¡Perfil Actualizado!',
        description: 'Tus datos de contacto han sido modificados de forma exitosa.',
        icon: <CheckCircle2 size={scale(45)} color="#4CAF50" />,
        confirmText: 'Aceptar',
        shouldGoBack: true 
      });
    },
    onError: (err: any) => {
      setAlertConfig({
        visible: true,
        title: 'Error al Actualizar',
        description: err.message || 'No se pudieron almacenar los cambios.',
        icon: <XCircle size={scale(45)} color={AppTheme.error} />,
        confirmText: 'Reintentar',
        shouldGoBack: false 
      });
    }
  });

  const handleSave = () => {
    guardarCambios({
      user_id: userId,
      name: form.name,
      last_name: form.last_name,
      email: form.email,
      phone_number: form.phone 
    });
  };

  return (
    <Layout>
      <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right']}>
        <KeyboardAwareScrollView 
          contentContainerStyle={styles.scrollContainer} 
          enableOnAndroid={true} 
          extraScrollHeight={100}
          showsVerticalScrollIndicator={false}
        >
          <InputField 
            label="Nombre" 
            value={form.name} 
            onChangeText={(t: string) => setForm(p => ({ ...p, name: t }))} 
          />
          <InputField 
            label="Apellido" 
            value={form.last_name} 
            onChangeText={(t: string) => setForm(p => ({ ...p, last_name: t }))} 
          />
          <InputField 
            label="Correo Electrónico" 
            value={form.email} 
            keyboardType="email-address" 
            onChangeText={(t: string) => setForm(p => ({ ...p, email: t }))} 
          />
          <InputField 
            label="Número de Teléfono" 
            value={form.phone} 
            keyboardType="phone-pad" 
            onChangeText={(t: string) => setForm(p => ({ ...p, phone: t }))} 
          />

          <Button
            mode="contained"
            loading={isPending}
            icon={() => <Save size={scale(18)} color="#FFFFFF" />}
            onPress={handleSave}
            style={styles.btnSave}
          >
            Guardar Cambios
          </Button>
        </KeyboardAwareScrollView>

        <CustomAlert 
          visible={alertConfig.visible}
          title={alertConfig.title}
          description={alertConfig.description}
          icon={alertConfig.icon}
          confirmText={alertConfig.confirmText}
          onConfirm={() => {
            setAlertConfig(p => ({ ...p, visible: false }));
            if (alertConfig.shouldGoBack) {
              navigation.goBack();
            }
          }} 
        />
      </SafeAreaView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { padding: scale(15) },
  btnSave: { borderRadius: scale(12), paddingVertical: verticalScale(4), marginTop: verticalScale(20) }
});

export default EditarPerfilConfigView;