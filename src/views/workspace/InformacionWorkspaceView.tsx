import React, { useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Text, Card, Avatar, IconButton, Divider, Button } from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { scale, verticalScale } from 'react-native-size-matters';
import {
  Briefcase,
  User,
  GraduationCap,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Utensils
} from 'lucide-react-native';

import LayoutHeader from '../../components/LayoutHeader';
import { AppTheme } from '../../theme/theme';
import CustomAlert from '../../components/CustomAlert';
import { obtenerDetalleWorkspace, eliminarMiembroWorkspace } from '../../api/UserApi';
import Layout from '../../components/Layout';
import { HistorialClinicoResponse } from '../../api/UserInterface';

type RouteParamList = {
  InformacionWorkspace: { workspaceId: number };
};

const InformacionWorkspaceView = () => {
  const route = useRoute<RouteProp<RouteParamList, 'InformacionWorkspace'>>();
  const navigation = useNavigation<any>();

  const { workspaceId } = route.params;
  const queryClient = useQueryClient();

  const [selectedUser, setSelectedUser] = useState<{ id: number; name: string } | null>(null);

  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    description: '',
    icon: null as React.ReactNode | null,
    isConfirmation: false,
  });

  const { data: workspace, isLoading, isError } = useQuery({
    queryKey: ['detalleWorkspace', workspaceId],
    queryFn: () => obtenerDetalleWorkspace({ id: workspaceId }),
  });

  const pacientes = workspace?.members?.filter((m: any) => m.pivot.member_role === 'Paciente') || [];
  const nutricionistas = workspace?.members?.filter((m: any) => m.pivot.member_role === 'Nutricionista') || [];
  const pacienteTitularId = pacientes[0]?.id;


  const { mutate: removerNutricionista, isPending: isRemoving } = useMutation({
    mutationFn: eliminarMiembroWorkspace,
    onSuccess: (message) => {
      queryClient.invalidateQueries({ queryKey: ['detalleWorkspace', workspaceId] });
      queryClient.invalidateQueries({ queryKey: ['listadoWorkspaces'] });

      setAlertConfig({
        visible: true,
        title: 'Miembro Removido',
        description: message || 'El nutricionista ha sido quitado de este espacio.',
        icon: <CheckCircle2 size={scale(45)} color="#4CAF50" />,
        isConfirmation: false,
      });
      setSelectedUser(null);
    },
    onError: (error: any) => {
      setAlertConfig({
        visible: true,
        title: 'Error al remover',
        description: error.message || 'No se pudo completar la solicitud.',
        icon: <XCircle size={scale(45)} color={AppTheme.error} />,
        isConfirmation: false,
      });
      setSelectedUser(null);
    }
  });

  const handleTriggerDelete = (userId: number, userName: string) => {
    setSelectedUser({ id: userId, name: userName });
    setAlertConfig({
      visible: true,
      title: 'Quitar Nutricionista',
      description: `¿Estás seguro de que deseas remover a ${userName} de este espacio de trabajo?`,
      icon: <AlertTriangle size={scale(45)} color={AppTheme.error || '#D32F2F'} />,
      isConfirmation: true,
    });
  };

  const handleExecuteDelete = () => {
    if (!selectedUser) return;
    removerNutricionista({ workspace_id: workspaceId, user_id: selectedUser.id });
  };

  const handleCancelAlert = () => {
    setAlertConfig(prev => ({ ...prev, visible: false }));
    setSelectedUser(null);
  };

  if (isLoading) {
    return (
      <LayoutHeader>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={AppTheme.primary} />
          <Text style={styles.infoText}>Consultando expediente del espacio...</Text>
        </View>
      </LayoutHeader>
    );
  }

  if (isError || !workspace) {
    return (
      <LayoutHeader>
        <View style={styles.centerContainer}>
          <Text style={{ color: AppTheme.error, fontWeight: '600' }}>Error al obtener la información.</Text>
        </View>
      </LayoutHeader>
    );
  }

  return (
    <Layout>
      <FlatList
        data={nutricionistas}
        keyExtractor={(item) => `nutricionista-${item.id}-${item.pivot.workspace_id}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        ListHeaderComponent={() => (
          <View>

            <Card style={styles.mainCard} mode="contained">
              <Card.Content style={styles.mainCardContent}>
                <Avatar.Icon
                  size={scale(44)}
                  icon={() => <Briefcase size={scale(22)} color="#FFFFFF" />}
                  style={{ backgroundColor: AppTheme.primary }}
                />
                <Text variant="headlineSmall" style={styles.workspaceName}>
                  {workspace.name}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: workspace.is_active ? '#E8F5E9' : '#FFEBEE' }]}>
                  <Text style={[styles.statusText, { color: workspace.is_active ? '#4CAF50' : '#D32F2F' }]}>
                    {workspace.is_active ? 'Espacio Activo' : 'Espacio Inactivo'}
                  </Text>
                </View>
              </Card.Content>
            </Card>

            <Text variant="titleMedium" style={styles.sectionTitle}>Paciente Titular</Text>
            {pacientes.length === 0 ? (
              <Text style={styles.emptyText}>Sin paciente asignado en este espacio.</Text>
            ) : (
              pacientes.map((paciente: any) => (
                <Card key={`paciente-${paciente.id}-${paciente.pivot.member_role}`} style={styles.memberCard} mode="outlined">
                  <Card.Content style={styles.patientCardContent}>

                    <View style={styles.memberContentTop}>
                      <View style={styles.memberLeft}>
                        <Avatar.Icon size={scale(34)} icon={() => <User size={scale(18)} color="#4B5563" />} style={styles.avatarUser} />
                        <View style={styles.textContainer}>
                          <Text variant="bodyLarge" style={styles.memberName}>{paciente.name} {paciente.last_name}</Text>
                          <Text variant="bodySmall" style={styles.memberEmail}>{paciente.email}</Text>
                        </View>
                      </View>
                      <View style={styles.memberRightActionU}>
                        <ShieldCheck size={scale(20)} color="#4CAF50" />
                      </View>
                    </View>
                    
                    <View style={styles.clinicalActionContainer}>
                      <View style={styles.rowButtons}>
                        
                        <Button
                          mode="contained"
                          buttonColor={AppTheme.primary}
                          icon={() => <FileText size={scale(16)} color="#FFFFFF" />}
                          onPress={() => navigation.navigate('SeleccionarFichaLlenado', {
                            workspaceId,
                            userId: paciente.id,
                            pacienteName: `${paciente.name} ${paciente.last_name}`
                          })}
                          style={styles.btnActionFlex}
                        >
                          Fichas Clínicas
                        </Button>

                        <Button
                          mode="contained"
                          buttonColor="#43A047"
                          icon={() => <Utensils size={scale(16)} color="#FFFFFF" />}
                          onPress={() => navigation.navigate('ListarPlanesNutricionales', {
                            workspaceId: workspaceId,
                            pacienteName: `${paciente.name} ${paciente.last_name}`
                          })}
                          style={styles.btnPlanFlex}
                        >
                          Plan Nutricional
                        </Button>

                      </View>
                    </View>

                  </Card.Content>
                </Card>
              ))
            )}

            <Divider style={styles.divider} />
            <Text variant="titleMedium" style={styles.sectionTitle}>Cuerpo de Nutricionistas Asignados</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <Card style={styles.memberCard} mode="outlined">
            <Card.Content style={styles.memberContent}>
              <View style={styles.memberLeft}>
                <Avatar.Icon size={scale(34)} icon={() => <GraduationCap size={scale(18)} color="#4B5563" />} style={styles.avatarUser} />
                <View style={styles.textContainer}>
                  <Text variant="bodyLarge" style={styles.memberName}>{item.name} {item.last_name}</Text>
                  <Text variant="bodySmall" style={styles.memberEmail}>{item.email}</Text>
                </View>
              </View>
              <View style={styles.memberRightActionN}>
                <IconButton
                  icon={() => <Trash2 size={scale(18)} color={AppTheme.error} />}
                  onPress={() => handleTriggerDelete(item.id, item.name)}
                  disabled={isRemoving}
                  style={styles.trashIconButton}
                />
              </View>
            </Card.Content>
          </Card>
        )}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No hay nutricionistas asignados a este área de consulta todavía.</Text>
        )}
      />

      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        description={alertConfig.description}
        icon={alertConfig.icon}
        confirmText={alertConfig.isConfirmation ? "Remover" : "Aceptar"}
        cancelText="Cancelar"
        onConfirm={alertConfig.isConfirmation ? handleExecuteDelete : () => setAlertConfig(prev => ({ ...prev, visible: false }))}
        onCancel={alertConfig.isConfirmation ? handleCancelAlert : undefined}
      />
    </Layout>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  infoText: {
    marginTop: verticalScale(8),
    color: '#6B7280'
  },
  scrollContainer: {
    paddingHorizontal: scale(15),
    paddingTop: verticalScale(15),
    paddingBottom: verticalScale(30)
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: scale(16),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: verticalScale(20)
  },
  mainCardContent: {
    alignItems: 'center',
    paddingVertical: verticalScale(20),
    gap: verticalScale(8)
  },
  workspaceName: {
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center'
  },
  statusBadge: {
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(4),
    borderRadius: scale(20)
  },
  statusText: {
    fontSize: scale(12),
    fontWeight: 'bold'
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: verticalScale(10),
    marginLeft: scale(4)
  },
  memberCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: scale(12),
    borderColor: '#E5E7EB',
    borderWidth: 1,
    marginBottom: verticalScale(8),
    elevation: 0
  },
  patientCardContent: {
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(14)
  },
  memberContentTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  memberLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
    flex: 1
  },
  avatarUser: {
    backgroundColor: '#F3F4F6',
    borderRadius: scale(8)
  },
  textContainer: {
    flex: 1,
    paddingRight: scale(10)
  },
  memberName: {
    fontWeight: '600',
    color: '#1F2937'
  },
  memberEmail: {
    color: '#6B7280'
  },
  memberRightActionU: {
    width: scale(36),
    height: scale(36),
    marginRight: scale(10),
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  clinicalActionContainer: {
    marginTop: verticalScale(12),
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: verticalScale(10),
    alignItems: 'center'
  },
  rowButtons: {
    flexDirection: 'row',
    width: '100%',
    gap: scale(8)
  },
  btnActionFlex: {
    flex: 1,
    borderRadius: scale(8),
    paddingVertical: verticalScale(2)
  },
  btnPlanFlex: {
    flex: 1,
    borderRadius: scale(8),
    paddingVertical: verticalScale(2)
  },
  divider: {
    marginVertical: verticalScale(15),
    backgroundColor: '#E5E7EB'
  },
  memberContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(14)
  },
  memberRightActionN: {
    width: scale(36),
    height: scale(36),
    marginRight: scale(2),
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  trashIconButton: {
    margin: 0,
    padding: 0,
    width: scale(36),
    height: scale(36)
  },
  emptyText: {
    color: '#9CA3AF',
    fontStyle: 'italic',
    marginLeft: scale(4),
    marginBottom: verticalScale(15)
  }
});
export default InformacionWorkspaceView;