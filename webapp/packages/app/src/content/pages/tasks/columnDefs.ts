import { ColDef } from 'ag-grid-community';
import {
  DicomIsLabeledCellRenderer,
  imageInstanceTagRenderer,
  LabelCellRenderer,
  TaskStatusCellRenderer,
  UserCellRenderer
} from '../../../components/cellRenderers';
import { BooleanFilter } from '../../../components/cellFilters/BooleanFilter';
import OpenImageButton from '../../../components/cellRenderers/OpenImageButton';
import { CustomFilter } from '../../../components/cellFilters/CustomFilter';

export const imageInstancesColumnDefs: ColDef[] = [
  {
    field: 'open_image',
    headerName: 'Open',
    cellRenderer: OpenImageButton,
    width: 100,
    minWidth: 100,
    maxWidth: 100
  },
  { field: 'id', headerName: 'ID', width: 100, minWidth: 100, resizable: true },
  {
    field: 'visited',
    headerName: 'Visited',
    cellRenderer: DicomIsLabeledCellRenderer,
    filter: BooleanFilter,
    width: 100,
    minWidth: 100,
    resizable: true
  },
  {
    field: 'tags',
    headerName: 'Patient ID',
    cellRenderer: imageInstanceTagRenderer('PatientID'),
    width: 150,
    minWidth: 100
  },
  {
    field: 'tags',
    headerName: 'Modality',
    cellRenderer: imageInstanceTagRenderer('Modality'),
    width: 150,
    minWidth: 50
  }
];

export const labelAssignmentColumnDefs: ColDef[] = [
  { field: 'id', headerName: 'ID', width: 100, minWidth: 100, resizable: true },
  {
    field: 'label_id',
    headerName: 'Label',
    cellRenderer: LabelCellRenderer,
    filter: CustomFilter,
    width: 250,
    minWidth: 200,
    resizable: true
  },
  { field: 'image_instance_id', headerName: 'Image Instance ID', width: 200, minWidth: 180, resizable: true },
  {
    field: 'author_id',
    headerName: 'Author',
    cellRenderer: UserCellRenderer,
    filter: CustomFilter,
    width: 250,
    minWidth: 250,
    resizable: true
  },
  { field: 'parent_task_id', headerName: 'Parent Task ID', width: 200, minWidth: 200, resizable: true }
];

export const annotationColumnDefs: ColDef[] = [
  { field: 'id', headerName: 'ID', width: 100, minWidth: 100, resizable: true },
  {
    field: 'author_id',
    headerName: 'Author',
    cellRenderer: UserCellRenderer,
    filter: CustomFilter,
    width: 250,
    minWidth: 250,
    resizable: true
  },
  { field: 'parent_task_id', headerName: 'Parent Task ID', width: 150, minWidth: 150, resizable: true },
  { field: 'version', headerName: 'Version', width: 100, minWidth: 100, resizable: true },
  { field: 'spent_time', headerName: 'Spent Time', width: 200, minWidth: 200, resizable: true },
  {
    field: 'status',
    headerName: 'Status',
    cellRenderer: TaskStatusCellRenderer,
    filter: CustomFilter,
    width: 150,
    minWidth: 150,
    resizable: true
  }
];
