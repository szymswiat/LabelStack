import { ImageInstanceTagValue } from '@labelstack/api/src/schemas/tag';

export interface TableColumnInfo {
  header: string;
  field: string;
  cellRenderer?: (data: any) => string;
}

export const selectedImagesTableHeaders: TableColumnInfo[] = [
  { header: 'ID', field: 'id' },
];

export const selectedLabelAssignmentsTableHeaders = [
  { header: 'ID', field: 'id' },
  { header: 'Label', field: 'label' },
  { header: 'ImageInstance ID', field: 'image_instance_id' }
];

export const selectedAnnotationsTableHeaders = [
  { header: 'ID', field: 'id' },
  { header: 'Label Assignment ID', field: 'label_assignment_id' },
  { header: 'Author ID', field: 'author_id' }
];
