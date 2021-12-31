import { createReducer } from 'typesafe-actions';
import {
  getRoomAsync,
  leaveRoomAsync,
  updateDrawingDataAsync,
} from './actions';
import { ContainerState, ContainerActions } from '../types';

// The initial state of the App
export const initialState: ContainerState = {
  roomDetail: {
    code: '',
    id: '',
    name: '',
    owner: {
      id: '',
      name: '',
    },
    userList: [],
    drawingData: [],
  },
};

const reducer = createReducer(initialState).handleAction(
  getRoomAsync.success,
  (state: ContainerState, action: ContainerActions) => ({
    ...state,
    roomDetail: action.payload.room,
  }),
  leaveRoomAsync.success,
  (state: ContainerState, action: ContainerActions) => ({
    ...state,
    roomDetail: action.payload.room,
  }),
  updateDrawingDataAsync.success,
  (state: ContainerState, action: ContainerActions) => ({
    ...state,
    drawingData: action.payload.drawingData,
  }),
);

export default reducer;
