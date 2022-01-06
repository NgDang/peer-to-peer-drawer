import { Request, Response } from 'express';

export type ApiRequest<T, P = {}> = Request<P, {}, T>;
export type ApiResponse<S> = Response<S> & Response<ResponseFailed>;


export interface ResponseSuccess<T> {
  status: 'success';
  data: any;
}

export interface ResponseFailed {
  status: 'error';
  error: {
    code: number;
    msg: string;
  };
}
