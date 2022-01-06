/*
 * HomeConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

enum ActionTypes {
  GET_ROOM = 'boilerplate/roomDetail/GET_ROOM',
  UPDATE_DRAWING_DATA = 'boilerplate/roomDetail/UPDATE_DRAWING_DATA',
  LEAVE_ROOM = 'boilerplate/roomDetail/LEAVE_ROOM',
  USER_ACCEPT_CALL = 'boilerplate/roomDetail/USER_ACCEPT_CALL',
}

export default ActionTypes;
