import { ActionType } from 'typesafe-actions';
import * as actions from './redux/actions';

/* --- STATE --- */

interface HomeState {
  readonly roomList: Array<any>;
}

interface RoomState {
  userId: string;
  name: string;
}

interface Error {
  resJson: {
    status: string,
    error: {
      msg : string
    }
  }
}

/* --- ACTIONS --- */
type AppActions = ActionType<typeof actions>;

/* --- EXPORTS --- */

type ContainerState = HomeState;
type ContainerActions = AppActions;


export { ContainerState, ContainerActions, RoomState, Error };
