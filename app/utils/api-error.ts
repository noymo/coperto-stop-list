interface IApiErrorData {
  statusMessage?: string
  message?: string
}

interface IApiError {
  data?: IApiErrorData
}

export function getApiErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'data' in error) {
    const data = (error as IApiError).data

    if (data?.statusMessage) {
      return data.statusMessage
    }

    if (data?.message) {
      return data.message
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Произошла неизвестная ошибка'
}
