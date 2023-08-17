import React, { useEffect, useState } from 'react';

import { AgGridReact } from 'ag-grid-react';
import { GridApi } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import { api, User, RoleType, ImageInstance, TaskType } from '@labelstack/api';

import CreateLabelTaskForm from '../../../../components/Forms/Tasks/CreateLabelTaskForm';
import SelectedItemsTable from '../../../../components/tables/SelectedItemsTable';
import { imageInstancesColumnDefs } from '../columnDefs';
import { selectedImagesTableHeaders } from '../../../../components/tables/tableHeaders';
import { useUserDataContext } from '../../../../contexts/UserDataContext';
import TableLayoutWithBar from '../../../../layouts/TableLayoutWithBar';
import { defaultColDef } from '../../labels/columnDefs';
import SelectCreateTaskTypeBar from '../SelectCreateTaskTypeBar';

const CreateLabelTask: React.FC = () => {
  const [{ token }] = useUserDataContext();

  const [gridApi, setGridApi] = useState<GridApi>();

  const [annotators, setAnnotators] = useState<User[]>([]);
  const [images, setImages] = useState<ImageInstance[]>([]);
  const [selectedImages, setSelectedImages] = useState<ImageInstance[]>([]);

  async function loadAnnotators() {
    const { data: users } = await api.getUsers(token);
    const reponseAnnotators = users.filter((user) => {
      return user.roles.some((role) => {
        return role.type === RoleType.annotator;
      });
    });
    setAnnotators(reponseAnnotators);
  }

  async function loadImages() {
    const { data: responseImages } = await api.getImageInstances(token, true);
    setImages(responseImages);
  }

  function onSelectionChanged() {
    if (gridApi) {
      const selectedRows = gridApi.getSelectedRows();
      setSelectedImages(selectedRows);
    }
  }

  function onGridReady(params: any) {
    setGridApi(params.api);
  }

  useEffect(() => {
    loadAnnotators();
    loadImages();
  }, []);

  function renderRightBar(): React.ReactNode {
    return (
      <div className="flex flex-col">
        <div className="h-20 w-full mt-3">
          <SelectCreateTaskTypeBar taskType={TaskType.labelAssignment} />
        </div>
        <div className="w-full">
          <CreateLabelTaskForm
            annotators={annotators}
            selectedImages={selectedImages}
            gridApi={gridApi}
            reloadImages={loadImages}
          />
        </div>
        <div className="w-full">
          <SelectedItemsTable
            header="Selected Images"
            tableColumnInfo={selectedImagesTableHeaders}
            data={selectedImages}
            isImageList={true}
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
        rowData={images}
        rowSelection="multiple"
        defaultColDef={defaultColDef}
        columnDefs={imageInstancesColumnDefs}
        className="ag-theme-alpine-dark"
      />
    </TableLayoutWithBar>
  );
};

export default CreateLabelTask;
