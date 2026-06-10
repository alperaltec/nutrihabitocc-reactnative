import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { URLS } from './Url';
import { RegisterResponse } from './AuthInterface';
import { QueryClient, useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../store/useAuthStore';


export interface ApiResponse<T> {
  status: 'Success'| 'Error';
  message: string;
  data: T
}

export const api: AxiosInstance = axios.create({
  baseURL: URLS.BASE,
  timeout: 5000
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().access_token;
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

