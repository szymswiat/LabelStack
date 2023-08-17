import React, { useEffect, useState } from 'react';

import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridApi, GridReadyEvent, IRowNode } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import { api, User, Label, LabelAssignment, RoleType, TaskType, ImageInstance } from '@labelstack/api';

import CreateAnnotateTaskForm from '../../../../components/Forms/Tasks/CreateAnnotateTaskForm';
import SelectedItemsTable from '../../../../components/tables/SelectedItemsTable';
import { imageInstancesColumnDefs, labelAssignmentColumnDefs } from '../../images/columnDefs';
import {
  selectedLabelAssignmentsTableHeaders,
  selectedImagesTableHeaders
} from '../../../../components/tables/tableHeaders';
import { useUserDataContext } from '../../../../contexts/UserDataContext';
import { useEffectNonNull } from '../../../../utils/hooks';
import TableLayoutWithBar from '../../../../layouts/TableLayoutWithBar';
import { defaultColDef } from '../../labels/columnDefs';
import { AnnotationTypes } from '@labelstack/api';
import SelectCreateTaskTypeBar from '../SelectCreateTaskTypeBar';
import AnnotationTaskContentTypeSelector, { AnnotationTaskContentType } from './AnnotationTaskContentTypeSelector';

const CreateAnnotationTask: React.FC = () => {
  const [{ token }] = useUserDataContext();

  const [gridApi, setGridApi] = useState<GridApi>();

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [annotators, setAnnotators] = useState<User[]>([]);
  const [labels, setLabels] = useState<Label[]>();
  const [labelAssignments, setLabelAssignments] = useState<LabelAssignment[]>();
  const [selectedLabelAssignments, setSelectedLabelAssignments] = useState<LabelAssignment[]>([]);
  const [images, setImages] = useState<ImageInstance[]>([]);
  const [selectedImageInstances, setSelectedImageInstances] = useState<ImageInstance[]>([]);
  const [selectedContentType, setSelectedContentType] = useState<AnnotationTaskContentType>(
    AnnotationTaskContentType.labelAssignment
  );

  async function loadUsers() {
    const { data: responseUsers } = await api.getUsers(token);
    setUsers(responseUsers);

    const responseAnnotators = responseUsers.filter((user) => {
      return user.roles.some((role) => {
        return role.type === RoleType.annotator;
      });
    });
    setAnnotators(responseAnnotators);
  }

  async function loadLabels() {
    const { data: responseLabels } = await api.getLabels(token);
    setLabels(responseLabels);
  }

  async function loadLabelAssignments() {
    let { data: responseLabelAssignments } = await api.getLabelAssignments(token, true, true, [
      AnnotationTypes.segment
    ]);

    responseLabelAssignments = responseLabelAssignments.map((labelAssignment) => {
      const label = labels.find((label) => label.id == labelAssignment.label_id);
      return { ...labelAssignment, label: label.name };
    });

    setLabelAssignments(responseLabelAssignments);
  }

  async function loadImages() {
    const { data: responseImages } = await api.getImageInstances(token, true);
    setImages(responseImages);
  }

  const setColumnDefinitions = () => {
    const colDefs: ColDef[] = labelAssignmentColumnDefs.map((columnDef) => {
      if (columnDef.field == 'author_id') {
        columnDef.cellRendererParams = { users: users };
        columnDef.filterParams = {
          entries: users.map((user) => {
            return { label: user.email, id: user.id };
          }),
          compareIdFn: (row: any, ids: number[]) => {
            if (row.author_id != undefined && ids.includes(row.author_id)) return true;
            return false;
          }
        };
      } else if (columnDef.field == 'label_id') {
        columnDef.cellRendererParams = { labels: labels };
        columnDef.filterParams = {
          entries: labels.map((label) => {
            return { label: label.name, id: label.id };
          }),
          compareIdFn: (row: any, ids: number[]) => {
            if (row.label_id != undefined && ids.includes(row.label_id)) return true;
            return false;
          }
        };
      }

      return columnDef;
    });

    setColumnDefs(colDefs);
  };

  const onLabelAssignmentsSelectionChanged = () => {
    if (gridApi) {
      const selectedRows = gridApi.getSelectedRows();
      setSelectedLabelAssignments(selectedRows);
    }
  };

  const onImageInstancesSelectionChanged = () => {
    if (gridApi) {
      const selectedRows = gridApi.getSelectedRows();
      setSelectedImageInstances(selectedRows);
    }
  };

  const onImageInstancesGridReady = (event: GridReadyEvent) => {
    setGridApi(event.api);

    const selectedImageIds = selectedImageInstances.map((image) => image.id);

    const nodesToSelect = event.api.getRenderedNodes().filter((node) => {
      const image = node.data as ImageInstance;
      return selectedImageIds.includes(image.id);
    });
    event.api.setNodesSelected({ nodes: nodesToSelect, newValue: true });
  };

  const onLabelAssignmentGridReady = (event: GridReadyEvent) => {
    setGridApi(event.api);

    const selectedLabelAssignmentsIds = selectedLabelAssignments.map((image) => image.id);

    const nodesToSelect = event.api.getRenderedNodes().filter((node) => {
      const labelAssignment = node.data as LabelAssignment;
      return selectedLabelAssignmentsIds.includes(labelAssignment.id);
    });
    event.api.setNodesSelected({ nodes: nodesToSelect, newValue: true });
  };

  useEffect(() => {
    loadUsers();
    loadLabels();
    loadImages();
  }, []);

  useEffectNonNull(
    () => {
      loadLabelAssignments();
    },
    [],
    [labels]
  );

  useEffectNonNull(
    () => {
      if (users.length > 0 && labels.length > 0) {
        setColumnDefinitions();
      }
    },
    [],
    [users, labels]
  );

  function renderRightBar(): React.ReactNode {
    return (
      <div className="flex flex-col">
        <div className="h-20 w-full mt-3">
          <SelectCreateTaskTypeBar taskType={TaskType.annotation} />
        </div>
        <div className="h-14 w-full">
          <AnnotationTaskContentTypeSelector
            selectedContentType={selectedContentType}
            setSelectedContentType={setSelectedContentType}
          />
        </div>
        <div className="w-full">
          <CreateAnnotateTaskForm
            annotators={annotators}
            selectedImageInstances={selectedImageInstances}
            selectedLabelAssignments={selectedLabelAssignments}
            gridApi={gridApi}
            reloadLabelAssignments={loadLabelAssignments}
          />
        </div>
        <div className="w-full">
          {selectedContentType == AnnotationTaskContentType.imageInstance && (
            <SelectedItemsTable
              header="Selected Images"
              tableColumnInfo={selectedImagesTableHeaders}
              data={selectedImageInstances}
            />
          )}
          {selectedContentType == AnnotationTaskContentType.labelAssignment && (
            <SelectedItemsTable
              header="Selected Label Assignments"
              tableColumnInfo={selectedLabelAssignmentsTableHeaders}
              data={selectedLabelAssignments}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <TableLayoutWithBar rightBarComponent={renderRightBar()}>
      {selectedContentType == AnnotationTaskContentType.imageInstance && (
        <AgGridReact
          onGridReady={onImageInstancesGridReady}
          onSelectionChanged={onImageInstancesSelectionChanged}
          rowData={images}
          rowSelection="multiple"
          defaultColDef={defaultColDef}
          columnDefs={imageInstancesColumnDefs}
          className="ag-theme-alpine-dark"
        />
      )}
      {selectedContentType == AnnotationTaskContentType.labelAssignment && (
        <AgGridReact
          onGridReady={onLabelAssignmentGridReady}
          onSelectionChanged={onLabelAssignmentsSelectionChanged}
          rowData={labelAssignments}
          rowSelection="multiple"
          defaultColDef={defaultColDef}
          columnDefs={columnDefs}
          className="ag-theme-alpine-dark"
        />
      )}
    </TableLayoutWithBar>
  );
};

export default CreateAnnotationTask;
