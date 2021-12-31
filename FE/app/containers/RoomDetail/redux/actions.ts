import { createAsyncAction } from 'typesafe-actions';

import ActionTypes from './constants';

export const getRoomAsync = createAsyncAction(
  `$${ActionTypes.GET_ROOM}_REQUEST`,
  `$${ActionTypes.GET_ROOM}_SUCCESS`,
  `$${ActionTypes.GET_ROOM}_FAILURE`,
)<any, any, any>();

export const leaveRoomAsync = createAsyncAction(
  `$${ActionTypes.LEAVE_ROOM}_REQUEST`,
  `$${ActionTypes.LEAVE_ROOM}_SUCCESS`,
  `$${ActionTypes.LEAVE_ROOM}_FAILURE`,
)<any, any, any>();

export const updateDrawingDataAsync = createAsyncAction(
  `$${ActionTypes.UPDATE_DRAWING_DATA}_REQUEST`,
  `$${ActionTypes.UPDATE_DRAWING_DATA}_SUCCESS`,
  `$${ActionTypes.UPDATE_DRAWING_DATA}_FAILURE`,
)<any, any, any>();
