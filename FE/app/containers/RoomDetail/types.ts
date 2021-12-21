import { ActionType } from 'typesafe-actions';
import * as actions from './redux/actions';

/* --- STATE --- */

type User = {
  id: string,
  name: string,
}
interface CommonState {
  readonly roomDetail: {
    code: string,
    id: string,
    name: string,
    owner:User,
    userList: []
  };
}

/* --- ACTIONS --- */
type AppActions = ActionType<typeof actions>;

/* --- EXPORTS --- */

type ContainerState = CommonState;
type ContainerActions = AppActions;

export { ContainerState, ContainerActions };
