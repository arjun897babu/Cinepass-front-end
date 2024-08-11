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
      message: string
     
  }
}

export function isReponseError(error: unknown): error is IResponseError {
  return (
    typeof error === 'object' &&
    error != null &&
    'statusCode' in error && typeof error.statusCode === 'number' &&
    'data' in error
  )
}



