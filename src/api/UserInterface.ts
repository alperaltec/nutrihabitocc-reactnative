

export interface DatosResponse {
  total_usuarios_activos: number,
  total_pacientes: number,
  total_nutricionistas: number,
  total_workspaces: number
}


export interface FiltrosUsuarios {
  filtro_usuario: boolean,
  filtro_nutricionista: boolean,
  filtro_inactivos: boolean;
  buscar_nombre: string
}

export interface ResetPasswordRequest {
  user_id: number;
  password: string;
}

export interface RolInterface {
  id: number;
  name: string;
}

export type ChangeUserEstado = Omit<ResetPasswordRequest, 'password'>;

export interface UsuariosResponse {
  id: number;
  name: string;
  last_name: string;
  phone_number: string;
  email: string;
  is_active: boolean;
  roles: RolInterface[];
}

export type PerfilRequest = Omit<ResetPasswordRequest, 'password'>;

export interface PerfilResponse {
  id: number;
  height: number;
  weight: number;
  birth_date: string;
  gender: string;
  grasa_corporal: number;
  masa_muscular: number;
  is_active: boolean;
  user_id: number;
}

export type PerfilUpdate = Omit<PerfilResponse, 'id' | 'is_active'>;

export interface RolInterface {
  id: number;
  name: string;
}

export type WorkspaceRequest = Omit<RolInterface, 'id'>

export interface WorkspaceFilter {
  buscar: string;
}

export interface WorkspaceResponse {
  id: number;
  name: string;
  is_active: boolean
}

export interface AsignarMiembroRequest {
  workspace_id: number;
  user_id: number;
  rol: 'Paciente' | 'Nutricionista';
}

export interface EliminarMiembroRequest {
  workspace_id: number;
  user_id: number;
}

export interface VerWorkspaceRequest {
  id: number;
}

export interface ConsultarHistorialRequest {
  workspace_id: number,
  user_id: number,
  plantilla_formulario_id?: number
}

export interface PlantillasRequest {
  id: number,
  name: string,
  version: string
}

export interface HistorialClinicoResponse {
  id: number,
  workspace_id: number,
  user_id: number,
  plantilla_formulario_id: number,
  content_data: any,
}


export interface Macronutrientes {
  carbohidratos: number;
  proteinas: number;
  grasas: number;
  fibra?: number;
}

export interface Ingrediente {
  nombre: string;
  cantidad: number;
  unidad: string;
}

export interface PreparacionPaso {
  paso: number;
  descripcion: string;
}

export interface InformacionRecetaRecubierta {
  tiempo_preparacion_min?: number;
  porciones?: number;
  macronutrientes: Macronutrientes;
  ingredientes: Ingrediente[];
  preparacion: PreparacionPaso[];
}

export interface DetalleRecetaAgendada {
  receta_id: number;
  name: string;
  calorias: number;
  informacion: InformacionRecetaRecubierta;
  notas: string | null;
  plan_receta_id: number | null;
}

export type DiasCronograma = Record<string, DetalleRecetaAgendada>;

export type SemanasCronograma = Record<string, DiasCronograma>;

export type CronogramaSemanalMapa = Record<string, SemanasCronograma>;

export interface PlanNutricionalData {
  id: number;
  name: string;
  workspace_id: number;
  fecha_inicio: string;
  fecha_fin: string;
  cronograma_semanal: CronogramaSemanalMapa;
}

export interface PlanNutricionalResponse {
  id: number;
  workspace_id: number;
  name: string;
  fecha_inicio: string;
  fecha_fin: string;
  cronograma_semanal: Record<string, Record<string, Record<string, DetalleRecetaAgendada>>>;
}


export interface ConsultarPlanRequest {
  workspace_id: number;
}

export interface CrearPlanRequest {
  workspace_id: number;
  name: string;
  fecha_inicio: string;
  fecha_fin: string;
}

export interface AsignarRecetaPlanRequest {
  plan_nutricional_id: number;
  receta_id: number;
  semana: number;
  day: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo';
  tipo_comida: 'Desayuno' | 'Media Mañana' | 'Almuerzo' | 'Media Tarde' | 'Cena' | 'Snack';
  notas?: string | null;
}

export interface RecetaCatalogoItem {
  id: number;
  name: string;
  is_active: boolean;
  calorias: number;
  informacion: InformacionRecetaRecubierta; 
}

export interface CatalogoRecetasResponse {
  status: string;
  message: string;
  data: RecetaCatalogoItem[];
}