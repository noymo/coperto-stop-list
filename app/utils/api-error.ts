interface ApiErrorData {
  statusMessage?: string;
  message?: string;
}

interface ApiError {
  data?: ApiErrorData;
}

export function getApiErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'data' in error) {
    const data = (error as ApiError).data;

    if (data?.statusMessage) {
      return data.statusMessage;
    }

    if (data?.message) {
      return data.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Произошла неизвестная ошибка';
}
