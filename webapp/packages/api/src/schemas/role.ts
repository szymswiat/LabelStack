export enum UserRole {
  superuser,
  taskAdmin,
  dataAdmin,
  annotator
}

export const userRoleRepresentation = {
  [UserRole.superuser]: 'Superuser',
  [UserRole.taskAdmin]: 'Task Admin',
  [UserRole.dataAdmin]: 'Data Admin',
  [UserRole.annotator]: 'Annotator'
};

export enum RoleType {
  superuser = 'superuser',
  taskAdmin = 'task_admin',
  dataAdmin = 'data_admin',
  annotator = 'annotator'
}

export interface Role {
  id: number;
  type: RoleType;
}
