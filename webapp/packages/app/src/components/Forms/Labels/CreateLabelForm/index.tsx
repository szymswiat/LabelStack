import React from 'react';
import { useState } from 'react';
import axios, { AxiosError } from 'axios';

import { AnnotationType, api, LabelCreateApiIn, LabelType, requestErrorMessageKey } from '@labelstack/api';

import Divider from '../../../Divider';
import { useUserDataContext } from '../../../../contexts/UserDataContext';
import { showDangerNotification, showSuccessNotification } from '../../../../utils';

interface CreateLabelFormParams {
  annotationTypes: AnnotationType[];
  labelTypes: LabelType[];

  reloadLabels: () => void;
}

const CreateLabelForm = ({ annotationTypes, labelTypes, reloadLabels }: CreateLabelFormParams) => {
  const [{ token }] = useUserDataContext();

  const [labelName, setLabelName] = useState<string>('');
  const [labelNameValid, setLabelNameValid] = useState<boolean>(undefined);
  const [allowedAnnotationTypeId, setAllowedAnnotationTypeId] = useState<number>(undefined);
  const [allowedAnnotationTypeIdValid, setAllowedAnnotationTypeIdValid] = useState<boolean>(undefined);
  const [labelTypesIds, setLabelTypesIds] = useState<number[]>(undefined);
  const [labelTypesIdsValid, setLabelTypesIdsValid] = useState<boolean>(undefined);

  const createLabel = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isFormValid()) {
      const newLabel: LabelCreateApiIn = {
        name: labelName,
        allowed_annotation_type_id: allowedAnnotationTypeId,
        type_ids: labelTypesIds
      };

      api
        .createLabel(token, newLabel)
        .then((_) => {
          const form = e.target as HTMLFormElement;
          form.reset();
          clearForm();
          showSuccessNotification(undefined, 'Label created successfully!');
          reloadLabels();
        })
        .catch((error: AxiosError) => {
          if (axios.isAxiosError(error)) {
            const axiosError: AxiosError = error;
            showDangerNotification(
              undefined,
              axiosError.response ? axiosError.response.data[requestErrorMessageKey] : ''
            );
          }
        });
    }
  };

  const clearForm = () => {
    setLabelName('');
    setLabelNameValid(undefined);
    setAllowedAnnotationTypeId(undefined);
    setAllowedAnnotationTypeIdValid(undefined);
    setLabelTypesIds(undefined);
    setLabelTypesIdsValid(undefined);
  };

  const isFormValid = () => {
    if (labelName === undefined || labelName === '') {
      setLabelNameValid(false);
      showDangerNotification(undefined, 'Label name is required!');
      return false;
    } else if (allowedAnnotationTypeId === undefined || allowedAnnotationTypeId < 0) {
      setAllowedAnnotationTypeIdValid(false);
      showDangerNotification(undefined, 'Allowed annotation type is required!');
      return false;
    } else if (labelTypesIds === undefined || labelTypesIds.length <= 0) {
      setLabelTypesIdsValid(false);
      showDangerNotification(undefined, 'Label types are required!');
      return false;
    }
    return true;
  };

  const handleLabelNameChange = (e) => {
    if (e && e.target && e.target.value) {
      const taskNameValue = e.target.value;
      setLabelName(taskNameValue);
      setLabelNameValid(true);
    } else {
      setLabelName('');
      setLabelNameValid(false);
    }
  };

  const handleAllowedAnnotationTypeChange = (e) => {
    if (e && e.target && e.target.value) {
      const annotatorIdValue = Number(e.target.value);
      if (typeof annotatorIdValue === 'number') {
        setAllowedAnnotationTypeId(annotatorIdValue);
        setAllowedAnnotationTypeIdValid(true);
      } else {
        setAllowedAnnotationTypeId(undefined);
        setAllowedAnnotationTypeIdValid(false);
      }
    }
  };

  const handleLabelTypesChange = (e) => {
    if (e && e.target && e.target.selectedOptions) {
      const selectedOptions = e.target.selectedOptions as HTMLCollection;
      let labelTypesIdsArray = [];
      for (let i = 0; i < selectedOptions.length; i++) {
        const option = selectedOptions[i] as HTMLOptionElement;
        labelTypesIdsArray.push(Number(option.value));
      }
      setLabelTypesIds(labelTypesIdsArray);
      setLabelTypesIdsValid(true);
    }
  };

  return (
    <>
      <p className="w-full py-4 mt-2 text-center text-xl font-bold">Create Label</p>
      <Divider />
      <form className="w-full text-sm font-medium px-6 flex flex-col gap-y-2" onSubmit={createLabel}>
        <div className="w-full flex flex-col items-center">
          <label htmlFor="label-name" className="w-full py-1 pb-2 ml-2">
            Label Name
          </label>
          <input
            type="text"
            id="label-name"
            value={labelName}
            onChange={(e) => handleLabelNameChange(e)}
            className="w-full block rounded-lg p-2 text-sm border bg-dark-bg"
          />
          {labelNameValid === false && (
            <p className="w-full mt-1 mr-3 text-xs text-right dark:text-red-500">Label name is required!</p>
          )}
        </div>
        <div className="w-full flex flex-col items-center">
          <label htmlFor="allowed-annotation-type" className="w-full py-1 pb-2 ml-2">
            Allowed Annotation Type
          </label>
          <select
            id="allowed-annotation-type"
            onChange={(e) => handleAllowedAnnotationTypeChange(e)}
            className="w-full block rounded-lg p-2 text-sm border bg-dark-bg"
          >
            <option hidden value={undefined} key="allowed_annotation_type_none">
              ---
            </option>
            {annotationTypes.map((annotationType) => (
              <option value={annotationType.id} key={'allowed_annotation_type_' + annotationType.id}>
                {annotationType.name}
              </option>
            ))}
          </select>
          {allowedAnnotationTypeIdValid === false && (
            <p className="w-full mt-1 mr-3 text-xs text-right dark:text-red-500">
              Allowed annotation type is required!
            </p>
          )}
        </div>
        <div className="w-full flex flex-col items-center">
          <label htmlFor="label-types" className="w-full py-1 pb-2 ml-2">
            Label Types
          </label>
          <select
            multiple
            id="label-types"
            onChange={(e) => handleLabelTypesChange(e)}
            className="w-full block rounded-lg p-2 text-sm border bg-dark-bg"
          >
            <option hidden value={undefined} key="label_type_none">
              ---
            </option>
            {labelTypes.map((labelType) => (
              <option value={labelType.id} key={'label_type_' + labelType.id}>
                {labelType.name}
              </option>
            ))}
          </select>
          {labelTypesIdsValid === false && (
            <p className="w-full mt-1 mr-3 text-xs text-right dark:text-red-500">Label types are required!</p>
          )}
        </div>
        <div className="w-full px-8 flex my-3">
          <button type="submit" className="w-full bg-dark-bg h-8 rounded-lg text-sm font-medium">
            Submit
          </button>
        </div>
      </form>
    </>
  );
};

export default CreateLabelForm;
