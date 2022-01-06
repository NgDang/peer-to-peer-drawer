/**
 * The global state selectors
 */

import { createSelector } from 'reselect';
import { ApplicationRootState } from 'types';

const selectGlobal = (state: ApplicationRootState) => state.global;

const makeSelectCurrentUser = () =>
  createSelector(selectGlobal, globalState => globalState.currentUser);

export { selectGlobal, makeSelectCurrentUser };
