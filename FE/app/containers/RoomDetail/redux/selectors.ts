/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { ApplicationRootState } from 'types';
import { initialState } from './reducer';

const selectHome = (state: ApplicationRootState) => state.roomDetail || initialState;

const makeSelectUserListRoom = () =>
  createSelector(selectHome, substate => substate.roomDetail.userList);

export { selectHome, makeSelectUserListRoom };
