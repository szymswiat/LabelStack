export enum RoleType {
  superuser = 'superuser',
  taskAdmin = 'task_admin',
  dataAdmin = 'data_admin',
  annotator = 'annotator'
}

export const userRoleRepresentation = {
  [RoleType.superuser]: 'Superuser',
  [RoleType.taskAdmin]: 'Task Admin',
  [RoleType.dataAdmin]: 'Data Admin',
  [RoleType.annotator]: 'Annotator'
};

export interface Role {
  id: number;
  type: RoleType;
}
