import React, { useEffect, useState } from 'react';

import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridApi } from 'ag-grid-community';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css';

import { api, User, RoleType, ImageInstance } from '@labelstack/api';

import CreateLabelTaskForm from '../../../../components/Forms/Tasks/CreateLabelTaskForm';
import SelectedItemsTable from '../../../../components/Tables/SelectedItemsTable';
import { defaultColDef, imageInstancesColumnDefs } from '../../../../const/ag-grid/columnDefs';
import { selectedImagesTableHeaders } from '../../../../const/tableHeaders';
import { useUserDataContext } from '../../../../contexts/UserDataContext';
import { ImageInstanceTagValue, Tag } from '@labelstack/api/src/schemas/tag';
import { FilterEntry } from '../../../../const/ag-grid/filters/FilterEntry';
import RightBarLayout from '../../../../layouts/RightBarLayout';

const ImagesToLabel = () => {
  const [{ token }] = useUserDataContext();

  const [gridApi, setGridApi] = useState<GridApi>();

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);
  const [imageTags, setImageTags] = useState<Tag[]>([]);

  const [annotators, setAnnotators] = useState<User[]>([]);
  const [images, setImages] = useState<ImageInstance[]>([]);
  const [selectedImages, setSelectedImages] = useState<ImageInstance[]>([]);

  const loadAnnotators = () => {
    api.getUsers(token).then((response) => {
      const users = response.data as User[];
      const reponseAnnotators = users.filter((user) => {
        return user.roles.some((role) => {
          return role.type === RoleType.annotator;
        });
      });
      setAnnotators(reponseAnnotators);
    });
  };

  const loadImages = () => {
    api.getImageInstances(token, true, true).then((response) => {
      const responseImages = response.data as ImageInstance[];
      let tags = new Array<Tag>();
      responseImages.forEach((image: ImageInstance) => {
        if (image.tags && image.tags.length > 0) {
          image.tags.forEach((tagValue: ImageInstanceTagValue) => {
            tags.push(tagValue.tag);
          });
        }
      });

      // @ts-ignore
      const uniqueTags = [...new Map(tags.map((tag) => [tag.id, tag])).values()];
      setImageTags(Array.from(uniqueTags));
      setImages(responseImages);
    });
  };

  const onSelectionChanged = () => {
    if (gridApi) {
      const selectedRows = gridApi.getSelectedRows();
      setSelectedImages(selectedRows);
    }
  };

  const onGridReady = (params: any) => {
    setGridApi(params.api);
  };

  const setColumnDefinitions = () => {
    const tagFilterEntries: FilterEntry[] = imageTags.map((tag) => {
      return {
        label: tag.name,
        id: tag.id
      };
    });
    const colDefs = imageInstancesColumnDefs.map((columnDef) => {
      if (columnDef.field == 'tags') {
        columnDef.filterParams = {
          entries: tagFilterEntries,
          compareIdFn: (row: any, ids: number[]) => {
            if (row.tags != undefined) {
              for (let i = 0; i < row.tags.length; i++) {
                if (ids.includes(row.tags[i].tag.id)) return true;
              }
            }
            return false;
          }
        };
      }

      return columnDef;
    });

    setColumnDefs(colDefs);
  };

  useEffect(() => {
    loadAnnotators();
    loadImages();
  }, []);

  useEffect(() => {
    if (images && images.length > 0) {
      setColumnDefinitions();
    }
  }, [images]);

  function renderRightBar(): React.ReactNode {
    return (
      <div className="flex flex-col">
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
    <RightBarLayout rightBarComponent={renderRightBar()}>
      <AgGridReact
        onGridReady={onGridReady}
        onSelectionChanged={onSelectionChanged}
        rowData={images}
        rowSelection="multiple"
        defaultColDef={defaultColDef}
        columnDefs={columnDefs}
        className="ag-theme-alpine-dark"
      />
    </RightBarLayout>
  );
};

export default ImagesToLabel;
