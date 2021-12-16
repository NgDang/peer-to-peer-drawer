import UserModel from '../models/UserManager/User';
import { ResponseSuccess } from './api'

export interface User {
	id: string,
	name: string,
	room: string
}


export interface Point {
	x: Number,
	y: Number
}

export interface DrawingDataItem {
	pointOne: Point,
	pointTwo: Point,
	user : User
}

export interface Room {
	id: string | undefined,
	code?: number | undefined,
	name: string | undefined,
	owner: UserModel | undefined,
	userList?: Array<UserModel> | undefined,
	drawingData?: Array<DrawingDataItem> | undefined
}

export type ApiGetRoomsResponse = ResponseSuccess<{
  roomList: Room[],
}>;

export interface ApiCreateRoomBody {
  name: string;
  userId: string;
}

export interface ApiJoinRoomBody {
	code: number;
  userId: string;
}

export interface ApiLeaveRoomBody {
	userId: string
}

export interface ApiDrawingBody {
	userId: string,
	drawingDataItem?: DrawingDataItem
}

export type ApiCreateRoomSuccess = ResponseSuccess<{ accessCode: number }>;

export type ApiJoinRoomSuccess = ResponseSuccess<{
  userList: UserModel[] | [];
  drawingData: Array<DrawingDataItem>
}>;

export type ApiLeftRoomSuccess = ResponseSuccess<{
  data: null;
}>;

export type  ApiDrawingSuccess = ResponseSuccess<{
	userId: string,
	drawingData?: Array<DrawingDataItem>
}>
