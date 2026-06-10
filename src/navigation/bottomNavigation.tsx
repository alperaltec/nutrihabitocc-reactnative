import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeView from '../views/home/HomeView';
import { Home, LayoutGridIcon, Settings, UsersRound, UsersRoundIcon } from 'lucide-react-native';
import { AppTheme } from '../theme/theme';
import UsuariosView from '../views/admin/UsuariosView';
import WorkspaceView from '../views/workspace/WorkspaceView';
import ConfiguracionView from '../views/admin/ConfiguracionView';
import { useAuthStore } from '../store/useAuthStore';
import MiWorkspace from '../views/workspace/MiWorkspaceView';
import MiWorkspaceView from '../views/workspace/MiWorkspaceView';
import { useDeviceSetup } from '../utils/useDeviceSetup';
import { useEffect } from 'react';

export type BottomTabParamList = {
  HomeTab: undefined;
  Empleados: undefined;
  Workspace: undefined;
  MiWorkspace: undefined;
  Setting: undefined;
}

const Tab = createBottomTabNavigator<BottomTabParamList>();

export const MainTabs = () => {
  const role = useAuthStore((state) => state.role);
  const iteneAccesoPaciente = role?.name === 'Paciente';
  const tieneAccesoMódulos = role?.name === 'Administrador' || role?.name === 'Nutricionista';
  const { registrarDispositivoEnBackend } = useDeviceSetup();

  useEffect(() => {
    registrarDispositivoEnBackend();
  }, []);
  
  return (
    <Tab.Navigator
      id="MainTabs"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: AppTheme.secondary,
        tabBarStyle: {
          backgroundColor: AppTheme.background
        }
      }}>
      <Tab.Screen
        name="HomeTab"
        component={HomeView}
        options={{
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <Home color={color} size={size} />
          )
        }}
      />
      {tieneAccesoMódulos && (
        <Tab.Screen
          name="Empleados"
          component={UsuariosView}
          options={{
            tabBarLabel: 'Usuarios',
            tabBarIcon: ({ color, size }) => (
              <UsersRoundIcon color={color} size={size} />
            )
          }}
        />
      )}
      {tieneAccesoMódulos && (
        <Tab.Screen
          name="Workspace"
          component={WorkspaceView}
          options={{
            tabBarLabel: 'WorkSpace',
            tabBarIcon: ({ color, size }) => (
              <LayoutGridIcon color={color} size={size} />
            )
          }}
        />
      )}
      {
        iteneAccesoPaciente && (
          <Tab.Screen
            name="MiWorkspace"
            component={MiWorkspaceView}
            options={{
              tabBarLabel: 'Workspace',
              tabBarIcon: ({ color, size }) => (
                <LayoutGridIcon color={color} size={size} />
              )
            }}
          />
        )
      }
      <Tab.Screen
        name="Setting"
        component={ConfiguracionView}
        options={{
          tabBarLabel: 'Configuración',
          tabBarIcon: ({ color, size }) => (
            <Settings color={color} size={size} />
          )
        }}
      />
    </Tab.Navigator>
  );
}