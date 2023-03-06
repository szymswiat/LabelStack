import { Role } from './role';

export interface IUserProfile {
  email: string;
  is_active: boolean;
  roles: Role[];
  full_name: string;
  id: number;
}

export interface IUserProfileUpdate {
  email?: string;
  full_name?: string;
  password?: string;
  is_active?: boolean;
  type_ids?: number[];
}

export interface IUserProfileCreate {
  email: string;
  full_name?: string;
  password?: string;
  is_active?: boolean;
  type_ids?: number[];
}
