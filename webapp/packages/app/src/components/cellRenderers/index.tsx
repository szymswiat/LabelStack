import React from 'react';
import {
  AnnotationType,
  User,
  Label,
  LabelType,
  taskPriorityRepresentation,
  TaskStatus,
  taskStatusRepresentation,
  TaskType,
  taskTypeRepresentation,
  RoleType,
  Role,
  userRoleRepresentation
} from '@labelstack/api';
import { ImageInstanceTagValue } from '@labelstack/api/src/schemas/tag';
import { ICellRendererParams } from 'ag-grid-community';
import { BsCheckLg, BsXLg } from 'react-icons/bs';
import classNames from 'classnames';

export const DicomIsLabeledCellRenderer: React.FC<ICellRendererParams> = (params) => {
  const isLabeled = params.value as boolean;
  return <>{isLabeled.toString()}</>;
};

export const LabelAllowedAnnotationTypesCellRenderer: React.FC<ICellRendererParams> = (params) => {
  const allowedAnnotationType = params.value as AnnotationType;
  const name = allowedAnnotationType && allowedAnnotationType.name ? allowedAnnotationType.name : '';
  return <>{name}</>;
};

export const LabelTypesCellRenderer: React.FC<ICellRendererParams> = (params) => {
  const types = params.value as LabelType[];

  if (types) {
    const typeNames: string[] = [];
    types.forEach((type) => {
      if (type.name) typeNames.push(type.name);
    });

    return <>{typeNames.join(', ')}</>;
  }
  return <></>;
};

export function imageInstanceTagRenderer(tagKeyword: string): React.FC<ICellRendererParams> {
  return (params) => {
    const tags = params.value as ImageInstanceTagValue[];
    if (tags) {
      const tag = tags.find((tag) => tag.tag.keyword === tagKeyword);
      if (tag) {
        return <>{tag.value}</>;
      }
    }
    return <></>;
  };
}

export const TaskTypeCellRenderer: React.FC<ICellRendererParams> = (params) => {
  const taskType = params.value as TaskType;

  if (taskType != null) {
    return <>{taskTypeRepresentation[taskType]}</>;
  }
  return <></>;
};

export const TaskStatusCellRenderer: React.FC<ICellRendererParams> = (params) => {
  const taskStatus = params.value as TaskStatus;

  if (taskStatus != null) {
    return <>{taskStatusRepresentation[taskStatus]}</>;
  }
  return <></>;
};

export interface UserCellRendererParams extends ICellRendererParams {
  users: User[];
}

export const UserCellRenderer: React.FC<UserCellRendererParams> = (params) => {
  const userId = params.value as number;

  if (userId != null) {
    const user = params.users.find((user) => user.id == userId);
    return <>{user ? user.email : 'Unknown'}</>;
  }

  return <>{'-'}</>;
};

export interface LabelCellRendererProps extends ICellRendererParams {
  labels: Label[];
}

export const LabelCellRenderer: React.FC<LabelCellRendererProps> = (params) => {
  const labelId = params.value as number;

  if (labelId != null) {
    const label = params.labels.find((label) => label.id == labelId);
    return <>{label ? label.name : ''}</>;
  }
  return <></>;
};

export const TaskPriorityCellRenderer: React.FC<ICellRendererParams> = (params) => {
  const priorityValue = params.value as number;

  if (priorityValue != null) {
    return <>{taskPriorityRepresentation[priorityValue]}</>;
  }
  return <></>;
};

export const UserRoleCellRenderer: React.FC<ICellRendererParams> = (params) => {
  const roles = params.value as Role[];

  return <>{roles.map((role) => userRoleRepresentation[role.type]).join(', ')}</>;
};

export const UserActiveCellRenderer: React.FC<ICellRendererParams> = (params) => {
  const active = params.value as boolean;

  const Icon = active ? BsCheckLg : BsXLg;

  return (
    <div
      className={classNames('w-full h-full grid place-items-center', {
        'text-green-500': active,
        'text-red-500': !active
      })}
    >
      <Icon className="w-4 h-4" />
    </div>
  );
};

export function centeredHeaderRendeder (headerName: string): React.FC<{}> {
  return (params) => {
    return (
      <div className="w-full h-full grid place-items-center">
        <span>{headerName}</span>
      </div>
    );
  };
}
