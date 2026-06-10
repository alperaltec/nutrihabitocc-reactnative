import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginView from '../views/auth/LoginView';
import RegisterView from '../views/auth/RegisterView';
import ForgotPassword from '../views/auth/ForgotPassword';
import CustomHeader from '../components/CustomHeader';
import { useAuthStore } from '../store/useAuthStore';
import { MainTabs } from './bottomNavigation';
import CambiarPasswordView from '../views/admin/CambiarPasswordView';
import CambiarEstadoUsuarioView from '../views/admin/CambiarEstadoUsuarioView';
import PerfilAlimenticioView from '../views/admin/PerfilAlimenticioView';
import MiembrosWorkspace from '../views/admin/MiembrosWorkspace';
import InformacionWorkspaceView from '../views/workspace/InformacionWorkspaceView';
import LlenarHistorialClinicoView from '../views/admin/LlenarHistorialClinicoView';
import SeleccionarPlantillaView from '../views/admin/SeleccionarPlantillaView';
// import VerHistorialClinicoView from '../views/admin/VerHistorialClinicoView';
import SeleccionarNuevaFichaView from '../views/workspace/SeleccionarNuevaFichaView';
import EditarPerfilConfigView from '../views/admin/EditarPerfilConfigView';
import PoliticaPrivacidadView from '../views/privacidad/PoliticaPrivacidadView';
import CentroAyudaView from '../views/privacidad/CentroAyudaView';
import TerminosCondicionesView from '../views/privacidad/TerminosCondicionesView';
import VerPlanNutricionalView from '../views/workspace/VerPlanNutricionalView';
import AsginarPlanNutrcionalView from '../views/workspace/AsginarPlanNutrcionalView';
import ListarPlanesNutricionalesView from '../views/workspace/ListarPlanesNutricionalesView';
import CrearPlanNutricionalView from '../views/workspace/CrearPlanNutricionalView';
import SeleccionarFichasAsignadasView from '../views/admin/SeleccionarFichasAsignadasView';


export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  MainTabs: undefined;
  CambiarPassword: {
    userId: number,
    userName?: string;
    origen?: 'administracion' | 'configuracion';
  },
  CambiarUsuarioEstado: {
    userId: number,
    userName: string,
    isActive: boolean;
  },
  Perfil: {
    userId: number,
    userName: string
  },
  MiembroWorkspace: {
    workspaceId: number,
    workspaceName: string
  },
  InformacionWorkspace: {
    workspaceId: number,
  },

  SeleccionarPlantilla: {
    workspaceId: number,
    userId?: number,
    pacienteName?: string,
    workspaceName?: string,
  },
  LlenarHistorialClinico: {
    workspaceId: number,
    userId: number,
    pacienteName: string,
    fichaClinicaId: number,
    plantillaId: number,
    plantillaName: string,
    modo?: 'llenar' | 'previsualizar',
  },
  VerHistorialClinico: {
    historialId: number,
    pacienteName: string,
  },
  SeleccionarNuevaFicha: {
    workspaceId: number,
    userId: number;
    pacienteName: string
  },
  SeleccionarFichaLlenado: {
    workspaceId: number,
    userId: number,
    pacienteName: string
  },
  EditarPerfilConfig: {
    userId: number,
    name: string,
    lastName: string,
    email: string,
    phone?: string,
  },
  CentroAyuda: undefined,
  PoliticaPrivacidad: undefined,
  TerminosCondiciones: undefined,
  VerPlanNutricional: {
    planNutricionalId: number
    pacienteName: string,
    
  },
  AsignarPlanNutricional: {
    planNutricionalId: number,
    workspaceId: number,
    pacienteName: string
  },
  ListarPlanesNutricionales: {
    workspaceId: number,
    pacienteName: string
  },
  CrearPlanNutricional: undefined

}
const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootStack = () => {
  const token = useAuthStore((state) => state.access_token);
  const isAuthenticated = !!token;

  return (
    <Stack.Navigator id="root" initialRouteName={isAuthenticated ? 'MainTabs' : 'Login'}>
      {
        isAuthenticated ? (
          <Stack.Group>
            <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
            <Stack.Screen name="CambiarPassword" component={CambiarPasswordView} options={{ header: (props) => <CustomHeader title='Cambiar Contraseña' {...props} /> }} />
            <Stack.Screen name="CambiarUsuarioEstado" component={CambiarEstadoUsuarioView} options={{ header: (props) => <CustomHeader title='Modificar Estado' {...props} /> }} />
            <Stack.Screen name="Perfil" component={PerfilAlimenticioView} options={{ header: (props) => <CustomHeader title='Perfil' {...props} /> }} />
            <Stack.Screen name="MiembroWorkspace" component={MiembrosWorkspace} options={{ header: (props) => <CustomHeader title='Asignar Miembros' {...props} /> }} />
            <Stack.Screen name="InformacionWorkspace" component={InformacionWorkspaceView} options={{ header: (props) => <CustomHeader title='Información WorkSpace' {...props} /> }} />
            <Stack.Screen name="SeleccionarPlantilla" component={SeleccionarPlantillaView} options={{ header: (props) => <CustomHeader title='Seleccionar Plantilla' {...props} /> }} />
            <Stack.Screen name="LlenarHistorialClinico" component={LlenarHistorialClinicoView} options={{ header: (props) => <CustomHeader title='Llenar Historial' {...props} /> }} />

            <Stack.Screen name="EditarPerfilConfig" component={EditarPerfilConfigView} options={{ header: (props) => <CustomHeader title='Editar Perfil' {...props} /> }} />
            <Stack.Screen name="SeleccionarNuevaFicha" component={SeleccionarNuevaFichaView} options={{ header: (props) => <CustomHeader title='Nueva Ficha (Asignar)' {...props} /> }} />
            <Stack.Screen name="SeleccionarFichaLlenado" component={SeleccionarFichasAsignadasView} options={{ header: (props) => <CustomHeader title='Fichas Disponibles' {...props} /> }} />

            
            <Stack.Screen name="VerPlanNutricional" component={VerPlanNutricionalView} options={{ header: (props) => <CustomHeader title='Plan Nutricional' {...props} /> }} />
            <Stack.Screen name="AsignarPlanNutricional" component={AsginarPlanNutrcionalView} options={{ header: (props) => <CustomHeader title='Asignacion Plan Nutricional' {...props} /> }} />
            <Stack.Screen name="ListarPlanesNutricionales" component={ListarPlanesNutricionalesView} options={{ header: (props) => <CustomHeader title='Historial de Planes' {...props} /> }}/>
            <Stack.Screen name="CrearPlanNutricional" component={CrearPlanNutricionalView} options={{ header: (props) => <CustomHeader title='Crear Plan Nutricional' {...props} /> }}/>

            <Stack.Screen name="PoliticaPrivacidad" component={PoliticaPrivacidadView} options={{ header: (props) => <CustomHeader title='Política de Privacidad' {...props} /> }} />
            <Stack.Screen name="CentroAyuda" component={CentroAyudaView} options={{ header: (props) => <CustomHeader title='Centro de Ayuda' {...props} /> }} />
            <Stack.Screen name="TerminosCondiciones" component={TerminosCondicionesView} options={{ header: (props) => <CustomHeader title='Términos y Condiciones' {...props} /> }} />
          </Stack.Group>
        ) : (
          <Stack.Group>
            <Stack.Screen name="Login" component={LoginView} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterView} options={{ header: (props) => <CustomHeader title='Registrarse' {...props} /> }} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ header: (props) => <CustomHeader title='Recuperar Contraseña' {...props} /> }} />

            <Stack.Screen name="PoliticaPrivacidad" component={PoliticaPrivacidadView} options={{ header: (props) => <CustomHeader title='Política de Privacidad' {...props} /> }} />
            <Stack.Screen name="CentroAyuda" component={CentroAyudaView} options={{ header: (props) => <CustomHeader title='Centro de Ayuda' {...props} /> }} />
            <Stack.Screen name="TerminosCondiciones" component={TerminosCondicionesView} options={{ header: (props) => <CustomHeader title='Términos y Condiciones' {...props} /> }} />

          </Stack.Group>
        )
      }
    </Stack.Navigator>
  )
}

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList { }
  }
}