import { API } from '../utils/interceptors';

// Services

const createUser

const getJoinLink = (id?: number) => {
	return API.get(`/join`);
};

// export all service here
export const homeService = {
	getJoinLink
};
