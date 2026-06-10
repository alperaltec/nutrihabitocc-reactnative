import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text, Card, Avatar, Divider, Chip } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { useRoute } from '@react-navigation/native';
import { scale, verticalScale } from 'react-native-size-matters';
import { Calendar, Utensils, Flame, ChevronDown, ChevronUp, Info } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppTheme } from '../../theme/theme';
import Layout from '../../components/Layout';
import { obtenerCronogramaDetallado } from '../../api/WorkSpaceApi';

const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const TIPOS_COMIDA = ['Desayuno', 'Media Mañana', 'Almuerzo', 'Media Tarde', 'Cena', 'Snack'];

const VerPlanNutricionalView = () => {
  const route = useRoute<any>();
  const { planNutricionalId, pacienteName } = route.params;

  const [semanaSeleccionada, setSemanaSeleccionada] = useState<string>('semana_1');
  const [diaSeleccionado, setDiaSeleccionado] = useState<string>('Lunes');
  const [acordeonAbierto, setAcordeonAbierto] = useState<Record<string, boolean>>({});

  const { data: planDetalle, isLoading, isError } = useQuery({
    queryKey: ['cronogramaDetallado', planNutricionalId],
    queryFn: () => obtenerCronogramaDetallado(planNutricionalId),
    enabled: !!planNutricionalId
  });

  const plan = planDetalle;
  const toggleComida = (comida: string) => {
    setAcordeonAbierto(prev => ({ ...prev, [comida]: !prev[comida] }));
  };

  if (isLoading) {
    return (
      <Layout>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={AppTheme.primary} />
          <Text style={styles.loadingText}>Cargando cronograma nutricional...</Text>
        </View>
      </Layout>
    );
  }

  if (isError || !plan) {
    return (
      <Layout>
        <View style={styles.centerContainer}>
          <Utensils size={scale(48)} color="#9CA3AF" />
          <Text style={styles.emptyText}>
            {plan === null
              ? 'Este espacio de trabajo aún no cuenta con un plan nutricional estructurado.'
              : 'Error al conectar con el servidor.'}
          </Text>
        </View>
      </Layout>
    );
  }

  const cronograma = plan?.cronograma || {};
  const recetasSemana = cronograma[semanaSeleccionada] || {};
  const recetasDia = recetasSemana[diaSeleccionado] || {};

  return (
    <Layout>
      <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
        <View style={styles.bannerPlan}>
          <View style={styles.bannerHeaderRow}>
            <Calendar size={scale(18)} color={AppTheme.primary} />
            <Text variant="titleMedium" style={styles.bannerTitle}>{plan.name}</Text>
          </View>
          <Text variant="bodySmall" style={styles.bannerSubtitle}>
            Paciente: <Text style={styles.patientNameHighlight}>{pacienteName}</Text>
          </Text>
        </View>
        <View style={styles.semanasContainer}>
          {['semana_1', 'semana_2', 'semana_3', 'semana_4'].map((sem, index) => {
            const esActiva = semanaSeleccionada === sem;
            return (
              <TouchableOpacity
                key={sem}
                activeOpacity={0.8}
                onPress={() => setSemanaSeleccionada(sem)}
                style={[styles.btnSemana, esActiva && styles.btnSemanaActiva]}
              >
                <Text style={[styles.txtSemana, esActiva && styles.txtSemanaActiva]}>
                  Sem {index + 1}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={styles.diasWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.diasScroll}>
            {DIAS_SEMANA.map((dia) => {
              const esActivo = diaSeleccionado === dia;
              return (
                <Chip
                  key={dia}
                  selected={esActivo}
                  onPress={() => setDiaSeleccionado(dia)}
                  style={[styles.chipDia, esActivo && { backgroundColor: AppTheme.primary }]}
                  selectedColor={esActivo ? '#FFFFFF' : '#4B5563'}
                  showSelectedOverlay
                >
                  {dia}
                </Chip>
              );
            })}
          </ScrollView>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.comidasContainer}>
          {TIPOS_COMIDA.map((comida) => {
            const receta = recetasDia[comida];
            const estaAbierto = !!acordeonAbierto[comida];

            return (
              <Card key={comida} style={styles.cardComida} mode="outlined">
                <TouchableOpacity activeOpacity={0.9} onPress={() => receta && toggleComida(comida)}>
                  <View style={styles.comidaHeader}>
                    <View style={styles.comidaTitleContainer}>
                      <Text variant="labelLarge" style={styles.tipoComidaTitle}>{comida}</Text>
                      <Text variant="bodyMedium" style={[styles.recetaName, !receta && styles.recetaEmptyName]}>
                        {receta ? receta.name : 'Sin receta asignada para este bloque'}
                      </Text>
                    </View>

                    {receta ? (
                      <View style={styles.headerRightActions}>
                        <View style={styles.badgeCalorias}>
                          <Flame size={scale(14)} color="#E65100" />
                          <Text style={styles.txtCalorias}>{receta.calorias} kcal</Text>
                        </View>
                        {estaAbierto ? <ChevronUp size={scale(18)} color="#6B7280" /> : <ChevronDown size={scale(18)} color="#6B7280" />}
                      </View>
                    ) : (
                      <Utensils size={scale(16)} color="#D1D5DB" />
                    )}
                  </View>
                </TouchableOpacity>

                {receta && estaAbierto && (
                  <View style={styles.comidaDetail}>
                    <Divider style={styles.detailDivider} />

                    <Text variant="labelSmall" style={styles.subSectionTitle}>Macronutrientes Básicos</Text>
                    <View style={styles.macrosRow}>
                      <View style={styles.macroBox}><Text style={styles.macroVal}>{receta.informacion?.macronutrientes?.proteinas}g</Text><Text style={styles.macroLbl}>Prot</Text></View>
                      <View style={styles.macroBox}><Text style={styles.macroVal}>{receta.informacion?.macronutrientes?.carbohidratos}g</Text><Text style={styles.macroLbl}>Carb</Text></View>
                      <View style={styles.macroBox}><Text style={styles.macroVal}>{receta.informacion?.macronutrientes?.grasas}g</Text><Text style={styles.macroLbl}>Grasas</Text></View>
                      {receta.informacion?.macronutrientes?.fibra && (
                        <View style={styles.macroBox}><Text style={styles.macroVal}>{receta.informacion.macronutrientes.fibra}g</Text><Text style={styles.macroLbl}>Fibra</Text></View>
                      )}
                    </View>

                    {receta.notas && (
                      <View style={styles.notesContainer}>
                        <Info size={scale(14)} color="#D84315" style={styles.noteIcon} />
                        <Text style={styles.txtNotes}>{receta.notas}</Text>
                      </View>
                    )}

                    <Text variant="labelSmall" style={[styles.subSectionTitle, styles.subSectionSpacing]}>Ingredientes y Porciones</Text>
                    {receta.informacion?.ingredientes?.map((ing: any, idx: number) => (
                      <Text key={`ing-${idx}`} style={styles.bulletItem}>
                        • {ing.nombre}: <Text style={styles.ingredientWeight}>{ing.cantidad} {ing.unidad}</Text>
                      </Text>
                    ))}
                    <Text variant="labelSmall" style={[styles.subSectionTitle, styles.subSectionSpacing]}>Preparación Paso a Paso</Text>
                    {receta.informacion?.preparacion?.map((paso: any, idx: number) => (
                      <Text key={`paso-${idx}`} style={styles.stepItem}>
                        <Text style={styles.stepNumber}>{paso.paso}. </Text>
                        {paso.descripcion}
                      </Text>
                    ))}
                  </View>
                )}
              </Card>
            );
          })}
          <View style={styles.scrollSpacer} />
        </ScrollView>
      </SafeAreaView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(20)
  },
  scrollSpacer: {
    height: verticalScale(40)
  },
  loadingText: {
    marginTop: 10,
    color: '#6B7280'
  },
  emptyText: {
    textAlign: 'center',
    color: '#9CA3AF',
    marginTop: scale(12),
    paddingHorizontal: scale(30),
    fontStyle: 'italic'
  },
  bannerPlan: {
    backgroundColor: '#FFFFFF',
    padding: scale(15),
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6'
  },
  bannerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8)
  },
  bannerTitle: {
    fontWeight: 'bold',
    color: '#1F2937'
  },
  bannerSubtitle: {
    color: '#6B7280',
    marginTop: 2
  },
  patientNameHighlight: {
    fontWeight: '600'
  },
  semanasContainer: {
    flexDirection: 'row',
    paddingHorizontal: scale(15),
    paddingVertical: verticalScale(10),
    gap: scale(8)
  },
  btnSemana: {
    flex: 1,
    paddingVertical: verticalScale(8),
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: scale(8)
  },
  btnSemanaActiva: {
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: '#A5D6A7'
  },
  txtSemana: {
    fontWeight: '500',
    color: '#4B5563',
    fontSize: scale(12)
  },
  txtSemanaActiva: {
    color: '#2E7D32',
    fontWeight: 'bold'
  },
  diasWrapper: {
    height: verticalScale(40),
    marginBottom: verticalScale(10)
  },
  diasScroll: {
    paddingHorizontal: scale(15),
    gap: scale(6),
    alignItems: 'center'
  },
  chipDia: {
    height: verticalScale(32),
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: scale(20)
  },
  comidasContainer: {
    paddingHorizontal: scale(15),
    paddingTop: verticalScale(5)
  },
  cardComida: {
    backgroundColor: '#FFFFFF',
    borderRadius: scale(12),
    borderColor: '#E5E7EB',
    marginBottom: verticalScale(10),
    elevation: 0,
    overflow: 'hidden'
  },
  comidaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: scale(14)
  },
  comidaTitleContainer: {
    flex: 1
  },
  tipoComidaTitle: {
    color: AppTheme.primary,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: scale(10),
    letterSpacing: 0.5
  },
  recetaName: {
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 2,
    fontSize: scale(13)
  },
  recetaEmptyName: {
    color: '#9CA3AF',
    fontStyle: 'italic'
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8)
  },
  badgeCalorias: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
    backgroundColor: '#FFF3E0',
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
    borderRadius: scale(6)
  },
  txtCalorias: {
    fontSize: scale(11),
    color: '#E65100',
    fontWeight: '600'
  },
  comidaDetail: {
    paddingHorizontal: scale(14),
    paddingBottom: scale(14)
  },
  detailDivider: {
    marginBottom: verticalScale(10)
  },
  subSectionTitle: {
    color: '#6B7280',
    fontWeight: '700',
    textTransform: 'uppercase',
    fontSize: scale(9),
    marginBottom: scale(6)
  },
  subSectionSpacing: {
    marginTop: verticalScale(12)
  },
  macrosRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    padding: scale(10),
    borderRadius: scale(8),
    borderWidth: 1,
    borderColor: '#F3F4F6'
  },
  macroBox: {
    alignItems: 'center',
    flex: 1
  },
  macroVal: {
    fontSize: scale(12),
    fontWeight: 'bold',
    color: '#1F2937'
  },
  macroLbl: {
    fontSize: scale(10),
    color: '#6B7280',
    marginTop: 2
  },
  notesContainer: {
    flexDirection: 'row',
    gap: scale(6),
    backgroundColor: '#FBE9E7',
    padding: scale(10),
    borderRadius: scale(8),
    marginTop: verticalScale(10),
    borderLeftWidth: 3,
    borderLeftColor: '#FF5722'
  },
  noteIcon: {
    marginTop: 2
  },
  txtNotes: {
    fontSize: scale(11),
    color: '#D84315',
    flex: 1,
    lineHeight: scale(15)
  },
  bulletItem: {
    color: '#4B5563',
    fontSize: scale(12),
    marginBottom: 4,
    marginLeft: scale(4)
  },
  ingredientWeight: {
    fontWeight: '600'
  },
  stepItem: {
    color: '#4B5563',
    fontSize: scale(12),
    marginBottom: scale(6),
    textAlign: 'justify',
    lineHeight: scale(16)
  },
  stepNumber: {
    fontWeight: 'bold',
    color: AppTheme.primary
  }
});

export default VerPlanNutricionalView;