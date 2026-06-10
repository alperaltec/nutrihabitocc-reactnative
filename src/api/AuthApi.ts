import { ForgotPasswordI, RecoveryPassword } from "../forms/schemas/forgotpasswordSchema";
import { Login } from "../forms/schemas/loginSchema";
import { Register } from "../forms/schemas/registerSchema";
import { LoginResponse, RegisterResponse } from "./AuthInterface";
import { api, ApiResponse } from "./AxiosInterceptor";
import { URLS } from "./Url";


export const registerApi = async (data: Register): Promise<RegisterResponse> => {
  try {
    const apiCall = await api.post<ApiResponse<RegisterResponse>>(URLS.AUTH.REGISTER, data);
    return apiCall.data.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Error al registrar usuario";
    console.error("Login Error:", errorMessage);
    throw new Error(errorMessage);
  }
}

export const loginApi = async(data: Login) : Promise<LoginResponse> =>{
  try {
    const apiCall = await api.post<ApiResponse<LoginResponse>>(URLS.AUTH.LOGIN, data);
    return apiCall.data.data;
  }catch(error: any){
    const errorMessage = error.response?.data?.message || "Error al iniciar sesión";
    console.error("Login Error:", errorMessage);
    throw new Error(errorMessage);

  }
}

export const sendcorreoforgotpasswordApi = async(data: ForgotPasswordI) : Promise<string> =>{
  try {
    const apiCall = await api.post<ApiResponse<[]>>(URLS.AUTH.SENDCORREO, data);
    return apiCall.data.message;
  }catch(error: any){
    const errorMessage = error.response?.data?.message || "Error al iniciar sesión";
    console.error("Login Error:", errorMessage);
    throw new Error(errorMessage);

  }
}

export const recoverypasswordApi = async(data: RecoveryPassword) : Promise<string> => {
  try {
    const apiCall = await api.post<ApiResponse<[]>>(URLS.AUTH.RESETPASSWORD, data);
    return apiCall.data.message;
  }catch (error: any){
    const errorMessage = error.response?.data?.message || "Error al iniciar sesión";
    console.error("Login Error:", errorMessage);
    throw new Error(errorMessage);
  }
}