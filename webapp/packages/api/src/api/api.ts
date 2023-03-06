import axios from 'axios';
import { IUserProfile, IUserProfileCreate, IUserProfileUpdate } from '../schemas/user';
import { Dicom } from '../schemas/dicom';
import { Label, LabelCreateApiIn, LabelType } from '../schemas/label';
import { ImageInstance } from '../schemas/imageInstance';
import { AvailableStatusesForTaskApiOut, Task } from '../schemas/task';
import { Annotation, AnnotationType } from '../schemas/annotation';
import { LabelAssignment, LabelAssignmentsModifyApiIn } from '../schemas/labelAssignment';

import { api as dicomWebApi } from 'dicomweb-client';
import { AnnotationReview, AnnotationReviewResult } from '../schemas/annotationReview';

if (!['prod', 'dev'].includes(process.env.ENV)) {
  throw Error(`Invalid value of ENV var: ${process.env.ENV}`);
}

const protocol = process.env.ENV === 'prod' ? 'https' : 'http';
export const apiUrl = `${protocol}://${process.env.API_HOST_ORIGIN}`;
export const apiV1 = '/api/v1';

export const requestErrorMessageKey = 'detail';

const wadoClient = new dicomWebApi.DICOMwebClient({ url: `${apiUrl}${apiV1}/dicoms/wado` });

function authHeaders(token: string) {
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
}

export const api = {
  async logInGetToken(username: string, password: string) {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);

    return axios.post(`${apiUrl}${apiV1}/login/access-token`, params);
  },
  async getMe(token: string) {
    return axios.get<IUserProfile>(`${apiUrl}${apiV1}/users/me`, authHeaders(token));
  },
  async updateMe(token: string, data: IUserProfileUpdate) {
    return axios.put<IUserProfile>(`${apiUrl}${apiV1}/users/me`, data, authHeaders(token));
  },
  async getUsers(token: string) {
    return axios.get<IUserProfile[]>(`${apiUrl}${apiV1}/users/`, authHeaders(token));
  },
  async updateUser(token: string, userId: number, data: IUserProfileUpdate) {
    return axios.put(`${apiUrl}${apiV1}/users/${userId}`, data, authHeaders(token));
  },
  async createUser(token: string, data: IUserProfileCreate) {
    return axios.post(`${apiUrl}${apiV1}/users/`, data, authHeaders(token));
  },
  async passwordRecovery(email: string) {
    return axios.post(`${apiUrl}${apiV1}/password-recovery/${email}`);
  },

  async getDicomsForImageInstance(token: string, imageInstanceId: number, taskId?: number) {
    const params: any = {};
    if (taskId != null) {
      params['task_id'] = taskId;
    }

    return axios.get<Dicom[]>(`${apiUrl}${apiV1}/dicoms/for_image_instance/${imageInstanceId}`, {
      ...authHeaders(token),
      params
    });
  },

  async getDicomDataWado(
    token: string,
    dicom: Dicom,
    progressCallback?: dicomWebApi.ProgressCallback
  ): Promise<ArrayBuffer> {
    wadoClient.headers = { ...wadoClient.headers, ...authHeaders(token).headers };

    const url = `${wadoClient.wadoURL}/studies/${dicom.study_id}/series/${dicom.series_id}/instances/${dicom.instance_id}`;

    return (await wadoClient._httpGetMultipartApplicationDicom(url, null, null, progressCallback))[0];
  },

  async getImageInstances(token: string, waitingForLabels = false, withoutActiveTask = false, byIds?: number[]) {
    return axios.get<ImageInstance[]>(`${apiUrl}${apiV1}/image_instances/`, {
      ...authHeaders(token),
      params: {
        waiting_for_labels: waitingForLabels,
        without_active_task: withoutActiveTask,
        by_ids: byIds?.join(',')
      }
    });
  },

  async getImageInstancesForTask(token: string, taskId: number) {
    return axios.get<ImageInstance[]>(`${apiUrl}${apiV1}/image_instances/for_task/${taskId}`, {
      ...authHeaders(token)
    });
  },

  async getLabels(token: string) {
    return axios.get<Label[]>(`${apiUrl}${apiV1}/labels/`, authHeaders(token));
  },

  async createLabel(token: string, data: LabelCreateApiIn) {
    return axios.post(`${apiUrl}${apiV1}/labels/`, data, authHeaders(token));
  },

  async getLabelTypes(token: string) {
    return axios.get<LabelType[]>(`${apiUrl}${apiV1}/label_types/`, authHeaders(token));
  },

  async getAnnotationTypes(token: string) {
    return axios.get<AnnotationType[]>(`${apiUrl}${apiV1}/annotation_types/`, authHeaders(token));
  },

  async getLabelAssignments(token: string, waitingForAnnotations = false, withoutActiveTask = false) {
    return axios.get<LabelAssignment[]>(`${apiUrl}${apiV1}/label_assignments/`, {
      ...authHeaders(token),
      params: {
        waiting_for_annotations: waitingForAnnotations,
        without_active_task: withoutActiveTask
      }
    });
  },

  async modifyLabelAssignments(
    token: string,
    labelIdsToCreate: number[],
    labelIdsToRemove: number[],
    imageInstance: ImageInstance,
    task: Task
  ) {
    const labelAssignmentsIn: LabelAssignmentsModifyApiIn = {
      label_ids_to_create: labelIdsToCreate,
      label_ids_to_remove: labelIdsToRemove,
      image_instance_id: imageInstance.id,
      parent_task_id: task.id
    };
    return axios.post(`${apiUrl}${apiV1}/label_assignments/for_image_instance`, labelAssignmentsIn, authHeaders(token));
  },

  async getAnnotations(
    token: string,
    byId?: number,
    byTaskId?: number,
    waitingForReview = false,
    withoutActiveTask = false,
    requiredAcceptedReviews?: number
  ) {
    let params: object = {
      waiting_for_review: waitingForReview,
      without_active_task: withoutActiveTask
    };
    if (byId != undefined) {
      params = { ...params, by_id: byId };
    }
    if (byTaskId != undefined) {
      params = { ...params, by_task_id: byTaskId };
    }
    if (requiredAcceptedReviews != undefined) {
      params = { ...params, required_accepted_reviews: requiredAcceptedReviews };
    }

    return axios.get<Annotation[]>(`${apiUrl}${apiV1}/annotations/`, {
      ...authHeaders(token),
      params: params
    });
  },

  async createAnnotationData(token: string, annotation: Annotation, data: ArrayBuffer) {
    const { headers } = authHeaders(token);
    const formData = new FormData();
    formData.append('annotation_data', new Blob([data]));

    return axios.post(`${apiUrl}${apiV1}/annotation_data/${annotation.id}`, formData, {
      headers: { ...headers, 'Content-Type': 'multipart/form-data' }
    });
  },

  async readAnnotationData(token: string, annotation: Annotation, sequence?: number, taskId?: number) {
    if (sequence == undefined) {
      sequence = annotation.data_list.at(-1).sequence;
    }

    return axios.get<ArrayBuffer>(`${apiUrl}${apiV1}/annotation_data/`, {
      ...authHeaders(token),
      params: { annotation_id: annotation.id, sequence, task_id: taskId },
      responseType: 'arraybuffer'
    });
  },

  async readAnnotationReviews(token: string, task: Task) {
    return axios.get<AnnotationReview[]>(`${apiUrl}${apiV1}/annotation_reviews/`, {
      ...authHeaders(token),
      params: { by_task_id: task.id }
    });
  },

  async updateAnnotationReview(
    token: string,
    review: AnnotationReview,
    result?: AnnotationReviewResult,
    comment?: string
  ) {
    const updateObject: any = {};
    if (result) {
      updateObject['result'] = result;
    }
    if (comment) {
      updateObject['comment'] = comment;
    }

    return axios.put(`${apiUrl}${apiV1}/annotation_reviews/${review.id}`, updateObject, authHeaders(token));
  },

  async getTasks(token: string, id?: number, taskStatus?: number, taskType?: number, forMe = true, forUserId?: number) {
    let params: object = {
      for_me: forMe
    };
    if (id) {
      params = { ...params, id: id };
    } else {
      if (taskStatus != undefined) {
        params = { ...params, task_status: taskStatus };
      }
      if (taskType != undefined) {
        params = { ...params, task_type: taskType };
      }
      if (forUserId != undefined) {
        params = { ...params, for_user_id: forUserId };
      }
    }

    return axios.get<Task[]>(`${apiUrl}${apiV1}/tasks/`, {
      ...authHeaders(token),
      params
    });
  },

  async createTask(token: string, data: Task) {
    if (data.assigned_user_id == undefined) {
      delete data.assigned_user_id;
    }

    return axios.post(`${apiUrl}${apiV1}/tasks/`, data, authHeaders(token));
  },

  async getAvailableStatusesForTask(token: string, task: Task) {
    return axios.get<AvailableStatusesForTaskApiOut>(
      `${apiUrl}${apiV1}/tasks/get_available_statuses/${task.id}`,
      authHeaders(token)
    );
  },

  async changeTaskStatus(token: string, taskId: number, newStatus: number) {
    return axios.post(`${apiUrl}${apiV1}/tasks/change_status/${taskId}`, null, {
      ...authHeaders(token),
      params: { new_status: newStatus }
    });
  },

  async changeTaskOwner(token: string, taskId: number, newOwnerId: number) {
    return axios.post(`${apiUrl}${apiV1}/tasks/change_owner/${taskId}`, null, {
      ...authHeaders(token),
      params: { new_owner_id: newOwnerId }
    });
  }
};
