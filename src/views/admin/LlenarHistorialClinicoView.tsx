import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text, Button, Checkbox, Card } from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { scale, verticalScale } from 'react-native-size-matters';
import { CheckCircle2, XCircle, Save } from 'lucide-react-native';

import { AppTheme } from '../../theme/theme';
import CustomAlert from '../../components/CustomAlert';
import Layout from '../../components/Layout';

import { obtenerMoldePlantilla } from '../../api/UserApi';
import { ComplexField, InputField, SelectField } from '../../components/CustomComponentsForm';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { crearHistoriaClinicaPaciente, obtenerHistorialClinicoPaciente } from '../../api/WorkSpaceApi';

type RouteParamList = {
  LlenarHistorialClinico: {
    workspaceId: number;
    userId: number;
    pacienteName: string;
    plantillaId: number;
    plantillaName: string;
    fichaClinicaId?: number;
    modo?: 'crear' | 'llenar' | 'previsualizar' | 'ver_llenado'; // 🚀 Agregado 'ver_llenado'
  };
};

const LlenarHistorialClinicoView = () => {
  const route = useRoute<RouteProp<RouteParamList, 'LlenarHistorialClinico'>>();
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const { workspaceId, userId, plantillaId, plantillaName, pacienteName, fichaClinicaId, modo = 'crear' } = route.params;
  
  // 🚀 CONTROL DE MODOS
  const esPrevisualizacion = modo === 'previsualizar';
  const esVerLlenado = modo === 'ver_llenado';
  const bloquearEdicion = esPrevisualizacion || esVerLlenado; // Campos no editables en ambos modos

  const [respuestas, setRespuestas] = useState<Record<string, any>>({});
  const [alertConfig, setAlertConfig] = useState({
    visible: false, title: '', description: '', icon: null as React.ReactNode | null, shouldGoBack: false
  });

  const { data: molde, isLoading } = useQuery({
    queryKey: ['moldePlantilla', plantillaId],
    queryFn: () => obtenerMoldePlantilla(plantillaId),
  });

  // 🚀 CORREGIDO: Habilitado si hay datos clínicos que recuperar (modo llenar o ver_llenado)
  const { data: historialGuardado } = useQuery({
    queryKey: ['historialPaciente', userId, workspaceId, plantillaId, fichaClinicaId],
    queryFn: () => obtenerHistorialClinicoPaciente({
      id: fichaClinicaId || null,
      workspace_id: workspaceId,
      user_id: userId,
      plantilla_formulario_id: plantillaId
    }),
    enabled: !!userId && !!workspaceId && (modo === 'llenar' || modo === 'ver_llenado'),
  });

  useEffect(() => {
    if (molde?.content_data?.secciones) {
      const datosIniciales: Record<string, any> = {};

      molde.content_data.secciones.forEach((seccion: any) => {
        seccion.campos.forEach((campo: any) => {
          // Si es previsualización pura del molde limpio, viene null. Si no, extrae del historial clínico.
          const valorGuardado = esPrevisualizacion ? null : historialGuardado?.content_data?.[campo.id];

          if (campo.type === 'checkbox_group') {
            datosIniciales[campo.id] = valorGuardado ? [...valorGuardado] : [];
          } else if (['gastro_sintoma', 'frecuencia_alimento'].includes(campo.type)) {
            datosIniciales[campo.id] = valorGuardado
              ? { ...valorGuardado }
              : { padece: 'No', consume: 'No', frecuencia: '' };
          } else {
            datosIniciales[campo.id] = valorGuardado !== undefined ? valorGuardado : '';
          }
        });
      });
      setRespuestas(datosIniciales);
    }
  }, [molde, historialGuardado, esPrevisualizacion]);

  const { mutate: guardarProgreso, isPending: isSaving } = useMutation({
    mutationFn: crearHistoriaClinicaPaciente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['historialPaciente', userId, workspaceId, plantillaId] });
      queryClient.invalidateQueries({ queryKey: ['historialPacienteWorkspace', workspaceId, userId] });

      setAlertConfig({
        visible: true,
        title: esPrevisualizacion ? '¡Plantilla Asignada!' : '¡Historial Guardado!',
        description: esPrevisualizacion 
          ? 'El molde clínico fue vinculado y asignado correctamente al expediente del paciente.'
          : 'Los datos clínicos del expediente han sido sincronizados y almacenados con éxito.',
        icon: <CheckCircle2 size={scale(45)} color="#4CAF50" />,
        shouldGoBack: true
      });
    },
    onError: (err: any) => {
      setAlertConfig({
        visible: true,
        title: 'Error de Almacenamiento',
        description: err.message || 'No se pudo procesar la asignación del expediente.',
        icon: <XCircle size={scale(45)} color={AppTheme.error} />,
        shouldGoBack: false
      });
    }
  });

  const handleInputChange = (id: string, valor: any) => {
    if (bloquearEdicion) return; // Freno de seguridad
    setRespuestas(prev => {
      const copiaPrev = { ...prev };
      if (typeof valor === 'object' && valor !== null) {
        copiaPrev[id] = { ...valor };
      } else {
        copiaPrev[id] = valor;
      }
      return copiaPrev;
    });
  };

  const handleCheckboxToggle = (campoId: string, opcion: string) => {
    if (bloquearEdicion) return; // Freno de seguridad
    const actuales = Array.isArray(respuestas[campoId]) ? [...respuestas[campoId]] : [];
    const nuevasRespuestas = actuales.includes(opcion)
      ? actuales.filter((o: string) => o !== opcion)
      : [...actuales, opcion];

    setRespuestas(prev => ({ ...prev, [campoId]: nuevasRespuestas }));
  };

  const handleConfirmSave = () => {
    if (bloquearEdicion && !esPrevisualizacion) return;
    guardarProgreso({
      id: fichaClinicaId || historialGuardado?.id || null,
      workspace_id: workspaceId,
      user_id: userId,
      plantilla_formulario_id: plantillaId,
      content_data: respuestas
    });
  };

  const FieldRenderer = (campo: any) => {
    const campoKey = campo.id;
    const commonProps = {
      label: campo.label,
      value: respuestas[campo.id],
      editable: !bloquearEdicion, // 🚀 Bloquea la edición del input si es True
      disabled: bloquearEdicion  // Deshabilita los clics en elementos selectores
    };

    switch (campo.type) {
      case 'text':
      case 'number':
      case 'textarea':
      case 'tel':
        return (
          <InputField
            key={campoKey}
            {...commonProps}
            value={respuestas[campo.id] || ''}
            onChangeText={(t: any) => handleInputChange(campo.id, t)}
            multiline={campo.type === 'textarea'}
          />
        );
      case 'select':
        return (
          <SelectField
            key={campoKey}
            {...commonProps}
            value={respuestas[campo.id] || ''}
            options={campo.options}
            onValueChange={(v: any) => handleInputChange(campo.id, v)}
          />
        );
      case 'checkbox_group':
        return (
          <Card key={campoKey} style={styles.cardContainer} mode="outlined">
            <Card.Content>
              <Text variant="titleSmall" style={styles.checkboxGroupTitle}>{campo.label}</Text>
              {campo.options.map((opt: string) => (
                <Checkbox.Item
                  key={opt}
                  label={opt}
                  status={(respuestas[campo.id] || []).includes(opt) ? 'checked' : 'unchecked'}
                  onPress={() => handleCheckboxToggle(campo.id, opt)}
                  disabled={bloquearEdicion} // 🚀 Deshabilita clics en los checkboxes
                />
              ))}
            </Card.Content>
          </Card>
        );
      case 'gastro_sintoma':
      case 'frecuencia_alimento':
        return (
          <ComplexField
            key={campoKey}
            label={campo.label}
            value={respuestas[campo.id] || { padece: 'No', consume: 'No', frecuencia: '' }}
            onChange={(v: any) => handleInputChange(campo.id, v)}
            editable={!bloquearEdicion} // 🚀 Hereda el bloqueo a la lógica compuesta interna
          />
        );
      default:
        return null;
    }
  };

  const isScreenLoading = isLoading || !respuestas || Object.keys(respuestas).length === 0;

  if (isScreenLoading) {
    return (
      <Layout>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={AppTheme.primary} />
          <Text style={styles.loadingText}>Cargando formulario...</Text>
        </View>
      </Layout>
    );
  }

  return (
    <Layout>
      <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
        
        {/* Solo renderiza el banner de asignación amarilla si es Previsualización pura */}
        {esPrevisualizacion && (
          <Card style={styles.previewCard}>
            <Card.Content style={styles.previewCardContent}>
              <View style={styles.previewTextWrapper}>
                <Text variant="titleSmall" style={styles.previewTitle}>Modo Previsualización</Text>
                <Text variant="bodySmall" style={styles.previewSubtitle}>Viendo la estructura médica. Presiona asignar para vincularla.</Text>
              </View>
              <Button
                mode="contained"
                loading={isSaving}
                buttonColor={AppTheme.primary}
                onPress={handleConfirmSave}
              >
                Asignar
              </Button>
            </Card.Content>
          </Card>
        )}

        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollPadding}
          enableOnAndroid={true}
          extraScrollHeight={100}
          keyboardOpeningTime={0}
          showsVerticalScrollIndicator={false}
        >
          {molde?.content_data?.secciones?.map((seccion: any) => (
            <View key={seccion.id} style={styles.sectionBlock}>
              <Text variant="titleMedium" style={styles.sectionTitle}>{seccion.titulo}</Text>
              {seccion.campos.map((campo: any) => FieldRenderer(campo))}
            </View>
          ))}

          {/* 🚀 CONDICIONAL FINAL: Oculta por completo el botón de guardar si estás en modo ver_llenado o previsualización */}
          {!bloquearEdicion && (
            <Button
              mode="contained"
              loading={isSaving}
              icon={() => <Save size={scale(18)} color="#FFFFFF" />}
              onPress={handleConfirmSave}
              style={styles.btnSave}
            >
              Guardar Historia Clínica
            </Button>
          )}

          <View style={styles.bottomSpacer} />
        </KeyboardAwareScrollView>
        <CustomAlert {...alertConfig} onConfirm={() => { setAlertConfig(p => ({ ...p, visible: false })); if (alertConfig.shouldGoBack) navigation.goBack(); }} />
      </SafeAreaView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 10
  },
  safeArea: {
    flex: 1
  },
  previewCard: {
    margin: scale(15),
    backgroundColor: '#FFF9C4',
    borderWidth: 1,
    borderColor: '#FBC02D',
    elevation: 0
  },
  previewCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  previewTextWrapper: {
    flex: 1,
    paddingRight: scale(10)
  },
  previewTitle: {
    fontWeight: 'bold',
    color: '#F57F17'
  },
  previewSubtitle: {
    color: '#5D4037'
  },
  scrollPadding: {
    padding: scale(15)
  },
  sectionBlock: {
    marginBottom: verticalScale(20)
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: AppTheme.primary,
    marginBottom: verticalScale(12)
  },
  cardContainer: {
    marginBottom: scale(12),
    backgroundColor: '#FFFFFF'
  },
  checkboxGroupTitle: {
    marginBottom: 10
  },
  btnSave: {
    borderRadius: scale(12),
    paddingVertical: verticalScale(4),
    marginTop: verticalScale(20),
    marginBottom: verticalScale(20)
  },
  bottomSpacer: {
    height: verticalScale(50)
  }
});

export default LlenarHistorialClinicoView;