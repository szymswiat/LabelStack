import { isUserLoggedIn } from './user';
import {
  showDangerNotification,
  showInfoNotification,
  showSuccessNotification,
  showWarningNotification,
  showNotificationWithApiError
} from './notifications';

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeStr(str: string) {
  return str.normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

export {
  delay,
  normalizeStr,
  isUserLoggedIn,
  showSuccessNotification,
  showInfoNotification,
  showWarningNotification,
  showDangerNotification,
  showNotificationWithApiError
};
