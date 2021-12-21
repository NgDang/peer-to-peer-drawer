import { createReducer } from 'typesafe-actions';
import { getRoomAsync } from './actions';
import { ContainerState, ContainerActions } from '../types';

// The initial state of the App
export const initialState: ContainerState = {
  roomDetail: {
    code: '',
    id: '',
    name: '',
    owner: {
      id: '',
      name: ''
    },
    userList: []
  },
};

const reducer = createReducer(initialState)
  .handleAction(
    getRoomAsync.success,
    (state: ContainerState, action: ContainerActions) => ({
      ...state,
      roomDetail: action.payload.data.room,
    }),
  );

export default reducer;
