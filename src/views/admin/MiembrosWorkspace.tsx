import React, { useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { Text, SegmentedButtons, Card, Avatar, IconButton, List } from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { scale, verticalScale } from 'react-native-size-matters';
import { User, GraduationCap, UserPlus, CheckCircle2, XCircle } from 'lucide-react-native';

import LayoutHeader from '../../components/LayoutHeader';
import { AppTheme } from '../../theme/theme';
import CustomAlert from '../../components/CustomAlert';
import {
  obtenerPacientesDisponibles,
  obtenerNutricionistasDisponibles,
  asignarMiembroWorkspace
} from '../../api/UserApi';
import Layout from '../../components/Layout';

type RouteParamList = {
  MiembrosWorkspace: { workspaceId: number; workspaceName: string };
};

const MiembrosWorkspace = () => {
  const route = useRoute<RouteProp<RouteParamList, 'MiembrosWorkspace'>>();
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const { workspaceId, workspaceName } = route.params || {};
  const [activeTab, setActiveTab] = useState<'paciente' | 'nutricionista'>('paciente');

  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    description: '',
    icon: null as React.ReactNode | null,
    isSuccess: false,
  });
  const { data: pacientes, isLoading: loadingPacientes, refetch: refetchPacientes } = useQuery({
    queryKey: ['pacientesDisponibles'],
    queryFn: obtenerPacientesDisponibles,
    enabled: activeTab === 'paciente',
  });
  const { data: nutricionistas, isLoading: loadingNutricionistas, refetch: refetchNutricionistas } = useQuery({
    queryKey: ['nutricionistasDisponibles'],
    queryFn: obtenerNutricionistasDisponibles,
    enabled: activeTab === 'nutricionista',
  });

  const { mutate, isPending: isAssigning } = useMutation({
    mutationFn: asignarMiembroWorkspace,
    onSuccess: (message) => {

      queryClient.invalidateQueries({ queryKey: ['listadoWorkspaces'] });

      setAlertConfig({
        visible: true,
        title: '¡Miembro Asignado!',
        description: message || 'Se ha vinculado al integrante con éxito.',
        icon: <CheckCircle2 size={scale(45)} color="#4CAF50" />,
        isSuccess: true,
      });
    },
    onError: (error: any) => {
      setAlertConfig({
        visible: true,
        title: 'Operación no permitida',
        description: error.message || 'Ocurrió un problema al asignar el miembro.',
        icon: <XCircle size={scale(45)} color={AppTheme.error} />,
        isSuccess: false,
      });
    },
  });

  const handleAssignUser = (userId: number) => {
    if (isAssigning) return;
    mutate({
      workspace_id: workspaceId,
      user_id: userId,
      rol: activeTab === 'paciente' ? 'Paciente' : 'Nutricionista',
    });
  };

  const handleAlertConfirm = () => {
    setAlertConfig(prev => ({ ...prev, visible: false }));
    if (alertConfig.isSuccess) {
      navigation.goBack();
    }
  };

  const currentData = activeTab === 'paciente' ? pacientes : nutricionistas;
  const isCurrentLoading = activeTab === 'paciente' ? loadingPacientes : loadingNutricionistas;
  const currentRefetch = activeTab === 'paciente' ? refetchPacientes : refetchNutricionistas;

  const renderUserItem = ({ item }: { item: any }) => {
    return (
      <Card style={styles.card} mode="outlined">
        <List.Item
          title={`${item.name} ${item.last_name}`}
          description={item.email}
          titleStyle={styles.itemTitle}
          descriptionStyle={styles.itemDescription}
          left={() => (
            <View style={{ paddingLeft: scale(15), justifyContent: 'center' }}>
              <Avatar.Icon
                size={scale(36)}
                icon={() => activeTab === 'paciente'
                  ? <User size={scale(18)} color={AppTheme.primary} />
                  : <GraduationCap size={scale(18)} color={AppTheme.primary} />
                }
                style={styles.avatarIcon}
              />
            </View>
          )}
          right={() => (
            <IconButton
              icon={() => <UserPlus size={scale(20)} color={AppTheme.primary} />}
              onPress={() => handleAssignUser(item.id)}
              disabled={isAssigning}
            />
          )}
        />
      </Card>
    );
  };

  return (
    <Layout>
      <View style={styles.mainContainer}>
        <View style={styles.infoBanner}>
          <Text variant="labelLarge" style={styles.bannerSubtitle}>Asignando integrantes a:</Text>
          <Text variant="titleMedium" style={styles.bannerTitle}>{workspaceName}</Text>
        </View>
        <View style={styles.tabsContainer}>
          <SegmentedButtons
            value={activeTab}
            onValueChange={(value: any) => setActiveTab(value)}
            buttons={[
              {
                value: 'paciente',
                label: 'Pacientes',
                disabled: isAssigning,
                checkedColor: '#FFFFFF',
                style: activeTab === 'paciente' ? { backgroundColor: AppTheme.primary } : {},
              },
              {
                value: 'nutricionista',
                label: 'Nutricionistas',
                disabled: isAssigning,
                checkedColor: '#FFFFFF',
                style: activeTab === 'nutricionista' ? { backgroundColor: AppTheme.primary } : {},
              },
            ]}
          />
        </View>
        {isCurrentLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={AppTheme.primary} />
            <Text style={styles.loadingText}>Buscando cuentas activas...</Text>
          </View>
        ) : (
          <FlatList
            data={currentData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderUserItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={false}
                onRefresh={currentRefetch}
                colors={[AppTheme.primary]}
              />
            }
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                No hay {activeTab}s registrados o activos en la plataforma.
              </Text>
            }
          />
        )}
        <CustomAlert
          visible={alertConfig.visible}
          title={alertConfig.title}
          description={alertConfig.description}
          icon={alertConfig.icon}
          onConfirm={handleAlertConfirm}
        />

      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingTop: verticalScale(10),
  },
  infoBanner: {
    backgroundColor: '#F3F4F6',
    marginHorizontal: scale(15),
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(15),
    borderRadius: scale(12),
    borderLeftWidth: 4,
    borderLeftColor: AppTheme.primary,
    marginBottom: verticalScale(12),
  },
  bannerSubtitle: {
    color: '#6B7280',
    fontSize: scale(11),
  },
  bannerTitle: {
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: verticalScale(1),
  },
  tabsContainer: {
    marginHorizontal: scale(15),
    marginBottom: verticalScale(14),
  },
  listContent: {
    paddingHorizontal: scale(15),
    paddingBottom: verticalScale(30),
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: scale(12),
    borderColor: '#E5E7EB',
    borderWidth: 1,
    marginBottom: verticalScale(8),
    elevation: 0,
    overflow: 'hidden',
  },
  itemTitle: {
    fontWeight: '600',
    color: '#1F2937',
    fontSize: scale(14),
  },
  itemDescription: {
    color: '#6B7280',
    fontSize: scale(12),
  },
  avatarIcon: {
    backgroundColor: '#F3F4F6',
    borderRadius: scale(8),
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: verticalScale(8),
    color: '#6B7280',
  },
  emptyText: {
    textAlign: 'center',
    color: '#9CA3AF',
    marginTop: verticalScale(40),
    paddingHorizontal: scale(20),
  },
});

export default MiembrosWorkspace;