import React, { ReactNode, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { Text, Button, Card, TextInput, Portal, Modal, Divider, Chip } from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRoute, useNavigation } from '@react-navigation/native';
import { scale, verticalScale } from 'react-native-size-matters';
import { CalendarDays, Utensils, Search, Plus, MessageSquare, Calendar, XCircle, CheckCircle2, AlertTriangle } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppTheme } from '../../theme/theme';
import Layout from '../../components/Layout';
import { obtenerCatalogoRecetas, asignarRecetaAPlanMensual, crearPlanNutricionalBase } from '../../api/UserApi';
import { RecetaCatalogoItem } from '../../api/UserInterface';
import CustomAlert from '../../components/CustomAlert';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

interface AlertState {
  visible: boolean;
  title: string;
  description: string;
  isConfirm: boolean;
  icon: ReactNode;
  onConfirm: () => void;
}

const SEMANAS = [
  { label: 'Semana 1', value: 1 },
  { label: 'Semana 2', value: 2 },
  { label: 'Semana 3', value: 3 },
  { label: 'Semana 4', value: 4 },
];

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const COMIDAS = ['Desayuno', 'Media Mañana', 'Almuerzo', 'Media Tarde', 'Cena', 'Snack'];

const AsignarPlanNutricionalView = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const { planNutricionalId, workspaceId, pacienteName } = route.params;
  const [alertConfig, setAlertConfig] = useState<AlertState>({
    visible: false,
    title: '',
    description: '',
    isConfirm: false,
    icon: null,
    onConfirm: () => { }
  });
  const hideAlert = () => setAlertConfig(prev => ({ ...prev, visible: false }));
  const showAlert = (title: string, description: string, icon: ReactNode, onConfirm: () => void = hideAlert, isConfirm = false) => {
    setAlertConfig({ visible: true, title, description, icon, isConfirm, onConfirm });
  };
  const [nuevoNombrePlan, setNuevoNombrePlan] = useState<string>('Plan Nutricional Mensual');
  const [fechaInicio, setFechaInicio] = useState<string>(new Date().toISOString().split('T')[0]);
  const [fechaFin, setFechaFin] = useState<string>('');

  const [semana, setSemana] = useState<number>(1);
  const [dia, setDia] = useState<string>('Lunes');
  const [comida, setComida] = useState<string>('Almuerzo');
  const [notas, setNotas] = useState<string>('');
  const [recetaSeleccionada, setRecetaSeleccionada] = useState<RecetaCatalogoItem | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [busqueda, setBusqueda] = useState('');



  const { data: recetas, isLoading: isLoadingRecetas, isError: isErrorRecetas, refetch: recargarRecetas } = useQuery<RecetaCatalogoItem[]>({
    queryKey: ['catalogoRecetasMASTER'],
    queryFn: obtenerCatalogoRecetas,
  });

  const { mutate: crearNuevoPlanMacro, isPending: isCreandoPlan } = useMutation({
    mutationFn: crearPlanNutricionalBase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planNutricionalWorkspace', workspaceId] });
      showAlert('Éxito', 'Estructura del plan mensual inicializada con éxito.', <CheckCircle2 size={scale(30)} color="#10B981" />);
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || error.message || 'No se pudo crear el plan.';
      showAlert('Error', msg, <XCircle size={scale(30)} color={AppTheme.error} />);
    }
  });

  const { mutate: agendarReceta, isPending: isAgendando } = useMutation({
    mutationFn: asignarRecetaAPlanMensual,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planNutricionalWorkspace', workspaceId] });
      queryClient.refetchQueries({ queryKey: ['planNutricionalWorkspace', workspaceId] });
      setRecetaSeleccionada(null);
      setNotas('');
      showAlert(
        'Éxito', 'Receta agendada correctamente.',
        <CheckCircle2 size={scale(30)} color="#10B981" />,
        () => {
          hideAlert();
          navigation.goBack();
        }
      );
    },
    onError: (error: any) => {
      showAlert('Error', error.response?.data?.message || 'Error al agendar.', <XCircle size={scale(30)} color={AppTheme.error} />);
    }
  });

  const handleInicializarPlan = () => {
    if (!nuevoNombrePlan.trim() || !fechaInicio || !fechaFin) {
      showAlert('Atención', 'Por favor complete todos los campos requeridos.', <AlertTriangle size={scale(30)} color={AppTheme.error} />);
      return;
    }

    crearNuevoPlanMacro({
      workspace_id: Number(workspaceId),
      name: nuevoNombrePlan.trim(),
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin
    });
  };

  const handleGuardarAsignacion = () => {
    if (!recetaSeleccionada) {
      showAlert('Atención', 'Debe seleccionar una receta del catálogo.', <AlertTriangle size={scale(30)} color={AppTheme.error} />);
      return;
    }

    agendarReceta({
      plan_nutricional_id: Number(planNutricionalId),
      receta_id: Number(recetaSeleccionada.id),
      semana: semana,
      day: dia as any,
      tipo_comida: comida as any,
      notas: notas.trim() || null
    });
  };

  const recetasFiltradas = Array.isArray(recetas)
    ? recetas.filter(r => r.name.toLowerCase().includes(busqueda.toLowerCase()))
    : [];


  return (
    <Layout>

      <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}
          enableOnAndroid={true}
          extraScrollHeight={verticalScale(50)}
          keyboardOpeningTime={0}
          scrollEnabled={true}
        >

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
            <Card style={styles.infoCard} mode="contained">
              <Card.Content style={styles.infoCardContent}>
                <CalendarDays size={scale(24)} color={AppTheme.primary} />
                <View style={styles.infoTextContainer}>
                  <Text variant="titleMedium" style={styles.infoTitle}>Asignación de Cronograma</Text>
                  <Text variant="bodySmall" style={styles.infoSubtitle}>Paciente: {pacienteName}</Text>
                </View>
              </Card.Content>
            </Card>

            <View>
              <Text variant="labelLarge" style={styles.sectionTitle}>1. Definir Destino del Calendario</Text>

              <Text style={styles.inputLabel}>Seleccionar Semana del Mes</Text>
              <View style={styles.gridRow}>
                {SEMANAS.map((sem) => (
                  <TouchableOpacity
                    key={sem.value}
                    activeOpacity={0.8}
                    onPress={() => setSemana(sem.value)}
                    style={[styles.gridItem, semana === sem.value && styles.gridItemActive]}
                  >
                    <Text style={[styles.gridText, { fontWeight: semana === sem.value ? 'bold' : '400' }]}>
                      {sem.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Seleccionar Día de la Semana</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollChips}>
                {DIAS.map((d) => (
                  <Chip
                    key={d}
                    selected={dia === d}
                    onPress={() => setDia(d)}
                    style={[styles.chipStyle, dia === d && { backgroundColor: AppTheme.primary }]}
                    selectedColor={dia === d ? '#FFFFFF' : '#4B5563'}
                  >
                    {d}
                  </Chip>
                ))}
              </ScrollView>

              <Text style={styles.inputLabel}>Tipo de Ingesta / Bloque de Comida</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollChips}>
                {COMIDAS.map((c) => (
                  <Chip
                    key={c}
                    selected={comida === c}
                    onPress={() => setComida(c)}
                    style={[styles.chipStyle, comida === c && { backgroundColor: AppTheme.primary }]}
                    selectedColor={comida === c ? '#FFFFFF' : '#4B5563'}
                  >
                    {c}
                  </Chip>
                ))}
              </ScrollView>

              <Divider style={styles.formDivider} />
              <Text variant="labelLarge" style={styles.sectionTitle}>2. Seleccionar Alimento del Catálogo</Text>

              {recetaSeleccionada ? (
                <Card style={styles.recipeSelectedCard} mode="outlined">
                  <Card.Content style={styles.recipeCardContent}>
                    <View style={styles.recipeCardText}>
                      <Text variant="titleMedium" style={styles.recipeCardName}>{recetaSeleccionada.name}</Text>
                      <Text variant="bodyMedium" style={styles.recipeCardCalorias}>Aporte: {recetaSeleccionada.calorias} Kcal</Text>
                    </View>
                    <Button mode="text" textColor="#D32F2F" onPress={() => setRecetaSeleccionada(null)}>Cambiar</Button>
                  </Card.Content>
                </Card>
              ) : (
                <Button
                  mode="outlined"
                  icon={() => <Utensils size={scale(16)} color={AppTheme.primary} />}
                  onPress={() => setModalVisible(true)}
                  style={styles.btnSelector}
                >
                  Buscar Receta en el Catálogo
                </Button>
              )}

              <Text variant="labelLarge" style={[styles.sectionTitle, styles.subSectionSpacing]}>3. Notas e Indicaciones Clínicas (Opcional)</Text>
              <TextInput
                mode="outlined"
                placeholder="Ej: Consumir después del entrenamiento, evitar endulzantes..."
                value={notas}
                onChangeText={setNotas}
                multiline
                numberOfLines={3}
                left={<TextInput.Icon icon={() => <MessageSquare size={scale(16)} color="#6B7280" />} />}
                style={styles.textArea}
                outlineColor="#E5E7EB"
                activeOutlineColor={AppTheme.primary}
              />
              <Button
                mode="contained"
                disabled={isAgendando}
                loading={isAgendando}
                onPress={handleGuardarAsignacion}
                style={styles.btnSubmit}
                contentStyle={styles.btnSubmitContent}
              >
                Agendar en Calendario
              </Button>
            </View>


          </ScrollView>
        </KeyboardAwareScrollView>
        <CustomAlert
          visible={alertConfig.visible}
          title={alertConfig.title}
          description={alertConfig.description}
          icon={alertConfig.icon}
          onConfirm={alertConfig.onConfirm}
          onCancel={alertConfig.isConfirm ? hideAlert : undefined}
          confirmText={alertConfig.isConfirm ? "Confirmar" : "Entendido"}
        />
        <Portal>
          <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalContent}>
            <Text variant="titleMedium" style={styles.modalTitle}>Catálogo Maestro de Alimentos</Text>

            <TextInput
              mode="outlined"
              placeholder="Buscar por nombre de platillo..."
              value={busqueda}
              onChangeText={setBusqueda}
              left={<TextInput.Icon icon={() => <Search size={scale(16)} color="#6B7280" />} />}
              style={styles.modalSearchInput}
              dense
            />

            <Divider style={styles.modalDivider} />

            {isLoadingRecetas ? (
              <ActivityIndicator size="small" color={AppTheme.primary} style={styles.modalSpinner} />
            ) : isErrorRecetas ? (
              <View style={styles.modalErrorContainer}>
                <Text style={{ color: AppTheme.error, marginBottom: 10 }}>Error al conectar con el catálogo.</Text>
                <Button mode="outlined" compact onPress={() => recargarRecetas()}>Reintentar</Button>
              </View>
            ) : (
              <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                {recetasFiltradas.length === 0 ? (
                  <Text style={styles.emptySearchText}>No se encontraron recetas coincidentes.</Text>
                ) : (
                  recetasFiltradas.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      activeOpacity={0.7}
                      onPress={() => {
                        setRecetaSeleccionada(item);
                        setModalVisible(false);
                        setBusqueda('');
                      }}
                      style={styles.recipeListItem}
                    >
                      <View style={styles.recipeListItemText}>
                        <Text style={styles.recipeListName}>{item.name}</Text>
                        <Text style={styles.recipeListCalorias}>{item.calorias} kcal</Text>
                      </View>
                      <Plus size={scale(16)} color={AppTheme.primary} />
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>
            )}

            <Button mode="contained" buttonColor="#78909C" onPress={() => setModalVisible(false)} style={styles.btnModalClose}>
              Cerrar Catálogo
            </Button>
          </Modal>
        </Portal>

      </SafeAreaView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  container: {
    paddingHorizontal: scale(10),

    paddingBottom: verticalScale(30)
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
  formDivider: {
    marginVertical: verticalScale(5),
    backgroundColor: '#E5E7EB'
  },

  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: verticalScale(15)
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
    fontWeight: 'bold'
  },
  infoSubtitle: {
    color: '#6B7280'
  },
  planBadge: {
    color: AppTheme.primary,
    fontWeight: 'bold',
    marginTop: 2
  },

  setupCard: {
    backgroundColor: '#FFF9F9',
    borderColor: '#FFCDD2',
    borderRadius: scale(12),
    padding: scale(4),
    marginTop: verticalScale(5)
  },
  setupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    marginBottom: verticalScale(6)
  },
  setupTitle: {
    fontWeight: 'bold',
    color: '#B71C1C'
  },
  setupSubtitle: {
    color: '#555555',
    lineHeight: scale(16),
    marginBottom: verticalScale(15)
  },
  setupInput: {
    backgroundColor: '#FFFFFF',
    marginBottom: verticalScale(10),
    fontSize: scale(13)
  },
  dateRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: verticalScale(5)
  },
  btnInitialize: {
    marginTop: verticalScale(10),
    backgroundColor: '#D32F2F',
    borderRadius: scale(8)
  },

  sectionTitle: {
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: verticalScale(10)
  },
  subSectionSpacing: {
    marginTop: verticalScale(15)
  },
  inputLabel: {
    fontSize: scale(11),
    color: '#6B7280',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: verticalScale(6),
    marginTop: verticalScale(8)
  },
  gridRow: {
    flexDirection: 'row',
    gap: scale(6),
    marginBottom: verticalScale(10)
  },
  gridItem: {
    flex: 1,
    paddingVertical: verticalScale(10),
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: scale(8)
  },
  gridItemActive: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
    borderWidth: 1.5
  },
  gridText: {
    fontSize: scale(12),
    color: '#374151'
  },
  scrollChips: {
    gap: scale(6),
    paddingBottom: verticalScale(10),
    alignItems: 'center'
  },
  chipStyle: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: scale(20)
  },

  btnSelector: {
    borderRadius: scale(8),
    borderColor: AppTheme.primary,
    borderWidth: 1,
    borderStyle: 'dashed',
    backgroundColor: '#F9FAFB'
  },
  recipeSelectedCard: {
    backgroundColor: '#E8F5E9',
    borderColor: '#A5D6A7',
    borderWidth: 1,
    borderRadius: scale(8)
  },
  recipeCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(8)
  },
  recipeCardText: {
    flex: 1
  },
  recipeCardName: {
    fontWeight: 'bold',
    color: '#1B5E20'
  },
  recipeCardCalorias: {
    color: '#2E7D32',
    marginTop: 2
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    paddingVertical: scale(10),
    fontSize: scale(13)
  },
  btnSubmit: {
    marginTop: verticalScale(25),
    borderRadius: scale(8),
    backgroundColor: AppTheme.primary
  },
  btnSubmitContent: {
    paddingVertical: verticalScale(4)
  },

  modalContent: {
    backgroundColor: '#FFFFFF',
    margin: scale(20),
    padding: scale(20),
    borderRadius: scale(16)
  },
  modalTitle: {
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: verticalScale(10),
    textAlign: 'center'
  },
  modalSearchInput: {
    backgroundColor: '#F9FAFB'
  },
  modalDivider: {
    marginVertical: verticalScale(10)
  },
  modalSpinner: {
    marginVertical: 20
  },
  modalScroll: {
    maxHeight: verticalScale(250)
  },
  modalErrorContainer: {
    alignItems: 'center',
    marginVertical: verticalScale(10)
  },
  emptySearchText: {
    textAlign: 'center',
    color: '#9CA3AF',
    marginVertical: 20,
    fontStyle: 'italic'
  },
  recipeListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(10),
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingHorizontal: scale(4)
  },
  recipeListItemText: {
    flex: 1
  },
  recipeListName: {
    fontWeight: '600',
    color: '#374151',
    fontSize: scale(13)
  },
  recipeListCalorias: {
    fontSize: scale(11),
    color: '#6B7280',
    marginTop: 2
  },
  btnModalClose: {
    marginTop: 15
  }
});

export default AsignarPlanNutricionalView;