import { createAsyncAction } from 'typesafe-actions';

import ActionTypes from './constants';

export const getAllRoomAsync = createAsyncAction(
  `$${ActionTypes.GET_ALL_ROOM}_REQUEST`,
  `$${ActionTypes.GET_ALL_ROOM}_SUCCESS`,
  `$${ActionTypes.GET_ALL_ROOM}_FAILURE`,
)<undefined, any, any>();

export const createRoomAsync = createAsyncAction(
  `$${ActionTypes.CREATE_ROOM}_REQUEST`,
  `$${ActionTypes.CREATE_ROOM}_SUCCESS`,
  `$${ActionTypes.CREATE_ROOM}_FAILURE`,
)<any, any, any>();

export const joinRoomAsync = createAsyncAction(
  `$${ActionTypes.JOIN_ROOM}_REQUEST`,
  `$${ActionTypes.JOIN_ROOM}_SUCCESS`,
  `$${ActionTypes.JOIN_ROOM}_FAILURE`,
)<any, any, any>();
