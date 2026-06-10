import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Text, Card, Avatar } from 'react-native-paper';
import { scale, verticalScale } from 'react-native-size-matters';
import { ShieldCheck, Mail } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // 🚀 Importado

import { AppTheme } from '../../theme/theme';
import Layout from '../../components/Layout';

const PoliticaPrivacidadView = () => {
  return (
    <Layout>
      <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
          
          <View style={styles.headerContainer}>
            <Avatar.Icon 
              size={scale(50)} 
              icon={() => <ShieldCheck size={scale(26)} color="#FFFFFF" />} 
              style={{ backgroundColor: AppTheme.primary }} 
            />
            <Text variant="headlineSmall" style={styles.mainTitle}>Política de Privacidad</Text>
            <Text variant="bodySmall" style={styles.subtitle}>Última actualización: 5 de junio de 2026</Text>
          </View>

          <Card style={styles.card} mode='elevated'>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>1. Información que Recopilamos</Text>
              <Text variant="bodyMedium" style={styles.paragraph}>
                En NutriHabitocc recopilamos datos de cuenta (nombre, apellido, correo electrónico y número de teléfono), información de perfil nutricional (peso, altura, grasa corporal, masa muscular) e historial clínico ingresado mediante los formularios dinámicos en los workspaces.
              </Text>

              <Text variant="titleMedium" style={styles.sectionTitle}>2. Uso de la Información</Text>
              <Text variant="bodyMedium" style={styles.paragraph}>
                Los datos se utilizan exclusivamente para proveer y optimizar las funciones de control nutricional, permitiendo a los nutricionistas gestionar expedientes médicos de forma aislada y organizada por espacio de trabajo.
              </Text>

              <Text variant="titleMedium" style={styles.sectionTitle}>3. Resguardo y Seguridad</Text>
              <Text variant="bodyMedium" style={styles.paragraph}>
                Implementamos medidas técnicas avanzadas como la encriptación de contraseñas mediante algoritmos seguros para evitar el acceso no autorizado. El acceso a las historias clínicas está estrictamente restringido a los miembros del workspace correspondiente.
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.contactCard} mode="contained">
            <Card.Content style={styles.contactContent}>
              <Mail size={scale(20)} color={AppTheme.primary} />
              <View style={styles.contactTextContainer}>
                <Text variant="titleSmall" style={styles.contactTitle}>Contacto de Privacidad</Text>
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

const styles = StyleSheet.create({
  container: { paddingHorizontal: scale(15), paddingTop: verticalScale(15) }, // Eliminamos paddingBottom fijo del ScrollView
  headerContainer: { alignItems: 'center', marginBottom: verticalScale(20), gap: verticalScale(6) },
  mainTitle: { fontWeight: 'bold', color: '#1F2937', marginTop: verticalScale(4) },
  subtitle: { color: '#6B7280' },
  card: { backgroundColor: '#FFFFFF', borderRadius: scale(16), borderColor: '#E5E7EB', borderWidth: 1, padding: scale(4), elevation: 0 },
  sectionTitle: { fontWeight: 'bold', color: AppTheme.primary, marginTop: verticalScale(14), marginBottom: verticalScale(6) },
  paragraph: { color: '#4B5563', lineHeight: scale(20), textAlign: 'justify' },
  contactCard: { marginTop: verticalScale(20), backgroundColor: '#E8F5E9', borderRadius: scale(12), borderWidth: 1, borderColor: '#C8E6C9' },
  contactContent: { flexDirection: 'row', alignItems: 'center', gap: scale(12) },
  contactTextContainer: { flex: 1 },
  contactTitle: { fontWeight: 'bold', color: '#1B5E20' },
  contactEmail: { color: '#2E7D32', fontWeight: '500', marginTop: 2 }
});

export default PoliticaPrivacidadView;