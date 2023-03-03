import React, { useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';

import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css';

import { AnnotationType, api, Label, LabelType } from '@labelstack/api';

import CreateLabelForm from '../../../../components/Forms/Labels/CreateLabelForm';
import { defaultColDef, labelColumnDefs } from '../columnDefs';
import { useUserDataContext } from '../../../../contexts/UserDataContext';
import { useEffectNonNull } from '../../../../utils/hooks';
import TableLayoutWithBar from '../../../../layouts/TableLayoutWithBar';

interface ManageLabelsProps {}

const ManageLabels: React.FC<ManageLabelsProps> = ({}) => {
  const [{ token }] = useUserDataContext();

  const [labels, setLabels] = useState<Label[]>();
  const [annotationTypes, setAnnotationTypes] = useState<AnnotationType[]>([]);
  const [labelTypes, setLabelTypes] = useState<LabelType[]>([]);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);

  const loadLabels = () => {
    api.getLabels(token).then((response: AxiosResponse) => {
      const responseLabels = response.data as Label[];
      setLabels(responseLabels);
    });
  };

  const loadAnnotationTypes = () => {
    api.getAnnotationTypes(token).then((response: AxiosResponse) => {
      const responseAnnotationTypes = response.data as AnnotationType[];
      setAnnotationTypes(responseAnnotationTypes);
    });
  };

  const loadLabelTypes = () => {
    api.getLabelTypes(token).then((response: AxiosResponse) => {
      const responseLabelTypes = response.data as LabelType[];
      setLabelTypes(responseLabelTypes);
    });
  };

  const setColumnDefinitions = () => {
    const filterEntries = annotationTypes.map((annotationType) => ({
      label: annotationType.name,
      id: annotationType.id
    }));
    const colDefs = labelColumnDefs.map((columnDef) => {
      if (columnDef.field == 'allowed_annotation_type') {
        columnDef.filterParams = {
          entries: filterEntries,
          compareIdFn: (row: any, ids: number[]) => {
            if (row.allowed_annotation_type != undefined && ids.includes(row.allowed_annotation_type.id)) return true;
            return false;
          }
        };
      } else if (columnDef.field == 'types') {
        columnDef.filterParams = {
          entries: labelTypes.map((labelType) => {
            return { label: labelType.name, id: labelType.id };
          }),
          compareIdFn: (row: any, ids: number[]) => {
            if (row.types != undefined) {
              for (let i = 0; i < row.types.length; i++) {
                if (ids.includes(row.types[i].id)) return true;
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
    loadAnnotationTypes();
    loadLabelTypes();
    loadLabels();
  }, []);

  useEffectNonNull(
    () => {
      // if (annotationTypes.length > 0 && labelTypes.length > 0) {
        setColumnDefinitions();
      // }
    },
    [],
    [annotationTypes, labelTypes]
  );

  function renderRightBar() {
    return (
      <div className="grow-0 shrink-0 w-full">
        <CreateLabelForm annotationTypes={annotationTypes} labelTypes={labelTypes} reloadLabels={loadLabels} />
      </div>
    );
  }

  return (
    <TableLayoutWithBar rightBarComponent={renderRightBar()}>
      <AgGridReact
        rowData={labels}
        defaultColDef={defaultColDef}
        columnDefs={columnDefs}
        className="ag-theme-alpine-dark"
      />
    </TableLayoutWithBar>
  );
};

export default ManageLabels;
