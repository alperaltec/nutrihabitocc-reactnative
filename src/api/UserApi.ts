import { ForgotPasswordI, RecoveryPassword } from "../forms/schemas/forgotpasswordSchema";
import { Login } from "../forms/schemas/loginSchema";
import { Register } from "../forms/schemas/registerSchema";
import { LoginResponse, RegisterResponse } from "./AuthInterface";
import { api, ApiResponse } from "./AxiosInterceptor";
import { URLS } from "./Url";
import { AsignarMiembroRequest, AsignarRecetaPlanRequest, ChangeUserEstado, ConsultarHistorialRequest, ConsultarPlanRequest, CrearPlanRequest, DatosResponse, EliminarMiembroRequest, FiltrosUsuarios, HistorialClinicoResponse, PerfilRequest, PerfilResponse, PerfilUpdate, PlanNutricionalData, PlantillasRequest, RecetaCatalogoItem, ResetPasswordRequest, UsuariosResponse, VerWorkspaceRequest, WorkspaceFilter, WorkspaceRequest, WorkspaceResponse } from "./UserInterface";


export const datosadministrador = async (): Promise<DatosResponse> => {
  try {
    const apiCall = await api.get<ApiResponse<DatosResponse>>(URLS.USER.DATOS);
    return apiCall.data.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Error al solicitar la informacion";
    console.error("Solicitud Error:", errorMessage);
    throw new Error(errorMessage);
  }
}

export const listadousuarios = async (filtros: FiltrosUsuarios): Promise<UsuariosResponse[]> => {
  try {
    const apiCall = await api.post<ApiResponse<UsuariosResponse[]>>(URLS.USER.LISTADOUSUARIOS,filtros);
    return apiCall.data.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Error al solicitar la informacion";
    console.error("Solicitud Error:", errorMessage);
    throw new Error(errorMessage);
  }
}


export const modificarestadoUsuario = async (parametros: ChangeUserEstado): Promise<string> => {
  try {
    const apiCall = await api.post<ApiResponse<[]>>(URLS.USER.MODIFICARACTIVO,parametros);
    return apiCall.data.message;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Error en la solicitud";
    console.error("Error en la solicitud:", errorMessage);
    throw new Error(errorMessage);
  }
}


export const obtenerperfil = async (parametros: PerfilRequest): Promise<PerfilResponse> => {
  try {
    const apiCall = await api.post<ApiResponse<PerfilResponse>>(URLS.USER.OBTENERPERFIL,parametros);
    return apiCall.data.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Error en la solicitud";
    console.error("Error en la solicitud:", errorMessage);
    throw new Error(errorMessage);
  }
}

export const obtenerperfilPaciente = async (parametros: PerfilRequest): Promise<{ perfil: PerfilResponse | null }> => {
  try {
    const apiCall = await api.post<ApiResponse<{ perfil: PerfilResponse | null }>>(
      URLS.USER.OBTENERPERFIL,
      parametros
    );
    return apiCall.data.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Error en la solicitud";
    console.error("Error en la solicitud:", errorMessage);
    throw new Error(errorMessage);
  }
};


export const crearmodificarperfil = async (parametros: PerfilUpdate): Promise<string> => {
  try {
    const apiCall = await api.post<ApiResponse<[]>>(URLS.USER.MODIFICARPEFFIL,parametros);
    return apiCall.data.message;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Error en la solicitud";
    console.error("Error en la solicitud:", errorMessage);
    throw new Error(errorMessage);
  }
}


export const crearworkspace= async (parametros: WorkspaceRequest): Promise<string> => {
  try {
    const apiCall = await api.post<ApiResponse<[]>>(URLS.USER.WORKSPACE,parametros);
    return apiCall.data.message;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Error en la solicitud";
    console.error("Error en la solicitud:", errorMessage);
    throw new Error(errorMessage);
  }
}


export const listarWorkspace = async (parametros: { buscar: string }): Promise<WorkspaceResponse[]> => {
  try {
    const response = await api.post(URLS.USER.LISTARWORKSPACE, parametros);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al obtener áreas de trabajo");
  }
};

export const obtenerPacientesDisponibles = async (): Promise<UsuariosResponse[]> => {
  const response = await api.get<ApiResponse<UsuariosResponse[]>>(URLS.USER.LISTARPACIENTES);
  return response.data.data; 
};

export const obtenerNutricionistasDisponibles = async (): Promise<UsuariosResponse[]> => {
  const response = await api.get<ApiResponse<UsuariosResponse[]>>(URLS.USER.LISTARNUTRICIONISTAS);
  return response.data.data;
};

export const asignarMiembroWorkspace = async (parametros: AsignarMiembroRequest): Promise<string> => {
  try {
    const response = await api.post(URLS.USER.ASIGNARMIEMBROS, parametros);
    return response.data.message;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "No se pudo asignar el miembro";
    throw new Error(errorMessage);
  }
};


export const eliminarMiembroWorkspace = async (parametros: EliminarMiembroRequest): Promise<string> => {
  try {
    const response = await api.post(URLS.USER.ELIMINARMIMBRO, parametros);
    return response.data.message;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "No se pudo remover al usuario";
    throw new Error(errorMessage);
  }
};

export const obtenerDetalleWorkspace = async (parametros: VerWorkspaceRequest): Promise<any> => {
  try {
    const response = await api.post(URLS.USER.INFORMACIONWORKSPACE, parametros);
    return response.data.data; 
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Error al obtener el detalle del espacio";
    throw new Error(errorMessage);
  }
};

export const listarPlantillasDisponibles = async (): Promise<any> => {
  try {
    const response = await api.post(URLS.USER.LISTARPLANTILLAS);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "No se pudieron obtener las plantillas");
  }
};



export const obtenerMoldePlantilla = async (plantillaId: number): Promise<any> => {
  try {
    const response = await api.post<ApiResponse<any>>(URLS.USER.DETALLEPLANTILLA, { id: plantillaId });
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al cargar el molde de la plantilla");
  }
};



export const actualizarDatosPersonales = async (datos: { user_id: number; name: string; last_name: string; email: string; phone_number: string; }): Promise<any> => {
  try {
    const response = await api.post(URLS.USER.ACTUALIZARDATOSUSUARIO, datos);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al actualizar los datos personales");
  }
};

export const resetpassword = async (parametros: ResetPasswordRequest): Promise<string> => {
  try {
    const apiCall = await api.post<ApiResponse<[]>>(URLS.USER.RESETPASSWORD,parametros);
    return apiCall.data.message;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Error en la solicitud";
    console.error("Error en la solicitud:", errorMessage);
    throw new Error(errorMessage);
  }
}

// export const obtenerPlanNutricionalWorkspace = async (params: ConsultarPlanRequest): Promise<PlanNutricionalData | null> => {
//   try {
//     const response = await api.post<ApiResponse<PlanNutricionalData | null>>(URLS.USER.OBTENERPLANWORKSPACE, params);
//     return response.data.data;
//   } catch (error: any) {
//     throw new Error(
//       error.response?.data?.message || 
//       'Error al recuperar el plan nutricional de este espacio.'
//     );
//   }
// };


export const crearPlanNutricionalBase = async ( datos: CrearPlanRequest): Promise<any> => {
  try {
    const response = await api.post<ApiResponse<any>>(URLS.USER.CREARPLANNUTRICIONAL, datos);
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 
      'No se pudo inicializar el plan nutricional maestro.'
    );
  }
};


export const asignarRecetaAPlanMensual = async (datos: AsignarRecetaPlanRequest): Promise<any> => {
  try {
    const response = await api.post<ApiResponse<any>>(URLS.USER.AGREGARRECETAPLAN, datos);
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 
      'Error al agendar la receta en el cronograma semanal.'
    );
  }
};

export const obtenerCatalogoRecetas = async (): Promise<RecetaCatalogoItem[]> => {
  try {
    const response = await api.get<ApiResponse<RecetaCatalogoItem[]>>(URLS.USER.LISTARRECETAS);
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 
      'Error al recuperar el catálogo maestro de recetas.'
    );
  }
};


