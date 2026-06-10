import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Text, Card, Avatar } from 'react-native-paper';
import { scale, verticalScale } from 'react-native-size-matters';
import { FileText, Mail } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // 🚀 Importado

import { AppTheme } from '../../theme/theme';
import Layout from '../../components/Layout';

const TerminosCondicionesView = () => {
  return (
    <Layout>
      <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
          
          <View style={styles.headerContainer}>
            <Avatar.Icon 
              size={scale(50)} 
              icon={() => <FileText size={scale(24)} color="#FFFFFF" />} 
              style={{ backgroundColor: AppTheme.primary }} 
            />
            <Text variant="headlineSmall" style={styles.mainTitle}>Términos y Condiciones</Text>
            <Text variant="bodySmall" style={styles.subtitle}>Última actualización: 5 de junio de 2026</Text>
          </View>

          <Card style={styles.card} mode='elevated'>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>1. Naturaleza del Servicio</Text>
              <Text variant="bodyMedium" style={styles.paragraph}>
                NutriHabitocc provee un entorno virtual de administración nutricional mediante la asignación de miembros y el llenado de fichas clínicas en workspaces. La app funciona como soporte profesional y no reemplaza emergencias médicas.
              </Text>

              <Text variant="titleMedium" style={styles.sectionTitle}>2. Uso de Cuentas y Responsabilidad</Text>
              <Text variant="bodyMedium" style={styles.paragraph}>
                Cada usuario es responsable de salvaguardar sus credenciales de acceso. Las cuentas siguen reglas estrictas de asignación (un paciente no podrá estar en más de un workspace activo diariamente y cada espacio admite solo un paciente titular).
              </Text>

              <Text variant="titleMedium" style={styles.sectionTitle}>3. Propiedad Intelectual</Text>
              <Text variant="bodyMedium" style={styles.paragraph}>
                Todo el código fuente, diseño de interfaces, arquitectura lógica de renderizado dinámico de formularios y moldes maestros pertenecen exclusivamente a NutriHabitocc y se encuentran protegidos bajo las leyes vigentes.
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.contactCard} mode="contained">
            <Card.Content style={styles.contactContent}>
              <Mail size={scale(20)} color={AppTheme.primary} />
              <View style={styles.contactTextContainer}>
                <Text variant="titleSmall" style={styles.contactTitle}>Soporte Legal</Text>
                <Text variant="bodyMedium" style={styles.contactEmail}>legal@nutrihabitocc.com</Text>
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

const styles = StyleSheet.create({
  container: { paddingHorizontal: scale(15), paddingTop: verticalScale(15) }, // Eliminamos paddingBottom fijo del ScrollView
  headerContainer: { alignItems: 'center', marginBottom: verticalScale(20), gap: verticalScale(6) },
  mainTitle: { fontWeight: 'bold', color: '#1F2937', marginTop: verticalScale(4) },
  subtitle: { color: '#6B7280' },
  card: { backgroundColor: '#FFFFFF', borderRadius: scale(16), borderColor: '#E5E7EB', borderWidth: 1, padding: scale(4), elevation: 0 },
  sectionTitle: { fontWeight: 'bold', color: AppTheme.primary, marginTop: verticalScale(14), marginBottom: verticalScale(6) },
  paragraph: { color: '#4B5563', lineHeight: scale(20), textAlign: 'justify' },
  contactCard: { marginTop: verticalScale(20), backgroundColor: '#EAF2F8', borderRadius: scale(12), borderWidth: 1, borderColor: '#BBDEFB' },
  contactContent: { flexDirection: 'row', alignItems: 'center', gap: scale(12) },
  contactTextContainer: { flex: 1 },
  contactTitle: { fontWeight: 'bold', color: '#0D47A1' },
  contactEmail: { color: '#1565C0', fontWeight: '500', marginTop: 2 }
});

export default TerminosCondicionesView;