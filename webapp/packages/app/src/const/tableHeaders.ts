import { imageInstanceTagRenderer } from './ag-grid/renderers/CellRenderers';

export interface TableColumnInfo {
  header: string;
  field: string;
  cellRenderer?: (data: any) => string;
}

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
