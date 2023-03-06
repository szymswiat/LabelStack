import React, { createContext, ReactNode, useContext, useState } from 'react';
import {
  AnnotationsObject,
  AnnotationReviewsObject,
  LabelsObject,
  LabelAssignmentsObject,
  ImageInstancesObject,
  Task,
  TaskStatus
} from '@labelstack/api';

export interface TaskObjects {
  taskImageInstances?: ImageInstancesObject;
  taskLabelAssignments?: LabelAssignmentsObject;
  taskAnnotations?: AnnotationsObject;
  taskReviews?: AnnotationReviewsObject;
}

interface UpdateTriggers {
  taskTrigger: number;
  taskObjectsTrigger: number;
}

export interface AnnotatorDataState {
  task: Task | null;
  taskObjects: TaskObjects;
  allLabels: LabelsObject | null;
  updateTriggers: UpdateTriggers;
  availableTaskStatuses: TaskStatus[] | null;
}

export interface AnnotatorDataApi {
  setTask: (task: Task) => void;
  setTaskImageInstances: (imageInstances: ImageInstancesObject) => void;
  setTaskLabelAssignments: (labelAssignments: LabelAssignmentsObject) => void;
  setTaskAnnotations: (annotations: AnnotationsObject) => void;
  setTaskReviews: (reviews: AnnotationReviewsObject) => void;
  setAllLabels: (labels: LabelsObject) => void;
  refreshTask: () => void;
  refreshTaskObjects: () => void;
  setAvailableTaskStatuses: (statuses: TaskStatus[]) => void;
}

export type AnnotatorDataContextType = [AnnotatorDataState, AnnotatorDataApi];

export const AnnotatorDataContext = createContext<AnnotatorDataContextType>(null);

export const useAnnotatorDataContext = () => useContext(AnnotatorDataContext);

export const AnnotatorDataContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [task, setTask] = useState<Task | null>(null);

  const [taskImageInstances, setTaskImageInstances] = useState<ImageInstancesObject | null>(null);
  const [taskLabelAssignments, setTaskLabelAssignments] = useState<LabelAssignmentsObject | null>(null);
  const [taskAnnotations, setTaskAnnotations] = useState<AnnotationsObject | null>(null);
  const [taskReviews, setTaskReviews] = useState<AnnotationReviewsObject | null>(null);

  const [allLabels, setAllLabels] = useState<LabelsObject>(null);

  const [taskTrigger, setTaskTrigger] = useState<number>(0);
  const [taskObjectsTrigger, setTaskObjectsTrigger] = useState<number>(0);
  const [availableTaskStatuses, setAvailableTaskStatuses] = useState<TaskStatus[] | null>(null);

  function refreshTask() {
    setTaskTrigger(Date.now());
  }

  function refreshTaskObjects() {
    setTaskObjectsTrigger(Date.now());
  }

  const state: AnnotatorDataState = {
    task,
    taskObjects: { taskImageInstances, taskLabelAssignments, taskAnnotations, taskReviews },
    allLabels,
    updateTriggers: { taskTrigger, taskObjectsTrigger },
    availableTaskStatuses
  };

  const api: AnnotatorDataApi = {
    setTask,
    setTaskImageInstances,
    setTaskLabelAssignments,
    setTaskAnnotations,
    setTaskReviews,
    setAllLabels,
    refreshTask,
    refreshTaskObjects,
    setAvailableTaskStatuses
  };

  return <AnnotatorDataContext.Provider value={[state, api]}>{children}</AnnotatorDataContext.Provider>;
};
