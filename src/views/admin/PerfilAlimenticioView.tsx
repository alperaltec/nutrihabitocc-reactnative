import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Button, Text, Card } from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { scale, verticalScale } from 'react-native-size-matters';
import { FileHeart, CheckCircle2, XCircle } from 'lucide-react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { AppTheme } from '../../theme/theme';
import CustomInput from '../../components/CustomInput';
import CustomAlert from '../../components/CustomAlert';
import { obtenerperfil, crearmodificarperfil } from '../../api/UserApi';
import { RootStackParamList } from '../../navigation/rootNavigation';
import CustomSelect, { GeneroValue } from '../../components/CustomSelect';

const PerfilAlimenticioView = () => {
  const queryClient = useQueryClient();
  const route = useRoute<RouteProp<RootStackParamList, 'Perfil'>>();
  const { userId, userName } = route.params || {};
  const insets = useSafeAreaInsets();

  let tabBarHeight = 0;
  try {
    tabBarHeight = useBottomTabBarHeight();
  } catch (error) {
    tabBarHeight = 0;
  }

  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [grasaCorporal, setGrasaCorporal] = useState('');
  const [masaMuscular, setMasaMuscular] = useState('');

  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    description: '',
    icon: null as React.ReactNode | null,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['perfilUsuario', userId],
    queryFn: () => obtenerperfil({ user_id: userId }),
    enabled: !!userId,
  });

  useEffect(() => {
    if (data) {
      const perfil = (data as any).perfil !== undefined ? (data as any).perfil : data;
      if (perfil) {
        setHeight(perfil.height ? String(perfil.height) : '');
        setWeight(perfil.weight ? String(perfil.weight) : '');
        setBirthDate(perfil.birth_date || '');
        setGender(perfil.gender || '');
        setGrasaCorporal(perfil.grasa_corporal ? String(perfil.grasa_corporal) : '');
        setMasaMuscular(perfil.masa_muscular ? String(perfil.masa_muscular) : '');
      }
    }
  }, [data]);

  const { mutate, isPending: isSaving } = useMutation({
    mutationFn: crearmodificarperfil,
    onSuccess: (message) => {
      queryClient.invalidateQueries({ queryKey: ['perfilUsuario', userId] });
      setAlertConfig({
        visible: true,
        title: '¡Datos Guardados!',
        description: message || 'El perfil antropométrico del usuario ha sido actualizado.',
        icon: <CheckCircle2 size={scale(45)} color="#4CAF50" />,
      });
    },
    onError: (error: any) => {
      setAlertConfig({
        visible: true,
        title: 'Error de Guardado',
        description: error.message || 'Ocurrió un problema al procesar el perfil.',
        icon: <XCircle size={scale(45)} color="#D32F2F" />,
      });
    },
  });

  const handleSaveProfile = () => {
    if (!userId || isSaving) return;
    mutate({
      user_id: userId,
      height: Number(height),
      weight: Number(weight),
      birth_date: birthDate,
      gender: gender,
      grasa_corporal: Number(grasaCorporal),
      masa_muscular: Number(masaMuscular),
    });
  };

  const isFormValid = height.length > 0 && weight.length > 0 && !isSaving;

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={AppTheme.primary} />
        <Text style={styles.loadingText}>Cargando expediente técnico...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <XCircle size={scale(40)} color={AppTheme.error} />
        <Text style={{ color: AppTheme.error, marginTop: 10 }}>Error al conectar con el servidor.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.screenContainer, { paddingBottom: insets.bottom }]}>
      <KeyboardAwareScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          { paddingBottom: tabBarHeight + verticalScale(30) }
        ]}
        showsVerticalScrollIndicator={false}
        alwaysBounceVertical={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={verticalScale(50)}
        enableAutomaticScroll={true}
      >

        <View style={styles.header}>
          <FileHeart color={AppTheme.primary} size={scale(32)} />
          <Text variant="titleMedium" style={styles.title}>Expediente Alimenticio</Text>
          <Text variant="bodySmall" style={styles.subtitle}>
            Evaluación antropométrica de: <Text style={styles.username}>{userName}</Text>
          </Text>
        </View>

        <Card style={styles.card} mode="outlined">
          <Card.Content style={styles.cardContent}>

            <Text variant="labelLarge" style={styles.sectionDivider}>Medidas Corporales Básicas</Text>

            <CustomInput
              title="Altura (cm)"
              variantText="bodyMedium"
              placeholder="Ej. 175"
              keyboardType="numeric"
              value={height}
              onChangeText={setHeight}
            />

            <CustomInput
              title="Peso Actual (kg)"
              variantText="bodyMedium"
              placeholder="Ej. 74.5"
              keyboardType="numeric"
              value={weight}
              onChangeText={setWeight}
            />

            <Text variant="labelLarge" style={[styles.sectionDivider, { marginTop: verticalScale(6) }]}>Composición Corporal Avanzada</Text>

            <CustomInput
              title="Porcentaje de Grasa (%)"
              variantText="bodyMedium"
              placeholder="Ej. 14.2"
              keyboardType="numeric"
              value={grasaCorporal}
              onChangeText={setGrasaCorporal}
            />

            <CustomInput
              title="Masa Muscular (kg)"
              variantText="bodyMedium"
              placeholder="Ej. 35.8"
              keyboardType="numeric"
              value={masaMuscular}
              onChangeText={setMasaMuscular}
            />

            <Text variant="labelLarge" style={[styles.sectionDivider, { marginTop: verticalScale(6) }]}>Información General</Text>

            <CustomInput
              title="Fecha de Nacimiento (AAAA-MM-DD)"
              variantText="bodyMedium"
              placeholder="Ej. 1998-05-12"
              value={birthDate}
              onChangeText={setBirthDate}
            />

            <CustomSelect
              title="Género"
              variantText="bodyMedium"
              placeholder="Selecciona el género del paciente"
              value={gender} 
              onValueChange={(newValue: GeneroValue) => setGender(newValue)} 
              errorText={gender === '' ? "El género es obligatorio" : undefined} 
            />

          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={handleSaveProfile}
          loading={isSaving}
          disabled={!isFormValid}
          style={styles.btnSave}
          buttonColor={AppTheme.primary}
          labelStyle={styles.btnLabel}
        >
          {data && (data as any).perfil !== null ? 'Actualizar Expediente' : 'Registrar Expediente'}
        </Button>

        <CustomAlert
          visible={alertConfig.visible}
          title={alertConfig.title}
          description={alertConfig.description}
          icon={alertConfig.icon}
          onConfirm={() => setAlertConfig(prev => ({ ...prev, visible: false }))}
        />

      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: AppTheme.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingTop: verticalScale(10),
  },
  header: {
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  title: {
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: verticalScale(3),
  },
  subtitle: {
    color: '#6B7280',
    textAlign: 'center',
    marginTop: verticalScale(2),
  },
  username: {
    fontWeight: 'bold',
    color: AppTheme.primary,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: scale(14),
    borderColor: '#E5E7EB',
    borderWidth: 1,
    marginHorizontal: scale(15),
    elevation: 0,
  },
  cardContent: {
    paddingHorizontal: 0,
    paddingVertical: verticalScale(8),
  },
  sectionDivider: {
    color: '#9CA3AF',
    fontWeight: 'bold',
    marginHorizontal: scale(20),
    marginBottom: verticalScale(6),
    textTransform: 'uppercase',
    fontSize: scale(11),
    letterSpacing: 0.5,
  },
  btnSave: {
    marginTop: verticalScale(15),
    marginHorizontal: scale(15),
    borderRadius: scale(12),
    paddingVertical: verticalScale(4),
  },
  btnLabel: {
    fontWeight: 'bold',
    fontSize: scale(14),
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppTheme.background,
  },
  loadingText: {
    marginTop: verticalScale(10),
    color: '#6B7280',
    fontWeight: '500',
  },
});

export default PerfilAlimenticioView;