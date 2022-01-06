import { createReducer } from 'typesafe-actions';
import { getAllRoomAsync, createRoomAsync } from './actions';
import { ContainerState, ContainerActions } from '../types';

// The initial state of the App
export const initialState: ContainerState = {
  roomList: [],
};

const homeReducer = createReducer(initialState)
  .handleAction(
    getAllRoomAsync.success,
    (state: ContainerState, action: ContainerActions) => ({
      ...state,
      roomList: action.payload.data.roomList,
    }),
  )
  .handleAction(
    createRoomAsync.success,
    (state: ContainerState, action: ContainerActions) => ({
      ...state,
      roomList: action.payload.data.roomList,
    }),
  );

export default homeReducer;
