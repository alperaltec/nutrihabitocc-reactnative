import React, { ReactNode, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { Text, Card, Button, FAB, Divider } from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRoute, useNavigation } from '@react-navigation/native';
import { scale, verticalScale } from 'react-native-size-matters';
import { Calendar, ShieldAlert, CheckCircle2, XCircle, Plus, Eye, AlertTriangle } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppTheme } from '../../theme/theme';
import Layout from '../../components/Layout';
import CustomAlert from '../../components/CustomAlert'; 
import { desactivarPlanNutricionalManual, obtenerHistorialPlanesWorkspace } from '../../api/WorkSpaceApi';
import { useAuthStore } from '../../store/useAuthStore'; // 🚀 Conectamos Zustand

interface AlertState {
  visible: boolean;
  title: string;
  description: string;
  isConfirm: boolean;
  icon: React.ReactNode; 
  onConfirm: () => void;
}

const ListarPlanesNutricionalesView = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();

  const { workspaceId, pacienteName } = route.params;
  const roleState = useAuthStore((state) => state.role);
  const esPaciente = roleState?.name === 'Paciente';

  const [alertConfig, setAlertConfig] = useState<AlertState>({
    visible: false,
    title: '',
    description: '',
    isConfirm: false,
    icon: <AlertTriangle size={scale(30)} color={AppTheme.error} />,
    onConfirm: () => { }
  });

  const hideAlert = () => setAlertConfig(prev => ({ ...prev, visible: false }));

  const showAlert = (
    title: string,
    description: string,
    icon: React.ReactNode,
    isConfirm = false,
    onConfirm = hideAlert
  ) => {
    setAlertConfig({ visible: true, title, description, icon, isConfirm, onConfirm });
  };

  const { data: planes, isLoading } = useQuery({
    queryKey: ['historialPlanesWorkspace', workspaceId],
    queryFn: () => obtenerHistorialPlanesWorkspace({ workspace_id: workspaceId }),
  });

  const { mutate: desactivarPlan, isPending: isDesactivando } = useMutation({
    mutationFn: desactivarPlanNutricionalManual,
    onSuccess: (message) => {
      queryClient.invalidateQueries({ queryKey: ['historialPlanesWorkspace', workspaceId] });
      queryClient.invalidateQueries({ queryKey: ['planNutricionalWorkspace', workspaceId] });
      showAlert(
        'Éxito',
        message || 'Plan desactivado correctamente.',
        <CheckCircle2 size={scale(35)} color="#10B981" />
      );
    },
    onError: (error: any) => {
      showAlert(
        'Error',
        error.message || 'No se pudo completar la acción.',
        <XCircle size={scale(35)} color={AppTheme.error} />
      );
    }
  });

  const handleConfirmarDesactivacion = (planId: number, planName: string) => {
    showAlert(
      'Desactivar Plan',
      `¿Estás seguro de que deseas bloquear y desactivar manualmente el "${planName}"? Esta acción es irreversible.`,
      <ShieldAlert size={scale(35)} color={AppTheme.error} />,
      true, 
      () => {
        hideAlert();
        desactivarPlan({ plan_nutricional_id: planId });
      }
    );
  };

  if (isLoading) {
    return (
      <Layout>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={AppTheme.primary} />
          <Text style={styles.loadingText}>Cargando historial de planes...</Text>
        </View>
      </Layout>
    );
  }

  return (
    <Layout>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>

            <FlatList
              data={planes}
              keyExtractor={(item) => `plan-card-${item.id}`}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContainer}
              ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                  <Calendar size={scale(44)} color="#9CA3AF" />
                  <Text style={styles.emptyText}>Este espacio de trabajo aún no registra ningún plan de alimentación estructurado.</Text>
                </View>
              )}
              renderItem={({ item }) => {
                const isActive = item.is_active === true || item.is_active === 1 || item.is_active === '1';
                const isExpired = item.is_expired === true || item.is_expired === 1 || item.is_expired === '1';

                let estadoLabel = 'Bloqueado';
                let estadoColor = '#EF4444'; 
                let estadoIcon = <XCircle size={scale(12)} color="#FFFFFF" />;

                if (isActive && !isExpired) {
                  estadoLabel = 'Activo';
                  estadoColor = '#10B981'; 
                  estadoIcon = <CheckCircle2 size={scale(12)} color="#FFFFFF" />;
                } else if (isExpired) {
                  estadoLabel = 'Expirado';
                  estadoColor = '#F59E0B'; 
                  estadoIcon = <ShieldAlert size={scale(12)} color="#FFFFFF" />;
                }

                return (
                  <Card style={styles.planCard} mode="outlined">
                    <Card.Content style={styles.cardContent}>

                      <View style={styles.cardHeaderRow}>
                        <Text variant="titleMedium" numberOfLines={1} style={styles.planName}>{item.name}</Text>
                        <View style={[styles.customBadge, { backgroundColor: estadoColor }]}>
                          {estadoIcon}
                          <Text style={styles.customBadgeText}>{estadoLabel}</Text>
                        </View>
                      </View>

                      <Divider style={styles.cardDivider} />

                      <View style={styles.dateBlock}>
                        <Text style={styles.dateText}>
                          Inicio:{' '}
                          <Text style={styles.dateHighlight}>
                            {item.fecha_inicio ? item.fecha_inicio.substring(0, 10) : 'N/A'}
                          </Text>
                        </Text>
                        <Text style={styles.dateText}>
                          Fin:{' '}
                          <Text style={styles.dateHighlight}>
                            {item.fecha_fin ? item.fecha_fin.substring(0, 10) : 'N/A'}
                          </Text>
                        </Text>
                      </View>

                      <View style={styles.actionsRow}>
                      
                        {!esPaciente && (
                          <>
                            <Button
                              mode="outlined"
                              textColor={AppTheme.error}
                              disabled={!isActive || isExpired || isDesactivando}
                              onPress={() => handleConfirmarDesactivacion(item.id, item.name)}
                              style={[styles.actionButton, { borderColor: AppTheme.error }]}
                              labelStyle={styles.actionButtonLabel}
                              contentStyle={styles.buttonContent}
                            >
                              Desactivar
                            </Button>

                            <Button
                              mode="contained"
                              buttonColor="#0288D1"
                              icon={({ color }) => <Plus size={scale(13)} color={color} />}
                              disabled={isExpired}
                              onPress={() => navigation.navigate('AsignarPlanNutricional', {
                                planNutricionalId: item.id,
                                workspaceId,
                                pacienteName
                              })}
                              style={styles.actionButton}
                              labelStyle={styles.actionButtonLabel}
                              contentStyle={styles.buttonContent}
                            >
                              Agregar
                            </Button>
                          </>
                        )}

                        {/* El botón "Ver Plan" se mantiene para ambos, pero expande su tamaño si es Paciente */}
                        <Button
                          mode="contained"
                          buttonColor="#43A047"
                          icon={({ color }) => <Eye size={scale(13)} color={color} />}
                          onPress={() => navigation.navigate('VerPlanNutricional', { planNutricionalId: item.id, pacienteName })}
                          style={styles.actionButton}
                          labelStyle={esPaciente ? styles.actionButtonLabelPaciente : styles.actionButtonLabel}
                          contentStyle={styles.buttonContent}
                        >
                          Ver Plan
                        </Button>
                      </View>
                    </Card.Content>
                  </Card>
                );
              }}
            />

            {/* 🚀 RENDERIZADO CONDICIONAL DEL FAB: Ocultamos el botón si es Paciente */}
            {!esPaciente && (
              <FAB
                icon="plus"
                label="Nuevo Plan"
                color="#FFFFFF"
                style={styles.fabStyle}
                onPress={() => navigation.navigate('CrearPlanNutricional', { workspaceId, pacienteName })}
              />
            )}

          </SafeAreaView>
        </TouchableWithoutFeedback>

        <CustomAlert
          visible={alertConfig.visible}
          title={alertConfig.title}
          description={alertConfig.description}
          icon={alertConfig.icon}
          onConfirm={alertConfig.onConfirm}
          onCancel={alertConfig.isConfirm ? hideAlert : undefined}
          confirmText={alertConfig.isConfirm ? "Sí, desactivar" : "Entendido"}
          cancelText="Cancelar"
        />

      </KeyboardAvoidingView>
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
    paddingTop: verticalScale(10), 
    paddingBottom: verticalScale(95) 
  },
  centerContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  loadingText: { 
    marginTop: 10, 
    color: '#6B7280' 
  },
  emptyContainer: { 
    alignItems: 'center', 
    marginTop: verticalScale(60), 
    paddingHorizontal: scale(30), 
    gap: verticalScale(12) 
  },
  emptyText: { 
    textAlign: 'center', 
    color: '#9CA3AF', 
    fontStyle: 'italic', 
    lineHeight: scale(18) 
  },
  planCard: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: scale(12), 
    borderColor: '#E5E7EB', 
    marginBottom: verticalScale(12), 
    overflow: 'hidden', 
    elevation: 0 
  },
  cardContent: { 
    padding: scale(12) 
  },
  cardHeaderRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    gap: scale(8) 
  },
  planName: { 
    fontWeight: 'bold', 
    color: '#1F2937', 
    flex: 1, 
    fontSize: scale(14) 
  },
  customBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
    borderRadius: scale(15),
    gap: scale(4) 
  },
  customBadgeText: {
    color: '#FFFFFF',
    fontSize: scale(9.5),
    fontWeight: 'bold',
    includeFontPadding: false
  },
  cardDivider: { 
    marginVertical: verticalScale(10), 
    backgroundColor: '#F3F4F6' 
  },
  dateBlock: { 
    gap: verticalScale(4), 
    paddingLeft: scale(2) 
  },
  dateText: { 
    fontSize: scale(12), 
    color: '#4B5563' 
  },
  dateHighlight: { 
    fontWeight: '600', 
    color: '#1F2937' 
  },
  actionsRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: verticalScale(15), 
    gap: scale(4) 
  },
  actionButton: { 
    flex: 1, 
    borderRadius: scale(8), 
    justifyContent: 'center' 
  },
  buttonContent: { 
    paddingHorizontal: 0 
  },
  actionButtonLabel: { 
    fontSize: scale(9.5), 
    fontWeight: 'bold' 
  },
  actionButtonLabelPaciente: {
    fontSize: scale(12), 
    fontWeight: 'bold' 
  },
  fabStyle: {
    position: 'absolute',
    margin: scale(16),
    right: 0,
    bottom: verticalScale(50),
    backgroundColor: AppTheme.primary,
    borderRadius: scale(25),
    zIndex: 99,
    elevation: 4
  }
});

export default ListarPlanesNutricionalesView;