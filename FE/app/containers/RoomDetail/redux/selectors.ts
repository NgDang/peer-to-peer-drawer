/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { ApplicationRootState } from 'types';
import { initialState } from './reducer';

const selectHome = (state: ApplicationRootState) =>
  state.roomDetail || initialState;

const makeSelectRoom = () =>
  createSelector(selectHome, substate => substate.roomDetail);

export { selectHome, makeSelectRoom };
