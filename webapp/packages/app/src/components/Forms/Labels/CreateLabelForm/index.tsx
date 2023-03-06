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
      <p className="w-full p-4 text-center text-xl font-bold dark:text-primary-light">Create Label</p>
      <Divider />
      <form className="w-full" onSubmit={createLabel}>
        <div className="w-full mb-2 flex flex-col items-center">
          <label htmlFor="label-name" className="w-10/12 p-2 block mb-1 text-sm font-medium dark:text-primary-light">
            Label Name
          </label>
          <input
            type="text"
            id="label-name"
            value={labelName}
            onChange={(e) => handleLabelNameChange(e)}
            className="w-10/12 block rounded-lg p-2 text-sm border dark:border-primary-light dark:focus:ring-primary-light dark:focus:border-primary-light dark:bg-secondary-active dark:placeholder-primary-light dark:text-primary-light"
          />
          {labelNameValid === false && <p className="w-10/12 text-xs dark:text-red-500">label name is required!</p>}
        </div>
        <div className="w-full mb-2 flex flex-col items-center">
          <label
            htmlFor="allowed-annotation-type"
            className="w-10/12 p-2 block mb-1 text-sm font-medium dark:text-primary-light"
          >
            Allowed Annotation Type
          </label>
          <select
            id="allowed-annotation-type"
            onChange={(e) => handleAllowedAnnotationTypeChange(e)}
            className="w-10/12 block rounded-lg p-2 text-sm border dark:border-primary-light dark:focus:ring-primary-light dark:focus:border-primary-light dark:bg-secondary-active dark:placeholder-primary-light dark:text-primary-light"
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
            <p className="w-10/12 text-xs dark:text-red-500">allowed annotation type is required!</p>
          )}
        </div>
        <div className="w-full mb-2 flex flex-col items-center">
          <label htmlFor="label-types" className="w-10/12 p-2 block mb-1 text-sm font-medium dark:text-primary-light">
            Label Types
          </label>
          <select
            multiple
            id="label-types"
            onChange={(e) => handleLabelTypesChange(e)}
            className="w-10/12 block rounded-lg p-2 text-sm border dark:border-primary-light dark:focus:ring-primary-light dark:focus:border-primary-light dark:bg-secondary-active dark:placeholder-primary-light dark:text-primary-light"
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
            <p className="w-10/12 text-xs dark:text-red-500">label types are required!</p>
          )}
        </div>
        <div className="w-full mb-2 flex flex-col items-center">
          <button
            type="submit"
            className="w-10/12 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Submit
          </button>
        </div>
      </form>
    </>
  );
};

export default CreateLabelForm;
