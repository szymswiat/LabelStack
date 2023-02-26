import { Role } from './role';

export interface User {
  email: string;
  is_active: boolean;
  roles: Role[];
  full_name: string;
  id: number;
}

export interface UserUpdate {
  email?: string;
  full_name?: string;
  password?: string;
  is_active?: boolean;
  role_ids?: number[];
}

export interface UserCreate {
  email: string;
  full_name?: string;
  password: string;
  is_active?: boolean;
  role_ids?: number[];
}
