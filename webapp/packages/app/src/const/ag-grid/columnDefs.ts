import { ColDef, ICellRendererParams } from 'ag-grid-community';
import { OpenImageButton } from './renderers/OpenImageButton';
import { OpenTaskButton } from './renderers/OpenTaskButton';
import {
  annotationReviewsCellRenderer,
  annotationsCellRenderer,
  dicomIsLabeledCellRenderer,
  imageInstanceTagCellRenderer,
  labelAllowedAnnotationTypesCellRenderer,
  labelAssignmentsCellRenderer,
  labelCellRenderer,
  LabelCellRendererParams,
  labelTypesCellRenderer,
  taskPriorityCellRenderer,
  taskStatusCellRenderer,
  taskTypeCellRenderer,
  userCellRenderer,
  UserCellRendererParams
} from './renderers/CellRenderers';
import { TakeTaskButton } from './renderers/TakeTaskButton';
import { CustomFilter } from './filters/CustomFilter';
import { BooleanFilter } from './filters/BooleanFilter';

export const defaultColDef = {
  filter: true
};

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
    cellRenderer: (params: ICellRendererParams) => dicomIsLabeledCellRenderer(params),
    filter: BooleanFilter,
    width: 100,
    minWidth: 100,
    resizable: true
  },
  { field: 'id_ref', headerName: 'ID Ref', width: 400, minWidth: 400, resizable: true },
  {
    field: 'label_assignments',
    headerName: 'Label Assignments',
    cellRenderer: (params: ICellRendererParams) => labelAssignmentsCellRenderer(params),
    width: 200,
    minWidth: 200,
    resizable: true
  },
  {
    field: 'tags',
    headerName: 'Tags',
    cellRenderer: imageInstanceTagCellRenderer,
    filter: CustomFilter,
    width: 300,
    minWidth: 300,
    resizable: true
  }
];

export const taskColumnDefs: ColDef[] = [
  {
    field: 'open_task',
    headerName: 'Open Task',
    cellRenderer: OpenTaskButton,
    width: 100,
    minWidth: 100,
    maxWidth: 100
  },
  { field: 'id', headerName: 'ID', width: 100, minWidth: 100, resizable: true },
  {
    field: 'assigned_user_id',
    headerName: 'Assigned User',
    cellRenderer: (params: UserCellRendererParams) => userCellRenderer(params),
    filter: CustomFilter,
    width: 200,
    minWidth: 200,
    resizable: true
  },
  {
    field: 'task_type',
    headerName: 'Task Type',
    cellRenderer: (params: ICellRendererParams) => taskTypeCellRenderer(params),
    filter: CustomFilter,
    width: 150,
    minWidth: 150,
    resizable: true
  },
  {
    field: 'status',
    headerName: 'Status',
    cellRenderer: (params: ICellRendererParams) => taskStatusCellRenderer(params),
    filter: CustomFilter,
    width: 150,
    minWidth: 150,
    resizable: true
  },
  { field: 'total_time', headerName: 'Total Time', width: 200, minWidth: 200, resizable: true },
  { field: 'name', headerName: 'Name', width: 200, minWidth: 200, resizable: true },
  { field: 'description', headerName: 'Description', width: 200, minWidth: 200, resizable: true },
  {
    field: 'priority',
    headerName: 'Priority',
    cellRenderer: (params: ICellRendererParams) => taskPriorityCellRenderer(params),
    filter: CustomFilter,
    width: 150,
    minWidth: 150,
    resizable: true
  }
];

export const unassignedTaskColumnDefs: ColDef[] = [
  {
    field: 'take_task',
    headerName: 'Take Task',
    cellRenderer: TakeTaskButton,
    width: 180,
    minWidth: 180,
    maxWidth: 180
  },
  { field: 'id', headerName: 'ID', width: 100, minWidth: 100, resizable: true },
  {
    field: 'assigned_user_id',
    headerName: 'Assigned User',
    cellRenderer: (params: UserCellRendererParams) => userCellRenderer(params),
    filter: CustomFilter,
    width: 200,
    minWidth: 200,
    resizable: true
  },
  {
    field: 'task_type',
    headerName: 'Task Type',
    cellRenderer: (params: ICellRendererParams) => taskTypeCellRenderer(params),
    filter: CustomFilter,
    width: 150,
    minWidth: 150,
    resizable: true
  },
  {
    field: 'status',
    headerName: 'Status',
    cellRenderer: (params: ICellRendererParams) => taskStatusCellRenderer(params),
    filter: CustomFilter,
    width: 150,
    minWidth: 150,
    resizable: true
  },
  { field: 'total_time', headerName: 'Total Time', width: 200, minWidth: 200, resizable: true },
  { field: 'name', headerName: 'Name', width: 200, minWidth: 200, resizable: true },
  { field: 'description', headerName: 'Description', width: 200, minWidth: 200, resizable: true },
  {
    field: 'priority',
    headerName: 'Priority',
    cellRenderer: (params: ICellRendererParams) => taskPriorityCellRenderer(params),
    filter: CustomFilter,
    width: 150,
    minWidth: 150,
    resizable: true
  }
];

export const labelAssignmentColumnDefs: ColDef[] = [
  { field: 'id', headerName: 'ID', width: 100, minWidth: 100, resizable: true },
  {
    field: 'label_id',
    headerName: 'Label',
    cellRenderer: (params: LabelCellRendererParams) => labelCellRenderer(params),
    filter: CustomFilter,
    width: 250,
    minWidth: 200,
    resizable: true
  },
  { field: 'image_instance_id', headerName: 'Image Instance ID', width: 100, minWidth: 100, resizable: true },
  {
    field: 'author_id',
    headerName: 'Author',
    cellRenderer: (params: UserCellRendererParams) => userCellRenderer(params),
    filter: CustomFilter,
    width: 250,
    minWidth: 250,
    resizable: true
  },
  { field: 'parent_task_id', headerName: 'Parent Task ID', width: 200, minWidth: 200, resizable: true },
  {
    field: 'annotations',
    headerName: 'Annotations',
    cellRenderer: (params: ICellRendererParams) => annotationsCellRenderer(params),
    width: 250,
    minWidth: 250,
    resizable: true
  }
];

export const annotationColumnDefs: ColDef[] = [
  { field: 'id', headerName: 'ID', width: 100, minWidth: 100, resizable: true },
  { field: 'label_assignment_id', headerName: 'Label Assignment ID', width: 200, minWidth: 200, resizable: true },
  {
    field: 'author_id',
    headerName: 'Author',
    cellRenderer: (params: UserCellRendererParams) => userCellRenderer(params),
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
    cellRenderer: (params: ICellRendererParams) => taskStatusCellRenderer(params),
    filter: CustomFilter,
    width: 150,
    minWidth: 150,
    resizable: true
  },
  {
    field: 'reviews',
    headerName: 'Reviews',
    cellRenderer: (params: ICellRendererParams) => annotationReviewsCellRenderer(params),
    width: 200,
    minWidth: 200,
    resizable: true
  }
];

export const labelColumnDefs: ColDef[] = [
  { field: 'id', headerName: 'ID', width: 100, minWidth: 100, resizable: true },
  { field: 'name', headerName: 'Name', width: 300, minWidth: 200, resizable: true },
  {
    field: 'allowed_annotation_type',
    headerName: 'Allowed Annotation Type',
    cellRenderer: (params: ICellRendererParams) => labelAllowedAnnotationTypesCellRenderer(params),
    width: 300,
    minWidth: 300,
    resizable: true,
    filter: CustomFilter
  },
  {
    field: 'types',
    headerName: 'Label Type',
    cellRenderer: (params: ICellRendererParams) => labelTypesCellRenderer(params),
    filter: CustomFilter,
    width: 300,
    minWidth: 300,
    resizable: true
  }
];
