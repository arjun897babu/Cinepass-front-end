import { AxiosError } from "axios";
import { ResponseData } from "../interface/Interface";

export interface ErrorResponse extends ResponseData {
  data?: { [key: string]: string } | undefined
}

export function isErrorResponse(error: unknown): error is ErrorResponse {

  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    'message' in error
  );

};


export class UploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UploadError';
  }
}

export interface IResponseError {
  statusCode: number,
  data: {
    error: string,
    message: string,
    tempMail?:{email:string}
  },
}

export function isResponseError(error: unknown): error is IResponseError {
  return (
    typeof error === 'object' &&
    error != null &&
    'statusCode' in error && typeof error.statusCode === 'number' &&
    'data' in error
  )
}

export function handleAxiosError(error: unknown): IResponseError {
 
  if (error instanceof AxiosError) {
    const { response } = error
    if (response) {
      return {
        statusCode: response.status,
        data: response.data.error
      } as IResponseError
    }
  }

  return {
    statusCode: 500,
    data: {
      error: 'unknown_error',
      message: 'something went wrong',
    },
  } as IResponseError;

}

