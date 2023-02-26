import React, { useEffect, useState } from 'react';

import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridApi } from 'ag-grid-community';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css';

import { api, User, Label, LabelAssignment, RoleType } from '@labelstack/api';

import CreateAnnotateTaskForm from '../../../../components/Forms/Tasks/CreateAnnotateTaskForm';
import SelectedItemsTable from '../../../../components/Tables/SelectedItemsTable';
import { defaultColDef, labelAssignmentColumnDefs } from '../../../../const/ag-grid/columnDefs';
import { selectedLabelAssignmentsTableHeaders } from '../../../../const/tableHeaders';
import { useUserDataContext } from '../../../../contexts/UserDataContext';
import LayoutCard from '@labelstack/viewer/src/components/LayoutCard';

const ImagesToAnnotate = () => {
  const [{ token }] = useUserDataContext();

  const [gridApi, setGridApi] = useState<GridApi>();

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [annotators, setAnnotators] = useState<User[]>([]);
  const [labels, setLabels] = useState<Label[]>();
  const [labelAssignments, setLabelAssignments] = useState<LabelAssignment[]>();
  const [selectedLabelAssignments, setSelectedLabelAssignments] = useState<LabelAssignment[]>([]);

  const loadUsers = () => {
    const allUsersRequest = api.getUsers(token);
    if (allUsersRequest) {
      allUsersRequest.then((response) => {
        const responseUsers = response.data as User[];
        setUsers(responseUsers);

        const responseAnnotators = responseUsers.filter((user) => {
          return user.roles.some((role) => {
            return role.type === RoleType.annotator;
          });
        });
        setAnnotators(responseAnnotators);
      });
    }
  };

  const loadLabels = () => {
    api.getLabels(token).then((response) => {
      const responseLabels: Label[] = response.data as Label[];
      setLabels(responseLabels);
    });
  };

  const loadLabelAssignments = () => {
    api.getLabelAssignments(token, true, true).then((response) => {
      let responseLabelAssignments = response.data as LabelAssignment[];

      if (labels) {
        responseLabelAssignments = responseLabelAssignments.map((labelAssignment) => {
          const label = labels.find((label) => label.id == labelAssignment.label_id);
          return { ...labelAssignment, label: label.name };
        }) as any;
      }
      setLabelAssignments(responseLabelAssignments);
    });
  };

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

  const onSelectionChanged = () => {
    if (gridApi) {
      const selectedRows = gridApi.getSelectedRows();
      setSelectedLabelAssignments(selectedRows);
    }
  };

  const onGridReady = (params: any) => {
    setGridApi(params.api);
  };

  useEffect(() => {
    loadUsers();
    loadLabels();
  }, []);

  useEffect(() => {
    loadLabelAssignments();
  }, [labels]);

  useEffect(() => {
    if (users && users.length > 0 && labels && labels.length > 0) {
      setColumnDefinitions();
    }
  }, [users, labels]);

  return (
    <div className="flex flex-row h-full w-full overflow-auto gap-x-4">
      <div className="basis-3/4 ag-theme-alpine-dark py-1">
        <AgGridReact
          onGridReady={onGridReady}
          onSelectionChanged={onSelectionChanged}
          rowData={labelAssignments}
          rowSelection="multiple"
          defaultColDef={defaultColDef}
          columnDefs={columnDefs}
        />
      </div>
      <LayoutCard className="flex-col h-full basis-1/4 overflow-auto px-4">
        <div className="grow-0 shrink-0 w-full">
          <CreateAnnotateTaskForm
            annotators={annotators}
            selectedLabelAssignments={selectedLabelAssignments}
            gridApi={gridApi}
            reloadLabelAssignments={loadLabelAssignments}
          />
        </div>
        <div className="grow-0 shrink-0 w-full px-4">
          <SelectedItemsTable
            header="Selected Label Assignments"
            tableColumnInfo={selectedLabelAssignmentsTableHeaders}
            data={selectedLabelAssignments}
          />
        </div>
      </LayoutCard>
    </div>
  );
};

export default ImagesToAnnotate;
