import React, { useState } from 'react';

import { api, ImageInstance, Label } from '@labelstack/api';

import { useUserDataContext } from '../../../../contexts/UserDataContext';
import { showDangerNotification, showSuccessNotification, showNotificationWithApiError } from '../../../../utils';
import Divider from '../../../Divider';
import { GridApi } from 'ag-grid-community';

interface LabelImageInstancesFormProps {
  selectedImages: ImageInstance[];
  labels: Label[] | null;
  gridApi: GridApi;
}

const AssignLabelsForm: React.FC<LabelImageInstancesFormProps> = ({ selectedImages, labels, gridApi }) => {
  const [{ token }] = useUserDataContext();
  const [labelIds, setLabelIds] = useState<number[] | null>(null);
  const [labelIdsValid, setLabelIdsValid] = useState<boolean | null>(null);

  async function labelImages(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isFormValid()) {
      try {
        await Promise.all(
          labelIds.map((labelId) =>
            api.addLabelAssignments(
              token,
              labelId,
              selectedImages.map((image) => image.id)
            )
          )
        );
        showSuccessNotification('Success', 'Labels assigned successfully!');
        clearForm();
        if (gridApi) gridApi.deselectAll();
      } catch (error) {
        showNotificationWithApiError(error);
      }
    }
  }

  function clearForm() {
    setLabelIds(null);
    setLabelIdsValid(null);
  }

  function isFormValid() {
    if (labelIds === null || labelIds.length <= 0) {
      setLabelIdsValid(false);
      showDangerNotification('Input error', 'At least one label has to be selected!');
      return false;
    } else if (selectedImages === null || selectedImages.length <= 0) {
      showDangerNotification(null, 'You have to choose at least one image!');
      return false;
    }
    return true;
  }

  function handleLabelsChange(e: React.ChangeEvent<HTMLSelectElement>) {
    if (e && e.target && e.target.selectedOptions) {
      const selectedOptions = e.target.selectedOptions as HTMLCollection;
      let labelTypesIdsArray = [];
      for (let i = 0; i < selectedOptions.length; i++) {
        const option = selectedOptions[i] as HTMLOptionElement;
        labelTypesIdsArray.push(Number(option.value));
      }
      setLabelIds(labelTypesIdsArray);
      setLabelIdsValid(true);
    }
  }

  return (
    <>
      <p className="w-full text-center text-xl font-bold py-2">Label Images</p>
      <Divider />
      <form className="w-full flex flex-col px-6 gap-y-2 text-sm font-medium" onSubmit={labelImages}>
        <div className="w-full flex flex-col items-center">
          <label htmlFor="labels" className="w-full py-1 pb-2 ml-2">
            Labels
          </label>
          <select
            multiple
            id="labels"
            onChange={(e) => handleLabelsChange(e)}
            className="w-full block rounded-lg text-sm border bg-dark-bg p-2 h-48 "
          >
            {labels &&
              labels.map((label) => (
                <option value={label.id} key={'label_' + label.id}>
                  {label.name}
                </option>
              ))}
          </select>
          {labelIdsValid === false && (
            <p className="w-full mt-1 mr-3 text-xs text-right dark:text-red-500">
              At least one label has to be selected!
            </p>
          )}
        </div>
        <div className="w-full flex flex-col items-center px-8 my-3">
          <button type="submit" className="w-full font-medium rounded-lg text-sm text-center bg-dark-bg h-10">
            Submit
          </button>
        </div>
      </form>
    </>
  );
};

export default AssignLabelsForm;
