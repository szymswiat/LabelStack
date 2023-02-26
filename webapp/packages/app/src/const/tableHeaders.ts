import React from 'react';
import { Role } from '@labelstack/api';
import { imageInstanceTagRenderer } from './ag-grid/renderers/CellRenderers';
import ReadOnlyCheckbox from '../components/Forms/ReadOnlyCheckbox';

export interface TableColumnInfo {
  header: string;
  field: string;
  cellRenderer?: (data: any) => any;
}

export const usersTableHeader: TableColumnInfo[] = [
  { header: 'ID', field: 'id' },
  { header: 'Full Name', field: 'full_name' },
  { header: 'Email', field: 'email' },
  {
    header: 'Roles',
    field: 'roles',
    cellRenderer: (roles: Role[]) => {
      if (roles) {
        return roles.map((role) => role.type).join(', ');
      }
      return '';
    }
  },
  {
    header: 'Is Active?',
    field: 'is_active',
    cellRenderer: (isActive: boolean) => {
      return React.createElement(ReadOnlyCheckbox, { checked: isActive });
    }
  }
];

export const selectedImagesTableHeaders: TableColumnInfo[] = [
  { header: 'ID', field: 'id' },
  { header: 'Patient ID', field: 'tags', cellRenderer: imageInstanceTagRenderer('PatientID') },
  { header: 'Modality', field: 'tags', cellRenderer: imageInstanceTagRenderer('Modality') }
];

export const selectedLabelAssignmentsTableHeaders = [
  { header: 'ID', field: 'id' },
  { header: 'Label', field: 'label' },
  { header: 'ID', field: 'image_instance_id' }
];

export const selectedAnnotationsTableHeaders = [
  { header: 'ID', field: 'id' },
  { header: 'ID - Label Assignment', field: 'label_assignment_id' },
  { header: 'Author ID', field: 'author_id' }
];
