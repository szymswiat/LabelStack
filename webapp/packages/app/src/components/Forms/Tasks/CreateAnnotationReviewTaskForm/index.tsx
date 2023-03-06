import React from 'react';
import { useState } from 'react';
import axios, { AxiosError } from 'axios';

import { GridApi } from 'ag-grid-community';
import { useUserDataContext } from '../../../../contexts/UserDataContext';
import {
  IUserProfile,
  api,
  Task,
  TaskStatus,
  TaskType,
  requestErrorMessageKey,
  Annotation,
  taskPriorityRepresentation
} from '@labelstack/api';
import Divider from '../../../Divider';
import { showDangerNotification, showSuccessNotification } from '../../../../utils';

interface CreateAnnotationReviewTaskFormParams {
  annotators: IUserProfile[];
  selectedAnnotations: Annotation[];

  gridApi: GridApi;
  reloadAnnotations: () => void;
}

const CreateAnnotationReviewTaskForm = ({
  annotators,
  selectedAnnotations,
  gridApi,
  reloadAnnotations
}: CreateAnnotationReviewTaskFormParams) => {
  const [{ token }] = useUserDataContext();
  const [taskName, setTaskName] = useState<string>('');
  const [taskNameValid, setTaskNameValid] = useState<boolean>(undefined);
  const [annotatorId, setAnnotatorId] = useState<number>(undefined);
  const [priority, setPriority] = useState<number>(undefined);
  const [priorityValid, setPriorityValid] = useState<boolean>(undefined);
  const [description, setDescription] = useState<string>('');

  const createTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isFormValid()) {
      const newTask: Task = {
        assigned_user_id: annotatorId,
        status: annotatorId ? TaskStatus.open : TaskStatus.unassigned,
        total_time: 0,
        task_type: TaskType.annotationReview,
        name: taskName,
        description: description,
        priority: priority,
        image_instance_ids: [],
        label_assignment_ids: [],
        annotation_ids: selectedAnnotations.map((annotation) => annotation.id)
      };

      api
        .createTask(token, newTask)
        .then((_) => {
          const form = e.target as HTMLFormElement;
          form.reset();
          clearForm();
          showSuccessNotification(undefined, 'Task created successfully!');
          reloadAnnotations();
          if (gridApi) gridApi.deselectAll();
        })
        .catch((error) => {
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
    setTaskName('');
    setTaskNameValid(undefined);
    setAnnotatorId(undefined);
    setPriority(undefined);
    setPriorityValid(undefined);
    setDescription('');
  };

  const isFormValid = () => {
    if (taskName === undefined || taskName === '') {
      setTaskNameValid(false);
      showDangerNotification(undefined, 'Task name is required!');
      return false;
    } else if (priority === undefined || priority < 0) {
      setPriorityValid(false);
      showDangerNotification(undefined, 'Priority is required!');
      return false;
    } else if (selectedAnnotations === undefined || selectedAnnotations.length <= 0) {
      showDangerNotification(undefined, 'You have to choose at least one annotation!');
      return false;
    }
    return true;
  };

  const handleTaskNameChange = (e) => {
    if (e && e.target && e.target.value) {
      const taskNameValue = e.target.value;
      setTaskName(taskNameValue);
      setTaskNameValid(true);
    } else {
      setTaskName('');
      setTaskNameValid(false);
    }
  };

  const handleAnnotatorChange = (e) => {
    if (e && e.target && e.target.value) {
      const annotatorIdValue = Number(e.target.value);
      if (typeof annotatorIdValue === 'number') {
        setAnnotatorId(annotatorIdValue);
      } else {
        setAnnotatorId(undefined);
      }
    }
  };

  const handlePriorityChange = (e) => {
    if (e && e.target && e.target.value) {
      const priorityValue = Number(e.target.value);
      if (typeof priorityValue === 'number') {
        setPriority(priorityValue);
        setPriorityValid(true);
      } else {
        setPriority(undefined);
        setPriorityValid(false);
      }
    }
  };

  const handleDescriptionChange = (e) => {
    if (e && e.target && e.target.value) {
      const descriptionValue = e.target.value;
      setDescription(descriptionValue);
    } else {
      setDescription('');
    }
  };

  return (
    <>
      <p className="w-full p-4 text-center text-xl font-bold dark:text-primary-light">Create Task</p>
      <Divider />
      <form className="w-full" onSubmit={createTask}>
        <div className="w-full mb-2 flex flex-col items-center">
          <label htmlFor="task-name" className="w-10/12 p-2 block mb-1 text-sm font-medium dark:text-primary-light">
            Task Name
          </label>
          <input
            type="text"
            id="task-name"
            value={taskName}
            onChange={(e) => handleTaskNameChange(e)}
            className="w-10/12 block rounded-lg p-2 text-sm border dark:border-primary-light dark:focus:ring-primary-light dark:focus:border-primary-light dark:bg-secondary-active dark:placeholder-primary-light dark:text-primary-light"
          />
          {taskNameValid === false && <p className="w-10/12 text-xs dark:text-red-500">task name is required!</p>}
        </div>
        <div className="w-full mb-2 flex flex-col items-center">
          <label htmlFor="annotator" className="w-10/12 p-2 block mb-1 text-sm font-medium dark:text-primary-light">
            Annotator
          </label>
          <select
            id="annotator"
            onChange={(e) => handleAnnotatorChange(e)}
            className="w-10/12 block rounded-lg p-2 text-sm border dark:border-primary-light dark:focus:ring-primary-light dark:focus:border-primary-light dark:bg-secondary-active dark:placeholder-primary-light dark:text-primary-light"
          >
            <option hidden value={undefined} key="annotator_none">
              ---
            </option>
            {annotators.map((annotator) => (
              <option value={annotator.id} key={'annotator_' + annotator.id}>
                {annotator.email}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full mb-2 flex flex-col items-center">
          <label htmlFor="priority" className="w-10/12 p-2 block mb-1 text-sm font-medium dark:text-primary-light">
            Priority
          </label>
          <select
            id="priority"
            onChange={(e) => handlePriorityChange(e)}
            className="w-10/12 block rounded-lg p-2 text-sm border dark:border-primary-light dark:focus:ring-primary-light dark:focus:border-primary-light dark:bg-secondary-active dark:placeholder-primary-light dark:text-primary-light"
          >
            <option hidden value={undefined} key="priority_none">
              ---
            </option>
            {Object.entries(taskPriorityRepresentation).map(([key, value]) => (
              <option value={key} key={key}>
                {value}
              </option>
            ))}
          </select>
          {priorityValid === false && <p className="w-10/12 text-xs dark:text-red-500">priority is required!</p>}
        </div>
        <div className="w-full mb-4 flex flex-col items-center">
          <label htmlFor="description" className="w-10/12 p-2 block mb-1 text-sm font-medium dark:text-primary-light">
            Description
          </label>
          <textarea
            id="description"
            onChange={(e) => handleDescriptionChange(e)}
            className="w-10/12 block rounded-lg p-2 text-sm border dark:border-primary-light dark:focus:ring-primary-light dark:focus:border-primary-light dark:bg-secondary-active dark:placeholder-primary-light dark:text-primary-light"
          />
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
      <Divider />
    </>
  );
};

export default CreateAnnotationReviewTaskForm;
