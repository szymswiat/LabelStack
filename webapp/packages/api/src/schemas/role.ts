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
