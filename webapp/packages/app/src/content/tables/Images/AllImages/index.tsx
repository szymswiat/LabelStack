import React, { useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css';

import { api, ImageInstance } from '@labelstack/api';

import { defaultColDef, imageInstancesColumnDefs } from '../../../../const/ag-grid/columnDefs';
import { useUserDataContext } from '../../../../contexts/UserDataContext';
import { showNotificationWithApiError } from '../../../../utils';
import RightBarLayout from '../../../../layouts/RightBarLayout';
import { GridApi } from 'ag-grid-community';
import SelectedItemsTable from '../../../../components/Tables/SelectedItemsTable';
import { selectedImagesTableHeaders } from '../../../../const/tableHeaders';

const AllImages: React.FC = () => {
  const [{ token }] = useUserDataContext();

  const [images, setImages] = useState<ImageInstance[]>();
  const [gridApi, setGridApi] = useState<GridApi>();
  const [selectedImages, setSelectedImages] = useState<ImageInstance[]>([]);

  useEffect(() => {
    api
      .getImageInstances(token, false, false)
      .then((response: AxiosResponse) => {
        const responseImages = response.data as ImageInstance[];
        setImages(responseImages);
      })
      .catch((error) => {
        showNotificationWithApiError(error);
      });
  }, []);

  const onSelectionChanged = () => {
    if (gridApi) {
      const selectedRows = gridApi.getSelectedRows();
      setSelectedImages(selectedRows);
    }
  };

  const onGridReady = (params: any) => {
    setGridApi(params.api);
  };

  function renderRightBar(): React.ReactNode {
    return (
      <div className="grow-0">
        <SelectedItemsTable
          header="Selected Images"
          tableColumnInfo={selectedImagesTableHeaders}
          data={selectedImages}
          isImageList={true}
        />
      </div>
    );
  }

  return (
    <RightBarLayout rightBarComponent={renderRightBar()}>
      <AgGridReact
        rowData={images}
        rowSelection="multiple"
        onGridReady={onGridReady}
        onSelectionChanged={onSelectionChanged}
        defaultColDef={defaultColDef}
        columnDefs={imageInstancesColumnDefs}
        className="ag-theme-alpine-dark"
      />
    </RightBarLayout>
  );
};

export default AllImages;
