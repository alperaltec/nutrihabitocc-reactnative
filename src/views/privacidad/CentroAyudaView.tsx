import React, { useState } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Text, Card, Avatar, List, Divider } from 'react-native-paper';
import { scale, verticalScale } from 'react-native-size-matters';
import { HelpCircle, Mail, Settings, Briefcase, Wrench } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // 🚀 Importado

import { AppTheme } from '../../theme/theme';
import Layout from '../../components/Layout';

const CentroAyudaView = () => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    faq1: false,
    faq2: false,
    faq3: false,
    faq4: false,
  });

  const toggleExpand = (key: string) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Layout>
      <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
          
          <View style={styles.headerContainer}>
            <Avatar.Icon 
              size={scale(50)} 
              icon={() => <HelpCircle size={scale(26)} color="#FFFFFF" />} 
              style={{ backgroundColor: AppTheme.primary }} 
            />
            <Text variant="headlineSmall" style={styles.mainTitle}>Centro de Ayuda</Text>
            <Text variant="bodySmall" style={styles.subtitle}>Preguntas frecuentes y soporte técnico</Text>
          </View>

          <List.Section style={styles.accordionGroup}>
            
            <List.Accordion
              title="¿Cómo cambio mis datos o teléfono?"
              left={props => <Settings {...props} size={scale(20)} color="#4B5563" />}
              expanded={expanded.faq1}
              onPress={() => toggleExpand('faq1')}
              style={styles.accordionHeader}
              titleStyle={styles.accordionTitle}
            >
              <View style={styles.accordionContent}>
                <Text variant="bodyMedium" style={styles.contentText}>
                  Dirígete a la sección de <Text style={{fontWeight:'bold'}}>Configuración &gt; Cuenta &gt; Editar Perfil</Text>. Modifica los campos que requieras y guarda los cambios. Se actualizarán inmediatamente en tus consultas.
                </Text>
              </View>
            </List.Accordion>

            <Divider style={styles.divider} />

            <List.Accordion
              title="¿Qué es el Modo Previsualización?"
              left={props => <Info {...props} size={scale(20)} color="#4B5563" />}
              expanded={expanded.faq2}
              onPress={() => toggleExpand('faq2')}
              style={styles.accordionHeader}
              titleStyle={styles.accordionTitle}
            >
              <View style={styles.accordionContent}>
                <Text variant="bodyMedium" style={styles.contentText}>
                  Aparece cuando entras desde <Text style={{fontWeight:'bold'}}>“Nueva Ficha”</Text>. Permite explorar los campos y secciones de la plantilla maestra antes de asignarla formalmente. En este modo no se procesa el guardado de respuestas clínicas.
                </Text>
              </View>
            </List.Accordion>

            <Divider style={styles.divider} />

            <List.Accordion
              title="¿Cómo lleno el historial del paciente?"
              left={props => <Briefcase {...props} size={scale(20)} color="#4B5563" />}
              expanded={expanded.faq3}
              onPress={() => toggleExpand('faq3')}
              style={styles.accordionHeader}
              titleStyle={styles.accordionTitle}
            >
              <View style={styles.accordionContent}>
                <Text variant="bodyMedium" style={styles.contentText}>
                  Asegúrate de que la plantilla esté vinculada, entra al Workspace de tu paciente, presiona el botón <Text style={{fontWeight:'bold'}}>“Ficha”</Text> y selecciona la plantilla correspondiente de la lista para cargar o registrar el progreso clínico.
                </Text>
              </View>
            </List.Accordion>

            <Divider style={styles.divider} />

            <List.Accordion
              title="¿Por qué solo permite un paciente por espacio?"
              left={props => <Wrench {...props} size={scale(20)} color="#4B5563" />}
              expanded={expanded.faq4}
              onPress={() => toggleExpand('faq4')}
              style={styles.accordionHeader}
              titleStyle={styles.accordionTitle}
            >
              <View style={styles.accordionContent}>
                <Text variant="bodyMedium" style={styles.contentText}>
                  Por diseño de seguridad médica, cada Workspace asocia estrictamente a un único Paciente Titular para blindar el expediente ante cruces accidentales de datos entre consultas.
                </Text>
              </View>
            </List.Accordion>

          </List.Section>

          <Card style={styles.contactCard} mode="contained">
            <Card.Content style={styles.contactContent}>
              <Mail size={scale(20)} color={AppTheme.primary} />
              <View style={styles.contactTextContainer}>
                <Text variant="titleSmall" style={styles.contactTitle}>¿Necesitas soporte técnico personalizado?</Text>
                <Text variant="bodySmall" style={styles.contactSubtitle}>Escríbenos detallando tu caso o adjuntando capturas de pantalla:</Text>
                <Text variant="bodyMedium" style={styles.contactEmail}>soporte@nutrihabitocc.com</Text>
              </View>
            </Card.Content>
          </Card>

          {/* 🚀 Colchón de espaciado para elevar el contenido sobre el menú inferior */}
          <View style={{ height: verticalScale(60) }} />

        </ScrollView>
      </SafeAreaView>
    </Layout>
  );
};

const Info = ({ size, color, ...props }: any) => <HelpCircle size={size} color={color} {...props} />;

const styles = StyleSheet.create({
  container: { paddingHorizontal: scale(15), paddingTop: verticalScale(15) }, // Eliminamos paddingBottom fijo del ScrollView
  headerContainer: { alignItems: 'center', marginBottom: verticalScale(15), gap: verticalScale(6) },
  mainTitle: { fontWeight: 'bold', color: '#1F2937', marginTop: verticalScale(4) },
  subtitle: { color: '#6B7280' },
  accordionGroup: { backgroundColor: '#FFFFFF', borderRadius: scale(16), overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB', elevation: 0, marginBottom: verticalScale(15) },
  accordionHeader: { backgroundColor: '#FFFFFF', paddingVertical: verticalScale(2) },
  accordionTitle: { fontWeight: '600', color: '#1F2937', fontSize: scale(13) },
  accordionContent: { backgroundColor: '#F9FAFB', paddingHorizontal: scale(20), paddingVertical: verticalScale(12), borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  contentText: { color: '#4B5563', lineHeight: scale(18), textAlign: 'justify' },
  divider: { backgroundColor: '#F3F4F6', height: 1 },
  contactCard: { backgroundColor: '#FFF3E0', borderRadius: scale(12), borderWidth: 1, borderColor: '#FFE0B2' },
  contactContent: { flexDirection: 'row', alignItems: 'flex-start', gap: scale(12), paddingTop: verticalScale(12) },
  contactTextContainer: { flex: 1 },
  contactTitle: { fontWeight: 'bold', color: '#E65100', fontSize: scale(13) },
  contactSubtitle: { color: '#E65100', opacity: 0.8, marginTop: 2, marginBottom: 6, fontSize: scale(11) },
  contactEmail: { color: '#EF6C00', fontWeight: 'bold', fontSize: scale(13) }
});

export default CentroAyudaView;