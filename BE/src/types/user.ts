import { ResponseSuccess } from './api'

export interface User {
	id: string,
	name: string,
	room: string
}

export interface RegisterUserBody {
  name: string;
}

export type RegisterSuccess = ResponseSuccess<{
  user: User;
}>