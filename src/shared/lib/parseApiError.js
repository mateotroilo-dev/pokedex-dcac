import { UNKNOWN_ERROR_MESSAGE, UNKNOWN_ERROR_STATUS } from 'src/shared/lib/constants/errors.js';

const messageFromData = (data) => {
  if (typeof data === 'string') return data;
  if (typeof data?.message === 'string') return data.message;
  return UNKNOWN_ERROR_MESSAGE;
};

export const parseApiError = (error) => {
  if (typeof error?.status === 'number') {
    return { status: error.status, message: messageFromData(error.data) };
  }

  if (typeof error?.status === 'string') {
    return { status: error.status, message: error.error ?? UNKNOWN_ERROR_MESSAGE };
  }

  return { status: UNKNOWN_ERROR_STATUS, message: error?.message ?? UNKNOWN_ERROR_MESSAGE };
};
