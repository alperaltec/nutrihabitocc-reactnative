import { api, ApiResponse } from "./AxiosInterceptor";
import { URLS } from "./Url";
import { HistorialClinicoResponse } from "./UserInterface";

export const obtenerHistorialPlanesWorkspace = async (params: { workspace_id: number }): Promise<any[]> => {
  try {
    const response = await api.post<ApiResponse<any[]>>(URLS.USER.LISTARPLANESWORKSPACE, params);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al obtener el historial de planes.');
  }
};

export const desactivarPlanNutricionalManual = async (params: { plan_nutricional_id: number }): Promise<string> => {
  try {
    const response = await api.post<ApiResponse<any>>(URLS.USER.DESACTIVARPLANNUTRICIONAL, params);
    return response.data.message;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'No se pudo desactivar el plan.');
  }
};

export const obtenerCronogramaDetallado = async (planId: number) => {
  try {
    const response = await api.post(URLS.USER.LISTARRECETASPLANESWORKSPACE, { 
        plan_nutricional_id: planId 
    });
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al cargar el cronograma.');
  }
};


export const obtenerListaFichasPaciente = async (parametros: { workspace_id: number; user_id: number }): Promise<any[]> => {
  try {
    const response = await api.post(URLS.USER.LISTARHISTORIALFICHAS, parametros);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al obtener el listado de fichas");
  }
};

export const crearHistoriaClinicaPaciente = async (parametros: {
  id?: number | null;
  workspace_id: number;
  user_id: number;
  plantilla_formulario_id: number;
  content_data: Record<string, any>;
}): Promise<HistorialClinicoResponse> => {
  try {
    const response = await api.post<ApiResponse<HistorialClinicoResponse>>(
      '/crearhistoriaclinica',
      parametros
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al guardar la historia clínica");
  }
};


export const obtenerHistorialClinicoPaciente = async (parametros: {
  id?: number | null; 
  workspace_id: number;
  user_id: number;
  plantilla_formulario_id: number;
}): Promise<any> => {
  try {
    const response = await api.post(URLS.USER.LISTARHISTORIALPACIENTE, parametros);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al consultar el expediente");
  }
};

export const obtenerMiWorkspacePaciente = async (): Promise<{ id: number; name: string; member_role: string }> => {
  try {
    const response = await api.post(URLS.USER.MIWORKSPACE);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "No se pudo encontrar tu área de trabajo.");
  }
};