import { View, StyleSheet, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import React, { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query'; 
import { Button, Text, Card, Surface } from 'react-native-paper';
import { scale, verticalScale } from 'react-native-size-matters';
import { 
  Users, 
  Stethoscope, 
  UserCheck, 
  LayoutDashboardIcon, 
  Apple, 
  ChevronRight, 
  Scale, 
  Heart, 
  TrendingUp 
} from 'lucide-react-native';

import { AppTheme } from '../../theme/theme';
import { useAuthStore } from '../../store/useAuthStore';

import CustomCardInfo from '../../components/CustomCardInfo';
import CustomStatCard from '../../components/CustomStatCard';
import { datosadministrador, obtenerperfilPaciente } from '../../api/UserApi'; 
import LayoutHeader from '../../components/LayoutHeader';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const HomeView = () => {
  const navigation = useNavigation<any>();
  const user = useAuthStore((state) => state.user);
  const role = useAuthStore((state) => state.role);
  const logoNutri = require('../../assets/hombre.png');

  const esNutricionista = role?.name === 'Nutricionista';
  const esPaciente = role?.name === 'Paciente';

  const { 
    data: dataAdmin, 
    isLoading: isLoadingAdmin, 
    isError: isErrorAdmin, 
    refetch: refetchAdmin, 
    isRefetching: isRefetchingAdmin 
  } = useQuery({
    queryKey: ['datosAdmin'],
    queryFn: datosadministrador,
    enabled: !esPaciente, 
    refetchInterval: 60000, 
    staleTime: 30000,
  });

  const { 
    data: dataPerfil, 
    isLoading: isLoadingPerfil, 
    isError: isErrorPerfil, 
    refetch: refetchPerfil, 
    isRefetching: isRefetchingPerfil 
  } = useQuery({
    queryKey: ['perfilPacienteHome', user?.id],
    queryFn: () => obtenerperfilPaciente({ user_id: user?.id! }),
    enabled: esPaciente, // Habilitado únicamente si es Paciente
    staleTime: 30000,
  });

  useFocusEffect(
    useCallback(() => {
      if (esPaciente) {
        refetchPerfil();
      } else {
        refetchAdmin();
      }
    }, [esPaciente, refetchAdmin, refetchPerfil])
  );
  const isLoading = esPaciente ? isLoadingPerfil : isLoadingAdmin;
  const isError = esPaciente ? isErrorPerfil : isErrorAdmin;
  const isRefetching = esPaciente ? isRefetchingPerfil : isRefetchingAdmin;
  const refetch = esPaciente ? refetchPerfil : refetchAdmin;

  const perfilFisico = dataPerfil?.perfil;

  return (
    <LayoutHeader>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={[AppTheme.primary]}
          />
        }
      >
        <CustomCardInfo
          title={user?.name || 'Usuario sin nombre'}
          subtitle={`Rol: ${role?.name || 'Cargando...'}`}
          extraDetail={user?.email || 'Sin correo registrado'}
          imageSource={logoNutri}
          isActive={true}
        />

        {isLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={AppTheme.primary} />
            <Text style={styles.loadingText}>Cargando panel...</Text>
          </View>
        ) : isError ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>Hubo un problema al cargar la información.</Text>
          </View>
        ) : (
          <View style={styles.mainContainer}>

            {!esNutricionista && !esPaciente && (
              <View style={styles.gridContainer}>
                <View style={styles.row}>
                  <CustomStatCard
                    title="Pacientes"
                    value={dataAdmin?.total_pacientes || 0}
                    icon={<Users color="#3B82F6" size={scale(20)} />}
                    color="#3B82F6"
                  />
                  <CustomStatCard
                    title="Nutricionistas"
                    value={dataAdmin?.total_nutricionistas || 0}
                    icon={<Stethoscope color="#10B981" size={scale(20)} />}
                    color="#10B981"
                  />
                </View>

                <View style={styles.row}>
                  <CustomStatCard
                    title="Usuarios Activos"
                    value={dataAdmin?.total_usuarios_activos || 0}
                    icon={<UserCheck color="#F59E0B" size={scale(20)} />}
                    color="#F59E0B"
                  />
                  <CustomStatCard
                    title="Workspaces"
                    value={dataAdmin?.total_workspaces || 0}
                    icon={<LayoutDashboardIcon color="#8B5CF6" size={scale(20)} />}
                    color="#8B5CF6"
                  />
                </View>
              </View>
            )}

            {esNutricionista && (
              <View style={styles.nutriContainer}>
                <Text variant="titleMedium" style={styles.sectionTitle}>Resumen de Mis Áreas</Text>
                <View style={styles.row}>
                  <CustomStatCard
                    title="Mis Pacientes"
                    value={dataAdmin?.total_pacientes || 0}
                    icon={<Users color={AppTheme.primary} size={scale(20)} />}
                    color={AppTheme.primary}
                  />
                  <CustomStatCard
                    title="Mis Workspaces"
                    value={dataAdmin?.total_workspaces || 0}
                    icon={<LayoutDashboardIcon color="#8B5CF6" size={scale(20)} />}
                    color="#8B5CF6"
                  />
                </View>

                <Text variant="titleMedium" style={[styles.sectionTitle, { marginTop: verticalScale(15) }]}>
                  Accesos Rápidos
                </Text>

                <Surface style={styles.actionItem} elevation={1}>
                  <TouchableOpacity
                    style={styles.actionClickable}
                    onPress={() => navigation.navigate('Empleados')}
                  >
                    <View style={styles.actionLeftRow}>
                      <View style={[styles.iconBadge, { backgroundColor: '#E3F2FD' }]}>
                        <Users color="#1E88E5" size={scale(20)} />
                      </View>
                      <View style={styles.textBlock}>
                        <Text variant="titleSmall" style={styles.actionTitle}>Mis Pacientes</Text>
                        <Text variant="bodySmall" style={styles.actionSubtitle}>Ver expedientes e historial clínico</Text>
                      </View>
                    </View>
                    <ChevronRight color="#9CA3AF" size={scale(18)} />
                  </TouchableOpacity>
                </Surface>

                <Surface style={styles.actionItem} elevation={1}>
                  <TouchableOpacity 
                    style={styles.actionClickable}
                    onPress={() => navigation.navigate('Workspace')} 
                  >
                    <View style={styles.actionLeftRow}>
                      <View style={[styles.iconBadge, { backgroundColor: '#EDE7F6' }]}>
                        <LayoutDashboardIcon color="#5E35B1" size={scale(20)} />
                      </View>
                      <View style={styles.textBlock}>
                        <Text variant="titleSmall" style={styles.actionTitle}>Workspaces</Text>
                        <Text variant="bodySmall" style={styles.actionSubtitle}>Revisar planes nutricionales activos</Text>
                      </View>
                    </View>
                    <ChevronRight color="#9CA3AF" size={scale(18)} />
                  </TouchableOpacity>
                </Surface>

                <Surface style={styles.actionItem} elevation={1}>
                  <TouchableOpacity 
                    style={styles.actionClickable}
                    onPress={() => navigation.navigate('Setting')}
                  >
                    <View style={styles.actionLeftRow}>
                      <View style={[styles.iconBadge, { backgroundColor: '#E8F5E9' }]}>
                        <Apple color="#43A047" size={scale(20)} />
                      </View>
                      <View style={styles.textBlock}>
                        <Text variant="titleSmall" style={styles.actionTitle}>Mi Configuración</Text>
                        <Text variant="bodySmall" style={styles.actionSubtitle}>Gestión de seguridad y perfil personal</Text>
                      </View>
                    </View>
                    <ChevronRight color="#9CA3AF" size={scale(18)} />
                  </TouchableOpacity>
                </Surface>
              </View>
            )}


            {esPaciente && (
              <View style={styles.pacienteContainer}>
                <Text variant="titleMedium" style={styles.sectionTitle}>Mi Composición Corporal</Text>
                
                {!perfilFisico ? (
                  <Card style={styles.emptyCard} mode="outlined">
                    <Card.Content>
                      <Text variant="bodyMedium" style={styles.emptyCardText}>
                        Tu nutricionista aún no ha cargado tus métricas corporales en tu perfil.
                      </Text>
                    </Card.Content>
                  </Card>
                ) : (
                  <>
                    <View style={styles.row}>
                      <CustomStatCard
                        title="Peso Actual"
                        value={`${perfilFisico.weight} kg`}
                        icon={<Scale color="#FF5722" size={scale(20)} />}
                        color="#FF5722"
                      />
                      <CustomStatCard
                        title="Estatura"
                        value={`${perfilFisico.height} m`}
                        icon={<TrendingUp color="#3F51B5" size={scale(20)} />}
                        color="#3F51B5"
                      />
                    </View>

                    <View style={styles.row}>
                      <CustomStatCard
                        title="% Grasa Corporal"
                        value={`${perfilFisico.grasa_corporal} %`}
                        icon={<Heart color="#E91E63" size={scale(20)} />}
                        color="#E91E63"
                      />
                      <CustomStatCard
                        title="Masa Muscular"
                        value={`${perfilFisico.masa_muscular} kg`}
                        icon={<UserCheck color="#4CAF50" size={scale(20)} />}
                        color="#4CAF50"
                      />
                    </View>
                  </>
                )}

                <Text variant="titleMedium" style={[styles.sectionTitle, { marginTop: verticalScale(15) }]}>
                  Mi Tratamiento
                </Text>

                <Surface style={styles.actionItem} elevation={1}>
                  <TouchableOpacity
                    style={styles.actionClickable}
                    onPress={() => navigation.navigate('MiWorkspace')} 
                  >
                    <View style={styles.actionLeftRow}>
                      <View style={[styles.iconBadge, { backgroundColor: '#EDE7F6' }]}>
                        <LayoutDashboardIcon color="#5E35B1" size={scale(20)} />
                      </View>
                      <View style={styles.textBlock}>
                        <Text variant="titleSmall" style={styles.actionTitle}>Mi Consultorio Virtual</Text>
                        <Text variant="bodySmall" style={styles.actionSubtitle}>Ver mis planes dietéticos y nutricionales</Text>
                      </View>
                    </View>
                    <ChevronRight color="#9CA3AF" size={scale(18)} />
                  </TouchableOpacity>
                </Surface>

                <Surface style={styles.actionItem} elevation={1}>
                  <TouchableOpacity 
                    style={styles.actionClickable}
                    onPress={() => navigation.navigate('Setting')}
                  >
                    <View style={styles.actionLeftRow}>
                      <View style={[styles.iconBadge, { backgroundColor: '#E8F5E9' }]}>
                        <Apple color="#43A047" size={scale(20)} />
                      </View>
                      <View style={styles.textBlock}>
                        <Text variant="titleSmall" style={styles.actionTitle}>Mis Datos Personales</Text>
                        <Text variant="bodySmall" style={styles.actionSubtitle}>Actualizar información de contacto y seguridad</Text>
                      </View>
                    </View>
                    <ChevronRight color="#9CA3AF" size={scale(18)} />
                  </TouchableOpacity>
                </Surface>
              </View>
            )}

          </View>
        )}
      </ScrollView>
    </LayoutHeader>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: verticalScale(20),
  },
  mainContainer: {
    flex: 1,
  },
  gridContainer: {
    paddingHorizontal: scale(10),
    marginTop: verticalScale(15),
  },
  nutriContainer: {
    paddingHorizontal: scale(15),
    marginTop: verticalScale(15),
  },
  pacienteContainer: {
    paddingHorizontal: scale(15),
    marginTop: verticalScale(15),
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: verticalScale(10),
    fontSize: scale(14),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(5),
  },
  actionItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: scale(12),
    marginBottom: verticalScale(10),
    overflow: 'hidden',
  },
  actionClickable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(12),
  },
  actionLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBadge: {
    padding: scale(10),
    borderRadius: scale(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBlock: {
    marginLeft: scale(12),
    flex: 1,
  },
  actionTitle: {
    fontWeight: '600',
    color: '#1F2937',
  },
  actionSubtitle: {
    color: '#6B7280',
    fontSize: scale(11),
    marginTop: verticalScale(1),
  },
  centerContainer: {
    marginTop: verticalScale(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: verticalScale(10),
    color: '#6B7280',
  },
  errorText: {
    color: AppTheme.error || '#D32F2F',
    textAlign: 'center',
    paddingHorizontal: scale(20),
  },
  emptyCard: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
    borderRadius: scale(12),
    borderStyle: 'dashed',
    borderWidth: 1,
    paddingVertical: verticalScale(25),
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyCardText: {
    color: '#9CA3AF',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingHorizontal: scale(10)
  }
});

export default HomeView;