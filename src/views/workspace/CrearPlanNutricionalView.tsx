import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { Text, Card, TextInput, Button, Divider } from 'react-native-paper';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRoute, useNavigation } from '@react-navigation/native';
import { scale, verticalScale } from 'react-native-size-matters';
import { CalendarDays, ClipboardList, CheckCircle, AlertTriangle, XCircle } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppTheme } from '../../theme/theme';
import Layout from '../../components/Layout';
import { crearPlanNutricionalBase } from '../../api/UserApi';
import CustomAlert from '../../components/CustomAlert';

interface AlertState {
  visible: boolean;
  title: string;
  description: string;
  isConfirm: boolean;
  icon: React.ReactNode;
  onConfirm: () => void;
}

const CrearPlanNutricionalView = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();

  const { workspaceId, pacienteName } = route.params;

  const fechaHoy = new Date().toISOString().split('T')[0];
  const fechaFutura = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [alertConfig, setAlertConfig] = useState<AlertState>({
    visible: false,
    title: '',
    description: '',
    isConfirm: false,
    icon: null,
    onConfirm: () => { }
  });

  const [nombrePlan, setNombrePlan] = useState<string>('Plan Nutricional Mensual');
  const [fechaInicio, setFechaInicio] = useState<string>(fechaHoy);
  const [fechaFin, setFechaFin] = useState<string>(fechaFutura);

  const hideAlert = () => setAlertConfig(prev => ({ ...prev, visible: false }));
  const showAlert = (title: string, description: string, icon: React.ReactNode, onConfirm: () => void = hideAlert, isConfirm = false) => {
    setAlertConfig({ visible: true, title, description, icon, isConfirm, onConfirm });
  };
  const { mutate: crearPlan, isPending } = useMutation({
    mutationFn: crearPlanNutricionalBase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['historialPlanesWorkspace', workspaceId] });
      queryClient.invalidateQueries({ queryKey: ['planNutricionalWorkspace', workspaceId] });

      showAlert(
        '¡Plan Creado!',
        'El nuevo periodo nutricional ha sido inicializado con éxito. Ya puedes empezar a asignarle recetas.',
        <CheckCircle size={scale(30)} color="#10B981" />,
        () => {
          hideAlert();
          navigation.goBack();
        }
      );
    },
    onError: (error: any) => {
      const mensaje = error.response?.data?.message || error.message || 'Error al intentar crear el plan.';
      showAlert('Error', mensaje, <XCircle size={scale(30)} color={AppTheme.error} />);
    }
  });

  const handleGuardarPlan = () => {
    Keyboard.dismiss();

    if (!nombrePlan.trim()) {
      showAlert('Campo Obligatorio', 'Por favor ingresa un nombre para identificar este plan.', <AlertTriangle size={scale(30)} color={AppTheme.error} />);
      return;
    }
    if (!fechaInicio.trim() || !fechaFin.trim()) {
      showAlert('Campos Vacíos', 'Las fechas de inicio y fin son estrictamente necesarias.', <AlertTriangle size={scale(30)} color={AppTheme.error} />);
      return;
    }
    if (fechaInicio > fechaFin) {
      showAlert('Error de Fechas', 'La fecha de inicio no puede ser mayor a la fecha de finalización.', <AlertTriangle size={scale(30)} color={AppTheme.error} />);
      return;
    }

    crearPlan({
      workspace_id: Number(workspaceId),
      name: nombrePlan.trim(),
      fecha_inicio: fechaInicio.trim(),
      fecha_fin: fechaFin.trim()
    } as any);
  };

  return (
    <Layout>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>

              <Card style={styles.infoCard} mode="contained">
                <Card.Content style={styles.infoCardContent}>
                  <ClipboardList size={scale(24)} color={AppTheme.primary} />
                  <View style={styles.infoTextContainer}>
                    <Text variant="titleMedium" style={styles.infoTitle}>Inicializar Nuevo Plan</Text>
                    <Text variant="bodySmall" style={styles.infoSubtitle}>Paciente: <Text style={{ fontWeight: 'bold' }}>{pacienteName}</Text></Text>
                  </View>
                </Card.Content>
              </Card>

              <Text variant="labelLarge" style={styles.sectionTitle}>Detalles del Tratamiento</Text>
              <Card style={styles.formCard} mode="outlined">
                <Card.Content>
                  <TextInput
                    mode="outlined"
                    label="Nombre / Objetivo del Plan"
                    placeholder="Ej: Etapa de Volumen, Fase de Definición..."
                    value={nombrePlan}
                    onChangeText={setNombrePlan}
                    style={styles.inputField}
                    outlineColor="#E5E7EB"
                    activeOutlineColor={AppTheme.primary}
                  />
                  <Divider style={styles.divider} />
                  <View style={styles.dateRow}>
                    <View style={styles.dateInputContainer}>
                      <Text style={styles.dateLabel}>Fecha de Inicio</Text>
                      <TextInput
                        mode="outlined"
                        placeholder="AAAA-MM-DD"
                        value={fechaInicio}
                        onChangeText={setFechaInicio}
                        style={styles.inputField}
                        outlineColor="#E5E7EB"
                        activeOutlineColor={AppTheme.primary}
                        left={<TextInput.Icon icon={() => <CalendarDays size={scale(18)} color="#9CA3AF" />} />}
                      />
                    </View>

                    <View style={styles.dateInputContainer}>
                      <Text style={styles.dateLabel}>Fecha de Término</Text>
                      <TextInput
                        mode="outlined"
                        placeholder="AAAA-MM-DD"
                        value={fechaFin}
                        onChangeText={setFechaFin}
                        style={styles.inputField}
                        outlineColor="#E5E7EB"
                        activeOutlineColor={AppTheme.primary}
                        left={<TextInput.Icon icon={() => <CalendarDays size={scale(18)} color="#9CA3AF" />} />}
                      />
                    </View>
                  </View>
                  <Text style={styles.helperText}>
                    *El formato de fecha debe ser Año-Mes-Día (Ejemplo: 2026-12-31). El plan expirará automáticamente pasada la fecha de término.
                  </Text>

                </Card.Content>
              </Card>

              <Button
                mode="contained"
                disabled={isPending}
                loading={isPending}
                icon={({ color }) => <CheckCircle size={scale(16)} color={color} />}
                onPress={handleGuardarPlan}
                style={styles.btnSubmit}
                contentStyle={styles.btnSubmitContent}
                labelStyle={styles.btnSubmitLabel}
              >
                Crear y Guardar Plan
              </Button>

            </ScrollView>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        description={alertConfig.description}
        icon={alertConfig.icon}
        onConfirm={alertConfig.onConfirm}
        onCancel={alertConfig.isConfirm ? hideAlert : undefined}
        confirmText={alertConfig.isConfirm ? "Sí" : "Entendido"}
      />
    </Layout>
  );
};

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1
  },
  safeArea: {
    flex: 1
  },
  scrollContainer: {
    paddingHorizontal: scale(15),
    paddingTop: verticalScale(15),
    paddingBottom: verticalScale(40)
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: verticalScale(20)
  },
  infoCardContent: {
    flexDirection: 'row',
    gap: scale(10),
    alignItems: 'center'
  },
  infoTextContainer: {
    flex: 1
  },
  infoTitle: {
    fontWeight: 'bold',
    color: '#1F2937'
  },
  infoSubtitle: {
    color: '#6B7280',
    marginTop: 2
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: verticalScale(10),
    paddingLeft: scale(2)
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: scale(12),
    borderColor: '#E5E7EB'
  },
  inputField: {
    backgroundColor: '#FFFFFF',
    fontSize: scale(13)
  },
  divider: {
    marginVertical: verticalScale(15),
    backgroundColor: '#F3F4F6'
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: scale(10)
  },
  dateInputContainer: {
    flex: 1
  },
  dateLabel: {
    fontSize: scale(11),
    color: '#4B5563',
    fontWeight: 'bold',
    marginBottom: verticalScale(4),
    marginLeft: scale(2)
  },
  helperText: {
    fontSize: scale(10),
    color: '#9CA3AF',
    marginTop: verticalScale(10),
    fontStyle: 'italic',
    lineHeight: scale(14)
  },
  btnSubmit: {
    marginTop: verticalScale(30),
    borderRadius: scale(8),
    backgroundColor: AppTheme.primary
  },
  btnSubmitContent: {
    paddingVertical: verticalScale(6)
  },
  btnSubmitLabel: {
    fontSize: scale(13),
    fontWeight: 'bold'
  }
});

export default CrearPlanNutricionalView;