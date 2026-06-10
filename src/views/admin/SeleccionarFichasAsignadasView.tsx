import React from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Text, Card, Avatar, List, FAB } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native'; // 🚀 Agregado useFocusEffect
import { scale, verticalScale } from 'react-native-size-matters';
import { FileText, ChevronRight, ClipboardList, Plus } from 'lucide-react-native';

import { AppTheme } from '../../theme/theme';
import Layout from '../../components/Layout';
import { obtenerListaFichasPaciente } from '../../api/WorkSpaceApi';
import { useAuthStore } from '../../store/useAuthStore';

const SeleccionarFichasAsignadasView = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const roleState = useAuthStore((state) => state.role);
  const esPaciente = roleState?.name === 'Paciente';
  const { workspaceId, userId, pacienteName } = route.params;

  const { data: respuestaHistorial, isLoading, isError, refetch } = useQuery({
    queryKey: ['listadoFichasPacienteWorkspace', workspaceId, userId],
    queryFn: () => obtenerListaFichasPaciente({ workspace_id: workspaceId, user_id: userId }),
    enabled: !!userId,
    staleTime: 0,
  });

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch])
  );

  const fichasExistentes = Array.isArray(respuestaHistorial)
    ? respuestaHistorial
    : (respuestaHistorial as any)?.data || [];

  return (
    <Layout>
      <View style={styles.mainContainer}>


        {isLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={AppTheme.primary} />
            <Text style={styles.loadingText}>Cargando historial de expedientes...</Text>
          </View>
        ) : isError ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>Error al conectar con el servidor.</Text>
            <TouchableOpacity onPress={() => refetch()} style={styles.retryButton}>
              <Text style={styles.retryText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={fichasExistentes}
            keyExtractor={(item: any) => `ficha-llenada-${item.id}`}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <Card style={styles.card} mode="outlined">
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('LlenarHistorialClinico', {
                    workspaceId,
                    userId,
                    pacienteName,
                    fichaClinicaId: item.id,
                    plantillaId: item.plantilla_id,
                    plantillaName: item.nombre_plantilla,
                    modo: esPaciente ? 'ver_llenado' : 'llenar'
                  })}
                >
                  <List.Item
                    title={item.nombre_plantilla || 'Evaluación Clínica'}
                    description={`Registrado el: ${new Date(item.created_at).toLocaleDateString()}`}
                    titleStyle={styles.itemTitle}
                    descriptionStyle={styles.itemDescription}
                    left={() => (
                      <View style={styles.leftIconWrapper}>
                        <Avatar.Icon size={scale(36)} icon={() => <FileText size={scale(18)} color={AppTheme.primary} />} style={styles.avatarIcon} />
                      </View>
                    )}
                    right={() => (
                      <View style={styles.rightIconWrapper}>
                        <ChevronRight size={scale(20)} color="#9CA3AF" />
                      </View>
                    )}
                  />
                </TouchableOpacity>
              </Card>
            )}
            ListEmptyComponent={
              <View style={styles.centerContainer}>
                <ClipboardList size={scale(48)} color="#9CA3AF" />
                <Text style={styles.emptyText}>El paciente aún no cuenta con registros clínicos cargados.</Text>
              </View>
            }
          />
        )}

        {
          !esPaciente && (
            <FAB
              icon={() => <Plus size={scale(20)} color="#FFFFFF" />}
              style={styles.fabStyle}
              onPress={() => navigation.navigate('SeleccionarPlantilla', {
                workspaceId,
                userId,
                pacienteName
              })}
            />
          )
        }
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingTop: verticalScale(10)
  },
  infoBanner: {
    backgroundColor: '#E8F5E9',
    marginHorizontal: scale(15),
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(15),
    borderRadius: scale(12),
    borderLeftWidth: 4,
    borderLeftColor: AppTheme.primary,
    marginBottom: verticalScale(16)
  },
  bannerSubtitle: {
    color: '#4B5563',
    fontSize: scale(11)
  },
  bannerTitle: {
    fontWeight: 'bold',
    color: AppTheme.primary,
    marginTop: verticalScale(1)
  },
  listContent: {
    paddingBottom: verticalScale(80)
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: scale(12),
    borderColor: '#E5E7EB',
    borderWidth: 1,
    marginBottom: verticalScale(10),
    marginHorizontal: scale(15),
    elevation: 0
  },
  itemTitle: {
    fontWeight: '600',
    color: '#1F2937',
    fontSize: scale(14)
  },
  itemDescription: {
    color: '#6B7280',
    fontSize: scale(12)
  },
  leftIconWrapper: {
    paddingLeft: scale(6),
    justifyContent: 'center'
  },
  avatarIcon: {
    backgroundColor: '#F3F4F6',
    borderRadius: scale(8)
  },
  rightIconWrapper: {
    justifyContent: 'center',
    paddingRight: scale(4)
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scale(40)
  },
  loadingText: {
    marginTop: verticalScale(8),
    color: '#6B7280'
  },
  errorText: {
    color: AppTheme.error,
    fontWeight: '600'
  },
  emptyText: {
    textAlign: 'center',
    color: '#9CA3AF',
    paddingHorizontal: scale(40),
    marginTop: scale(10)
  },
  retryButton: {
    marginTop: scale(10),
    backgroundColor: AppTheme.primary,
    paddingHorizontal: scale(15),
    paddingVertical: scale(5),
    borderRadius: scale(8)
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: 'bold'
  },
  fabStyle: {
    position: 'absolute',
    margin: scale(16),
    right: 0,
    bottom: verticalScale(45),
    backgroundColor: AppTheme.primary,
    borderRadius: scale(25),
    elevation: 4
  }
});

export default SeleccionarFichasAsignadasView;


