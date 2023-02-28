import { ColDef, ICellRendererParams } from 'ag-grid-community';
import { CustomFilter } from '../../../components/cellFilters/CustomFilter';
import {
  LabelAllowedAnnotationTypesCellRenderer,
  LabelTypesCellRenderer
} from '../../../components/cellRenderers';

export const defaultColDef = {
  filter: true
};

export const labelColumnDefs: ColDef[] = [
  { field: 'id', headerName: 'ID', width: 100, minWidth: 100, resizable: true },
  { field: 'name', headerName: 'Name', width: 300, minWidth: 200, resizable: true },
  {
    field: 'allowed_annotation_type',
    headerName: 'Allowed Annotation Type',
    cellRenderer: LabelAllowedAnnotationTypesCellRenderer,
    width: 300,
    minWidth: 300,
    resizable: true,
    filter: CustomFilter
  },
  {
    field: 'types',
    headerName: 'Label Type',
    cellRenderer: LabelTypesCellRenderer,
    filter: CustomFilter,
    width: 300,
    minWidth: 300,
    resizable: true
  }
];
