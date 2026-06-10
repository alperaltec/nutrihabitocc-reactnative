export interface Login {
  email: string;
  password: string;
}

export interface Register {
  name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
  password_confirmed: string;
}

export interface RegisterResponse {
  access_token: string;
  user: User;
  role: Role;
}

export type LoginResponse = RegisterResponse;

export interface Role {
  id: number;
  name: string;
}

export interface User {
  id: number;
  name: string;
  last_name: string;
  email: string;
  phone_number: string;
  is_active: boolean;  
}