const BASE_API_URL = 'http://localhost:8000/api/';

export default {
  GET_ALL_ROOM: `${BASE_API_URL}room`,
  GET_ROOM: (roomId) => `${BASE_API_URL}room/${roomId}`,
  JOIN_ROOM: (roomId) => `${BASE_API_URL}room/join/${roomId}`,
  CREATE_ROOM: `${BASE_API_URL}room/create`,
  CREATE_USER: `${BASE_API_URL}user/create`,
};
