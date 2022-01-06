export const PATH = {
  HOME: '/',
  ROOM_DETAIL: (id?: string) => `/room/${id || ':id'}`,
};
