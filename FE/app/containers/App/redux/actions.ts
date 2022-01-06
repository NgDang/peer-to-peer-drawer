import { createAsyncAction } from 'typesafe-actions';

import ActionTypes from './constants';

export const createUserAsync = createAsyncAction(
  `$${ActionTypes.CREATE_USER}_REQUEST`,
  `$${ActionTypes.CREATE_USER}_SUCCESS`,
  `$${ActionTypes.CREATE_USER}_FAILURE`,
)<any, any, any>();
