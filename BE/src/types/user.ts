import { ResponseSuccess } from './api'

export interface User {
	id: string,
	name: string,
  room?: string | undefined
  isCalled?: boolean | undefined
}

export interface RegisterUserBody {
  name: string;
}

export type RegisterSuccess = ResponseSuccess<{
  user: User;
}>