import { requestErrorMessageKey } from '@labelstack/api';
import axios, { AxiosError } from 'axios';
import { iNotification, Store } from 'react-notifications-component';

const notificationProps: iNotification = {
  insert: 'bottom',
  container: 'bottom-right',
  dismiss: {
    duration: 5000
  }
};

export function showSuccessNotification(title: string = 'SUCCESS', message: string) {
  Store.addNotification({
    title,
    type: 'success',
    message,
    ...notificationProps
  });
}

export function showInfoNotification(title: string = 'INFO', message: string) {
  Store.addNotification({
    title,
    type: 'info',
    message,
    ...notificationProps
  });
}

export function showWarningNotification(title: string = 'WARNING', message: string) {
  Store.addNotification({
    title,
    type: 'warning',
    message,
    ...notificationProps
  });
}

export function showDangerNotification(title: string = 'ERROR', message: string) {
  Store.addNotification({
    title,
    type: 'danger',
    message,
    ...notificationProps
  });
}

export function showNotificationWithApiError(error: any) {
  let errorMessage = 'Unknown Error';
  if (axios.isAxiosError(error)) {
    const axiosError: AxiosError = error;
    errorMessage = axiosError.response.data[requestErrorMessageKey];
  }

  showDangerNotification(undefined, errorMessage);
}
