import React from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Text, Card, Avatar, List } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { useRoute, useNavigation } from '@react-navigation/native';
import { scale, verticalScale } from 'react-native-size-matters';
import { FileText, ChevronRight, ClipboardList } from 'lucide-react-native';

import { AppTheme } from '../../theme/theme';
import { listarPlantillasDisponibles } from '../../api/UserApi';
import { PlantillasRequest } from '../../api/UserInterface';
import Layout from '../../components/Layout';

const SeleccionarNuevaFichaView = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { workspaceId, userId, pacienteName } = route.params;


  const { data: plantillas, isLoading, isError, refetch } = useQuery<PlantillasRequest[]>({
    queryKey: ['todasLasPlantillasSistema'],
    queryFn: listarPlantillasDisponibles,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  return (
    <Layout>
      <View style={styles.container}>
        <View style={styles.banner}>
          <Text variant="titleMedium" style={styles.bannerText}>Modelos Clínicos Disponibles</Text>
          <Text variant="bodySmall" style={styles.bannerSubtitle}>
            Selecciona una plantilla base para estructurar e inicializar el expediente del paciente.
          </Text>
        </View>

        {isLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={AppTheme.primary} />
            <Text style={styles.loadingText}>Buscando formularios...</Text>
          </View>
        ) : isError ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>Error al conectar con las plantillas.</Text>
            <TouchableOpacity onPress={() => refetch()} style={styles.retryButton}>
              <Text style={styles.retryText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={plantillas}
            keyExtractor={(item) => `nueva-ficha-${item.id}`}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <Card style={styles.card} mode="outlined">
                <TouchableOpacity 
                  activeOpacity={0.7} 
                  onPress={() => navigation.navigate('LlenarHistorialClinico', {
                    workspaceId, 
                    userId, 
                    pacienteName, 
                    plantillaId: item.id, 
                    plantillaName: item.name,
                    modo: 'crear' 
                  })}
                >
                  <List.Item
                    title={item.name}
                    description={`Versión del documento: v${item.version}`}
                    titleStyle={styles.itemTitle}
                    descriptionStyle={styles.itemDescription}
                    left={() => (
                      <View style={styles.leftIconWrapper}>
                        <Avatar.Icon size={scale(36)} icon={() => <FileText size={scale(18)} color={AppTheme.primary} />} style={styles.avatarIcon} />
                      </View>
                    )}
                    right={() => (
                      <View style={styles.rightIconWrapper}>
                        <ChevronRight size={scale(18)} color="#9CA3AF" />
                      </View>
                    )}
                  />
                </TouchableOpacity>
              </Card>
            )}
            ListEmptyComponent={
              <View style={styles.centerContainer}>
                <ClipboardList size={scale(48)} color="#9CA3AF" />
                <Text style={styles.emptyText}>No hay moldes de historias clínicas cargados en el sistema.</Text>
              </View>
            }
          />
        )}
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingTop: verticalScale(10) 
  }, 
  banner: { 
    padding: scale(15), 
    backgroundColor: '#F3F4F6', 
    marginHorizontal: scale(15), 
    borderRadius: scale(12), 
    marginBottom: verticalScale(16) 
  }, 
  bannerText: { 
    fontWeight: 'bold', 
    color: '#1F2937' 
  }, 
  bannerSubtitle: {
    color: '#6B7280',
    marginTop: 2
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
  }
});

export default SeleccionarNuevaFichaView;
