import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Text, Switch, Divider, Button } from 'react-native-paper';
import { scale, verticalScale } from 'react-native-size-matters';
import {
  User,
  Bell,
  Shield,
  ChevronRight,
  LogOut,
  HelpCircle,
  FileText,
  ShieldCheck
} from 'lucide-react-native';
import Layout from '../../components/Layout';
import { AppTheme } from '../../theme/theme';
import { useAuthStore } from '../../store/useAuthStore';
import LayoutHeader from '../../components/LayoutHeader';
import { useNavigation } from '@react-navigation/native';

const ConfiguracionView = () => {
  const navigation = useNavigation();
  const logout = useAuthStore((state) => state.logout);
  const [notifications, setNotifications] = useState(true);
  const user = useAuthStore((state) => state.user);

  const SettingOption = ({ icon: Icon, title, rightElement, onPress, color = '#4B5563' }: any) => (
    <TouchableOpacity
      style={styles.optionContainer}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
    >
      <View style={styles.optionLeft}>
        <Icon color={color} size={scale(22)} />
        <Text variant="bodyLarge" style={[styles.optionTitle, { color }]}>
          {title}
        </Text>
      </View>
      {rightElement ? rightElement : <ChevronRight color="#9CA3AF" size={scale(20)} />}
    </TouchableOpacity>
  );

  return (
    <LayoutHeader>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>

        <Text variant="labelLarge" style={styles.sectionTitle}>Cuenta</Text>
        <View style={styles.card}>
          <SettingOption
            icon={User}
            title="Editar Perfil"
            onPress={() => navigation.navigate('EditarPerfilConfig', {
              userId: user?.id,
              name: user?.name,
              lastName: user?.last_name,
              email: user?.email,
              phone: user?.phone_number || ''
            })}
          />
          <Divider style={styles.divider} />
          <SettingOption
            icon={Shield}
            title="Seguridad y Contraseña"
            onPress={() => navigation.navigate('CambiarPassword', {
              userId: user?.id,
              userName: `${user?.name} ${user?.last_name}`
            })}
          />
        </View>

        <Text variant="labelLarge" style={styles.sectionTitle}>Preferencias</Text>
        <View style={styles.card}>
          <SettingOption
            icon={Bell}
            title="Notificaciones Push"
            rightElement={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                color={AppTheme.primary}
              />
            }
          />
        </View>

        <Text variant="labelLarge" style={styles.sectionTitle}>Soporte</Text>
        <View style={styles.card}>
          <SettingOption
            icon={HelpCircle}
            title="Centro de Ayuda"
            onPress={() => navigation.navigate('CentroAyuda')}
          />
        </View>

        <Text variant="labelLarge" style={styles.sectionTitle}>Legal y Privacidad</Text>
        <View style={styles.card}>
          <SettingOption
            icon={ShieldCheck}
            title="Política de Privacidad"
            onPress={() => navigation.navigate('PoliticaPrivacidad')}
          />
          <Divider style={styles.divider} />
          <SettingOption
            icon={FileText}
            title="Términos y Condiciones"
            onPress={() => navigation.navigate('TerminosCondiciones')}
          />
        </View>

        <View style={styles.logoutContainer}>
          <Button
            mode="contained"
            buttonColor={AppTheme.error || '#D32F2F'}
            onPress={() => logout()}
            style={styles.btnLogout}
            labelStyle={styles.btnLogoutLabel}
            icon={({ size, color }) => <LogOut size={size} color={color} />}
          >
            Cerrar Sesión
          </Button>
        </View>

      </ScrollView>
    </LayoutHeader>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: verticalScale(15),
    paddingHorizontal: scale(15),
    paddingBottom: verticalScale(40),
  },
  sectionTitle: {
    color: '#6B7280',
    textTransform: 'uppercase',
    marginBottom: verticalScale(8),
    marginLeft: scale(10),
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: scale(16),
    marginBottom: verticalScale(20),
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(15),
    backgroundColor: '#FFFFFF',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionTitle: {
    marginLeft: scale(15),
    fontWeight: '500',
  },
  divider: {
    backgroundColor: '#F3F4F6',
    height: 1,
    marginLeft: scale(50),
  },
  logoutContainer: {
    marginTop: verticalScale(20),
    alignItems: 'center',
  },
  btnLogout: {
    width: '100%',
    borderRadius: scale(12),
    paddingVertical: verticalScale(2),
  },
  btnLogoutLabel: {
    fontSize: scale(15),
    fontWeight: 'bold',
  }
});

export default ConfiguracionView;