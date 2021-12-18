/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { ApplicationRootState } from 'types';
import { initialState } from './reducer';

const selectHome = (state: ApplicationRootState) => state.home || initialState;

const makeSelectRoomList = () =>
  createSelector(selectHome, substate => substate.roomList);

export { selectHome, makeSelectRoomList };
