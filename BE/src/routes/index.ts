import room from './room';
import user from './user';

export default [
  {
    path: 'room/',
    router: room,
  },
  {
    path: 'user/',
    router: user,
  }
]