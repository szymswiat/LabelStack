import React from 'react';
import { useState } from 'react';

import { User, taskPriorityRepresentation } from '@labelstack/api';
import Divider from '../../../Divider';
import { showDangerNotification } from '../../../../utils';

export interface CreateTaskFunctionParams {
  e: React.FormEvent<HTMLFormElement>;
  annotatorId: number;
  taskName: string;
  description: string;
  priority: number;
  isGenericFormValid: () => boolean;
  clearForm: () => void;
}

export type CreateTaskFunction = (params: CreateTaskFunctionParams) => void;

export interface CreateTaskFormProps {
  annotators: User[];
  createTask: CreateTaskFunction;
}

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({ annotators, createTask }) => {
  const [taskName, setTaskName] = useState<string>('');
  const [taskNameValid, setTaskNameValid] = useState<boolean>(undefined);
  const [annotatorId, setAnnotatorId] = useState<number>(undefined);
  const [priority, setPriority] = useState<number>(undefined);
  const [priorityValid, setPriorityValid] = useState<boolean>(undefined);
  const [description, setDescription] = useState<string>('');

  const clearForm = () => {
    setTaskName('');
    setTaskNameValid(undefined);
    setAnnotatorId(undefined);
    setPriority(undefined);
    setPriorityValid(undefined);
    setDescription('');
  };

  const isGenericFormValid = () => {
    if (taskName === undefined || taskName === '') {
      setTaskNameValid(false);
      showDangerNotification(undefined, 'Task name is required!');
      return false;
    } else if (priority === undefined || priority < 0) {
      setPriorityValid(false);
      showDangerNotification(undefined, 'Priority is required!');
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
      <p className="w-full py-4 mt-2 text-center text-xl font-bold">Create Task</p>
      <Divider />
      <form
        className="w-full text-sm font-medium px-6 flex flex-col gap-y-2"
        onSubmit={(e) => createTask({ e, annotatorId, taskName, description, priority, isGenericFormValid, clearForm })}
      >
        <div className="w-full flex flex-col items-center">
          <label htmlFor="task-name" className="w-full py-1 pb-2 ml-2">
            Task Name
          </label>
          <input
            type="text"
            id="task-name"
            value={taskName}
            onChange={(e) => handleTaskNameChange(e)}
            className="w-full block rounded-lg p-2 text-sm border bg-dark-bg"
          />
          {taskNameValid === false && (
            <p className="w-full mt-1 mr-3 text-xs text-right dark:text-red-500">Task name is required!</p>
          )}
        </div>
        <div className="w-full flex flex-col items-center">
          <label htmlFor="annotator" className="w-full py-1 pb-2 ml-2">
            Annotator
          </label>
          <select
            id="annotator"
            onChange={(e) => handleAnnotatorChange(e)}
            className="w-full block rounded-lg h-8 px-2 text-sm border bg-dark-bg"
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
        <div className="w-full flex flex-col items-center">
          <label htmlFor="priority" className="w-full py-1 pb-2 ml-2">
            Priority
          </label>
          <select
            id="priority"
            onChange={(e) => handlePriorityChange(e)}
            className="w-full block rounded-lg p-2 text-sm border bg-dark-bg"
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
          {priorityValid === false && (
            <p className="w-full mt-1 mr-3 text-xs text-right dark:text-red-500">Priority is required!</p>
          )}
        </div>
        <div className="w-full flex flex-col items-center">
          <label htmlFor="description" className="w-full py-1 pb-2 ml-2 text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            onChange={(e) => handleDescriptionChange(e)}
            className="w-full block rounded-lg p-2 text-sm border bg-dark-bg"
          />
        </div>
        <div className="w-full px-8 flex my-3">
          <button type="submit" className="w-full bg-dark-bg h-8 rounded-lg text-sm font-medium">
            Submit
          </button>
        </div>
      </form>
      <Divider />
    </>
  );
};

export default CreateTaskForm;
