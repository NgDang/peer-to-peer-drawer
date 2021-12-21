import { createAsyncAction } from 'typesafe-actions';

import ActionTypes from './constants';

export const getRoomAsync = createAsyncAction(
  `$${ActionTypes.GET_ROOM}_REQUEST`,
  `$${ActionTypes.GET_ROOM}_SUCCESS`,
  `$${ActionTypes.GET_ROOM}_FAILURE`,
)<any, any, any>();
