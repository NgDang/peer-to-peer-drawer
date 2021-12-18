import { ActionType } from 'typesafe-actions';
import * as actions from './redux/actions';

/* --- STATE --- */

interface HomeState {
  readonly username: string;
}

/* --- ACTIONS --- */
type AppActions = ActionType<typeof actions>;

/* --- EXPORTS --- */

type ContainerState = HomeState;
type ContainerActions = AppActions;

export { ContainerState, ContainerActions };
