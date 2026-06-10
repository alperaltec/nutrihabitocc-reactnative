import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { Text, Searchbar, Card, Avatar, Button, Modal, Portal, FAB } from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { scale as s, scale, verticalScale, verticalScale as vs } from 'react-native-size-matters';
import { Briefcase, Plus, UserPlus, CheckCircle2, XCircle } from 'lucide-react-native';

import LayoutHeader from '../../components/LayoutHeader';
import { AppTheme } from '../../theme/theme';
import CustomInput from '../../components/CustomInput';
import CustomAlert from '../../components/CustomAlert';
import { listarWorkspace, crearworkspace } from '../../api/UserApi';
import { WorkspaceResponse } from '../../api/UserInterface';
import { useAuthStore } from '../../store/useAuthStore';

const WorkspaceView = () => {
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();

  const roleState = useAuthStore((state) => state.role);
  const esNutricionista = roleState?.name === 'Nutricionista';

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 800);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [workspaceName, setWorkspaceName] = useState('');

  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    description: '',
    icon: null as React.ReactNode | null,
  });

  const { data: workspaces, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['listadoWorkspaces', debouncedSearchQuery],
    queryFn: () => listarWorkspace({ buscar: debouncedSearchQuery }),
    refetchInterval: 60000,
    staleTime: 30000,
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const { mutate, isPending: isCreating } = useMutation({
    mutationFn: crearworkspace,
    onSuccess: (message) => {
      queryClient.invalidateQueries({ queryKey: ['listadoWorkspaces'] });
      setIsModalVisible(false);
      setWorkspaceName('');
      setAlertConfig({
        visible: true,
        title: '¡Espacio Creado!',
        description: message || 'El workspace se ha registrado correctamente.',
        icon: <CheckCircle2 size={s(45)} color="#4CAF50" />,
      });
    },
    onError: (error: any) => {
      setAlertConfig({
        visible: true,
        title: 'Error de creación',
        description: error.message || 'No se pudo registrar el espacio de trabajo.',
        icon: <XCircle size={s(45)} color="#D32F2F" />,
      });
    }
  });

  const handleConfirmCreate = () => {
    if (workspaceName.trim().length === 0 || isCreating) return;
    mutate({ name: workspaceName });
  };

  const renderItem = ({ item }: { item: WorkspaceResponse }) => {
    const isWorkspaceActive = item.is_active === true || String(item.is_active) === '1';

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate('InformacionWorkspace', { workspaceId: item.id })}
      >
        <Card style={styles.card} mode="outlined">
          <Card.Content style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <View style={styles.titleRow}>
                <Avatar.Icon
                  size={s(36)}
                  icon={() => <Briefcase size={s(18)} color={AppTheme.primary} />}
                  style={styles.avatarIcon}
                />
                <View style={styles.nameContainer}>
                  <Text variant="titleMedium" style={styles.workspaceName}>{item.name}</Text>
                  <Text variant="labelSmall" style={styles.idText}>ID de Área: #{item.id}</Text>
                </View>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: isWorkspaceActive ? '#E8F5E9' : '#FFEBEE' }]}>
                <Text style={[styles.statusText, { color: isWorkspaceActive ? '#4CAF50' : '#D32F2F' }]}>
                  {isWorkspaceActive ? 'Activo' : 'Inactivo'}
                </Text>
              </View>
            </View>

            {!esNutricionista && (
              <View style={styles.cardActions}>
                <Button
                  mode="text"
                  compact
                  icon={() => <UserPlus size={s(16)} color={AppTheme.primary} />}
                  textColor={AppTheme.primary}
                  onPress={() => {
                    navigation.navigate('MiembroWorkspace', {
                      workspaceId: item.id,
                      workspaceName: item.name,
                    });
                  }}
                  labelStyle={styles.btnActionLabel}
                >
                  Gestionar Miembros
                </Button>
              </View>
            )}
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <Portal.Host>
      <LayoutHeader>
        <View style={styles.mainContainer}>

          <Searchbar
            placeholder="Buscar áreas de trabajo..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
            inputStyle={styles.searchInput}
          />

          {isLoading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color={AppTheme.primary} />
              <Text style={styles.infoText}>Cargando workspaces...</Text>
            </View>
          ) : isError ? (
            <View style={styles.centerContainer}>
              <Text style={styles.errorText}>Error al conectar con el servidor.</Text>
            </View>
          ) : (
            <FlatList
              data={workspaces}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[AppTheme.primary]} />
              }
              ListEmptyComponent={
                <Text style={styles.emptyText}>No se encontraron workspaces registrados.</Text>
              }
            />
          )}

          {!esNutricionista && (
            <FAB
              label="Nuevo Workspace"
              icon={() => <Plus size={scale(18)} color="#FFFFFF" />}
              onPress={() => setIsModalVisible(true)}
              style={[styles.fabExtended, { backgroundColor: AppTheme.primary }]}
              color="#FFFFFF"
              theme={{
                fonts: { labelLarge: { fontWeight: 'bold', fontSize: scale(13) } }
              }}
            />
          )}

          <Portal>
            <Modal
              visible={isModalVisible}
              onDismiss={() => !isCreating && setIsModalVisible(false)}
              contentContainerStyle={styles.modalContent}
            >
              <View style={styles.modalHeader}>
                <Briefcase size={s(24)} color={AppTheme.primary} />
                <Text variant="titleLarge" style={styles.modalTitle}>Crear Workspace</Text>
              </View>

              <Text variant="bodyMedium" style={styles.modalDescription}>
                Ingresa un nombre descriptivo para identificar el nuevo espacio de trabajo médico.
              </Text>

              <CustomInput
                title="Nombre del Workspace"
                variantText="bodyMedium"
                placeholder="Ej. Clínica del Norte - Plan Nutricional"
                value={workspaceName}
                onChangeText={setWorkspaceName}
                disabled={isCreating}
              />

              <View style={styles.modalActions}>
                <Button
                  mode="contained"
                  onPress={handleConfirmCreate}
                  loading={isCreating}
                  disabled={workspaceName.trim().length === 0 || isCreating}
                  style={styles.btnConfirm}
                  buttonColor={AppTheme.primary}
                >
                  Crear Espacio
                </Button>

                <Button
                  mode="text"
                  onPress={() => setIsModalVisible(false)}
                  disabled={isCreating}
                  textColor="#6B7280"
                  style={styles.btnCancel}
                >
                  Cancelar
                </Button>
              </View>
            </Modal>
          </Portal>

          <CustomAlert
            visible={alertConfig.visible}
            title={alertConfig.title}
            description={alertConfig.description}
            icon={alertConfig.icon}
            onConfirm={() => setAlertConfig(prev => ({ ...prev, visible: false }))}
          />

        </View>
      </LayoutHeader>
    </Portal.Host>
  );
};

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
    return () => { clearTimeout(handler); };
  }, [value, delay]);
  return debouncedValue;
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingTop: verticalScale(10),
  },
  searchbar: {
    marginHorizontal: scale(15),
    marginBottom: verticalScale(14),
    backgroundColor: '#FFFFFF',
    borderRadius: scale(12),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchInput: {
    minHeight: 0,
  },
  listContent: {
    paddingBottom: verticalScale(85),
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: scale(14),
    borderColor: '#E5E7EB',
    borderWidth: 1,
    marginHorizontal: scale(15),
    marginBottom: verticalScale(10),
    elevation: 0,
  },
  cardContent: {
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(14),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarIcon: {
    backgroundColor: '#F3F4F6',
    borderRadius: scale(8),
  },
  nameContainer: {
    marginLeft: scale(10),
    flex: 1,
  },
  workspaceName: {
    fontWeight: 'bold',
    color: '#1F2937',
    lineHeight: verticalScale(18),
  },
  idText: {
    color: '#9CA3AF',
    marginTop: verticalScale(1),
  },
  statusBadge: {
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(3),
    borderRadius: scale(8),
  },
  statusText: {
    fontSize: scale(11),
    fontWeight: 'bold',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: verticalScale(8),
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: verticalScale(6),
  },
  btnActionLabel: {
    fontSize: scale(12),
    fontWeight: 'bold',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    marginTop: verticalScale(8),
    color: '#6B7280',
  },
  errorText: {
    color: AppTheme.error,
    fontWeight: '600'
  },
  emptyText: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: verticalScale(40),
  },
  fabExtended: {
    position: 'absolute',
    margin: scale(12),
    right: 2,
    bottom: verticalScale(1),
    borderRadius: scale(16),
    elevation: 4,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: scale(20),
    paddingVertical: verticalScale(20),
    paddingHorizontal: scale(5),
    borderRadius: scale(16),
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s(8),
    marginBottom: vs(10),
  },
  modalTitle: {
    fontWeight: 'bold',
    color: '#1F2937',
  },
  modalDescription: {
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: s(20),
    marginBottom: vs(15),
    lineHeight: vs(16),
  },
  modalActions: {
    marginTop: vs(15),
    paddingHorizontal: s(20),
    gap: vs(8),
  },
  btnConfirm: {
    borderRadius: s(12),
    paddingVertical: vs(3),
  },
  btnCancel: {
    borderRadius: s(12),
    paddingVertical: vs(3),
  },
});

export default WorkspaceView;

