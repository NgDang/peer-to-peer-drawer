import { ActionType } from 'typesafe-actions';
import * as actions from './redux/actions';

/* --- STATE --- */

type UserType = {
  id: string;
  name: string;
};

interface AppState {
  readonly currentUser: UserType;
}

/* --- ACTIONS --- */
type AppActions = ActionType<typeof actions>;

/* --- EXPORTS --- */

type ContainerState = AppState;
type ContainerActions = AppActions;

export { ContainerState, ContainerActions, UserType };
