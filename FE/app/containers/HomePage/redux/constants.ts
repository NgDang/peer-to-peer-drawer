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
  GET_ALL_ROOM = 'boilerplate/Home/GET_ALL_ROOM',
  CREATE_ROOM = 'boilerplate/Home/CREATE_ROOM',
  JOIN_ROOM = 'boilerplate/Home/JOIN_ROOM',
}

export default ActionTypes;
