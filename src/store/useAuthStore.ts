import { LoginResponse, Role } from "../api/AuthInterface";
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  access_token: string | null;
  user: LoginResponse['user'] | null;
  role: Role | null;
  setSession: (access_token: string, user: LoginResponse['user'], role: Role)=> void;
  logout: ()=>void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      access_token: null,
      user: null,
      role: null,
      setSession: (access_token, user, role) => set({ access_token, user, role }),
      logout: () => set({ access_token: null, user: null, role: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);