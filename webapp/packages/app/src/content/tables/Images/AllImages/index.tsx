import React, { useEffect, useState } from 'react';
import { AxiosError, AxiosResponse } from 'axios';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css';

import { api, ImageInstance, requestErrorMessageKey } from '@labelstack/api';

import { defaultColDef, imageInstancesColumnDefs } from '../../../../const/ag-grid/columnDefs';
import { useUserDataContext } from '../../../../contexts/UserDataContext';
import { showDangerNotification } from '../../../../utils';

const AllImages: React.FC = () => {
  const [{ token }] = useUserDataContext();

  const [images, setImages] = useState<ImageInstance[]>();

  useEffect(() => {
    api
      .getImageInstances(token, false, false)
      .then((response: AxiosResponse) => {
        const responseImages = response.data as ImageInstance[];
        setImages(responseImages);
      })
      .catch((error: AxiosError) => {
        showDangerNotification(undefined, error.response.data[requestErrorMessageKey]);
      });
  }, []);

  return (
    <div className="flex flex-row h-full w-full overflow-auto">
      <div className="w-full ag-theme-alpine-dark">
        <AgGridReact
          rowData={images}
          rowSelection="multiple"
          defaultColDef={defaultColDef}
          columnDefs={imageInstancesColumnDefs}
        />
      </div>
    </div>
  );
};

export default AllImages;
