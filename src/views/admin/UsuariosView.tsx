import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { Text, Searchbar, Menu, IconButton, Checkbox } from 'react-native-paper';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { scale, verticalScale } from 'react-native-size-matters';
import { MoreVertical, ShieldAlert, FileHeart, RefreshCw } from 'lucide-react-native';
import Layout from '../../components/Layout';
import CustomCardInfo from '../../components/CustomCardInfo';
import { AppTheme } from '../../theme/theme';
import { listadousuarios } from '../../api/UserApi';
import { UsuariosResponse } from '../../api/UserInterface';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import LayoutHeader from '../../components/LayoutHeader';
import { useAuthStore } from '../../store/useAuthStore'; 

const UsuariosView = () => {
  const queryClient = useQueryClient();
  const navigation = useNavigation<any>();

  const roleState = useAuthStore((state) => state.role);
  const esNutricionista = roleState?.name === 'Nutricionista';

  const [searchQuery, setSearchQuery] = useState('');
  const [visibleMenuId, setVisibleMenuId] = useState<number | null>(null);
  const [isPaciente, setIsPaciente] = useState(false);
  const [isNutricionista, setIsNutricionista] = useState(false);
  const [isInactivo, setIsInactivo] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 800);

  const { data: usuarios, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['listadoUsuarios', debouncedSearchQuery, isPaciente, isNutricionista, isInactivo],
    queryFn: () => listadousuarios({
      filtro_usuario: esNutricionista ? true : isPaciente,
      filtro_nutricionista: esNutricionista ? false : isNutricionista,
      filtro_inactivos: esNutricionista ? false : isInactivo,
      buscar_nombre: debouncedSearchQuery
    }),
    staleTime: 30000,
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const handleToggleStatus = (usuario: UsuariosResponse) => {
    setVisibleMenuId(null);
    navigation.navigate('CambiarUsuarioEstado', {
      userId: usuario.id,
      userName: `${usuario.name} ${usuario.last_name}`,
      isActive: usuario.is_active === true || String(usuario.is_active) === '1'
    });
  };

  const handleResetPassword = (usuario: UsuariosResponse) => {
    setVisibleMenuId(null);
    navigation.navigate('CambiarPassword', {
      userId: usuario.id,
      userName: `${usuario.name} ${usuario.last_name}`
    });
  };

  const handleEditNutritionProfile = (usuario: UsuariosResponse) => {
    setVisibleMenuId(null);
    navigation.navigate('Perfil', {
      userId: usuario.id,
      userName: `${usuario.name} ${usuario.last_name}`
    });
  };

  const renderItem = ({ item }: { item: UsuariosResponse }) => {
    const isUserActive = item.is_active === true || String(item.is_active) === '1';
    const isUserPaciente = item.roles?.some(rol => rol.name === 'Paciente') ?? false;

    return (
      <View style={styles.cardWrapper}>
        <View style={{ flex: 1 }}>
          <CustomCardInfo
            title={`${item.name} ${item.last_name}`}
            subtitle={item.email}
            extraDetail={item.phone_number || 'Sin teléfono'}
            isActive={isUserActive}
          />
        </View>
        <View style={styles.menuContainer}>
          <Menu
            visible={visibleMenuId === item.id}
            onDismiss={() => setVisibleMenuId(null)}
            anchor={
              <IconButton
                icon={() => <MoreVertical color="#6B7280" size={scale(20)} />}
                onPress={() => setVisibleMenuId(item.id)}
              />
            }
          >
            {!esNutricionista && (
              <>
                <Menu.Item
                  onPress={() => handleToggleStatus(item)}
                  title={isUserActive ? "Desactivar Cuenta" : "Activar Cuenta"}
                  leadingIcon={() => <ShieldAlert size={scale(18)} color={isUserActive ? '#D32F2F' : '#4CAF50'} />}
                />
                <Menu.Item
                  onPress={() => handleResetPassword(item)}
                  title="Cambiar Contraseña"
                  leadingIcon={() => <RefreshCw size={scale(18)} color="#4B5563" />}
                />
              </>
            )}

            {isUserPaciente && (
              <Menu.Item
                onPress={() => handleEditNutritionProfile(item)}
                title="Perfil Alimenticio"
                leadingIcon={() => <FileHeart size={scale(18)} color={AppTheme.primary} />}
              />
            )}
          </Menu>
        </View>
      </View>
    );
  };

  return (
    <LayoutHeader>
      <View style={styles.mainContainer}>

        <Searchbar
          placeholder="Buscar usuarios..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
          inputStyle={styles.searchInput}
        />

        {!esNutricionista && (
          <View style={styles.checkboxContainer}>
            <View style={styles.checkboxWrapper}>
              <Checkbox.Android
                status={isPaciente ? 'checked' : 'unchecked'}
                onPress={() => setIsPaciente(!isPaciente)}
                color={AppTheme.primary}
              />
              <Text variant="bodyMedium" style={styles.checkboxLabel}>Pacientes</Text>
            </View>

            <View style={styles.checkboxWrapper}>
              <Checkbox.Android
                status={isNutricionista ? 'checked' : 'unchecked'}
                onPress={() => setIsNutricionista(!isNutricionista)}
                color={AppTheme.primary}
              />
              <Text variant="bodyMedium" style={styles.checkboxLabel}>Nutricionistas</Text>
            </View>

            <View style={styles.checkboxWrapper}>
              <Checkbox.Android
                status={isInactivo ? 'checked' : 'unchecked'}
                onPress={() => setIsInactivo(!isInactivo)}
                color={AppTheme.primary}
              />
              <Text variant="bodyMedium" style={styles.checkboxLabel}>Inactivos</Text>
            </View>
          </View>
        )}

        {isLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={AppTheme.primary} />
          </View>
        ) : isError ? (
          <View style={styles.centerContainer}>
            <Text style={{ color: AppTheme.error }}>Error al cargar el listado.</Text>
          </View>
        ) : (
          <FlatList
            data={usuarios}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[AppTheme.primary]} />
            }
            ListEmptyComponent={
              <Text style={styles.emptyText}>No se encontraron usuarios asignados.</Text>
            }
          />
        )}
      </View>
    </LayoutHeader>
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
    marginBottom: verticalScale(10),
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
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginHorizontal: scale(15),
    marginBottom: verticalScale(10),
    gap: scale(10), 
  },
  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    color: '#4B5563',
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: verticalScale(20),
  },
  cardWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  menuContainer: {
    position: 'absolute',
    right: scale(20),
    top: verticalScale(22),
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: verticalScale(40),
  },
});

export default UsuariosView;