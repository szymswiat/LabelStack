import React, { useEffect, useState } from 'react';

import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridApi } from 'ag-grid-community';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css';

import { Annotation, api, User, RoleType, taskStatusRepresentation } from '@labelstack/api';

import CreateAnnotationReviewTaskForm from '../../../../components/Forms/Tasks/CreateAnnotationReviewTaskForm';
import SelectedItemsTable from '../../../../components/tables/SelectedItemsTable';
import { annotationColumnDefs } from '../columnDefs';
import { selectedAnnotationsTableHeaders } from '../../../../components/tables/tableHeaders';
import { useUserDataContext } from '../../../../contexts/UserDataContext';
import { useEffectNonNull } from '../../../../utils/hooks';
import TableLayoutWithBar from '../../../../layouts/TableLayoutWithBar';
import { defaultColDef } from '../../labels/columnDefs';

const ImagesToReview = () => {
  const [{ token }] = useUserDataContext();

  const [gridApi, setGridApi] = useState<GridApi>();

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [allAnnotators, setAllAnnotators] = useState<User[]>([]);
  const [availableAnnotators, setAvailableAnnotators] = useState<User[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>();
  const [selectedAnnotations, setSelectedAnnotations] = useState<Annotation[]>([]);

  async function loadUsers() {
    const { data: users } = await api.getUsers(token);
    setUsers(users);

    const annotators = users.filter((user) => {
      return user.roles.some((role) => {
        return role.type === RoleType.annotator;
      });
    });
    setAllAnnotators(annotators);
    setAvailableAnnotators(annotators);
  }

  async function loadAnnotations() {
    const { data: annotations } = await api.getAnnotations(token, undefined, undefined, true, true, undefined);
    setAnnotations(annotations);
  }

  function getAvailableAnnotators(selectedRows: Annotation[]) {
    const idsFromSelectedAnnotations = selectedRows.map((annotation) => {
      return annotation.author_id;
    });
    const uniqueIds = new Set(idsFromSelectedAnnotations);
    const annotators = allAnnotators.filter((annotator: User) => {
      return !uniqueIds.has(annotator.id);
    });
    setAvailableAnnotators(annotators);
  }

  function setColumnDefinitions() {
    const colDefs: ColDef[] = annotationColumnDefs.map((columnDef) => {
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
      } else if (columnDef.field == 'status') {
        columnDef.filterParams = {
          entries: Object.entries(taskStatusRepresentation).map(([key, value]) => {
            return { label: value, id: key };
          }),
          compareIdFn: (row: any, ids: number[]) => {
            if (row.status != undefined && ids.includes(row.status)) return true;
            return false;
          }
        };
      }
      return columnDef;
    });

    setColumnDefs(colDefs);
  }

  function onSelectionChanged() {
    if (gridApi) {
      const selectedRows = gridApi.getSelectedRows();
      setSelectedAnnotations(selectedRows);
      getAvailableAnnotators(selectedRows);
    }
  };

  function onGridReady(params: any) {
    setGridApi(params.api);
  };

  useEffect(() => {
    loadUsers();
    loadAnnotations();
  }, []);

  useEffectNonNull(
    () => {
      if (users.length > 0) {
        setColumnDefinitions();
      }
    },
    [],
    [users]
  );

  function renderRightBar(): React.ReactNode {
    return (
      <div className="flex flex-col">
        <div className="w-full">
          <CreateAnnotationReviewTaskForm
            annotators={availableAnnotators}
            selectedAnnotations={selectedAnnotations}
            gridApi={gridApi}
            reloadAnnotations={loadAnnotations}
          />
        </div>
        <div className="w-full">
          <SelectedItemsTable
            header="Selected Annotations"
            tableColumnInfo={selectedAnnotationsTableHeaders}
            data={selectedAnnotations}
          />
        </div>
      </div>
    );
  }

  return (
    <TableLayoutWithBar rightBarComponent={renderRightBar()}>
      <AgGridReact
        onGridReady={onGridReady}
        onSelectionChanged={onSelectionChanged}
        rowData={annotations}
        rowSelection="multiple"
        defaultColDef={defaultColDef}
        columnDefs={columnDefs}
        className="ag-theme-alpine-dark"
      />
    </TableLayoutWithBar>
  );
};

export default ImagesToReview;
