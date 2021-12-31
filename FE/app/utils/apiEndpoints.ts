const BASE_API_URL = 'http://192.168.0.11:8000/api/';

export default {
  GET_ALL_ROOM: `${BASE_API_URL}room`,
  GET_ROOM: roomId => `${BASE_API_URL}room/${roomId}`,
  JOIN_ROOM: roomId => `${BASE_API_URL}room/join/${roomId}`,
  LEAVE_ROOM: roomId => `${BASE_API_URL}room/leave/${roomId}`,
  UPDATE_DRAWING_DATA: roomId => `${BASE_API_URL}room/drawing/${roomId}`,
  CREATE_ROOM: `${BASE_API_URL}room/create`,
  CREATE_USER: `${BASE_API_URL}user/create`,
};
