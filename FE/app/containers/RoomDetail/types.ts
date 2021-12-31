import { ActionType } from 'typesafe-actions';
import * as actions from './redux/actions';

/* --- STATE --- */

type User = {
  id: string,
  name: string,
}

type Point = {
  x: Number,
  y: Number
}

interface RefVideo {
  current: {
    srcObject: MediaStream | null,
    getTracks: () => void
  }
}

interface DrawingDataItem {
	pointOne: Point,
	pointTwo: Point,
	userId : string
}


interface CommonState {
  readonly roomDetail: {
    code: string,
    id: string,
    name: string,
    owner:User,
    userList: [],
    drawingData?: Array<DrawingDataItem> | undefined
  };
}

/* --- ACTIONS --- */
type AppActions = ActionType<typeof actions>;

/* --- EXPORTS --- */

type ContainerState = CommonState;
type ContainerActions = AppActions;

export { ContainerState, ContainerActions, RefVideo };
