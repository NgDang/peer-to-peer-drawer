/**
 * Gets the repositories of the user from Github
 */

import { put, takeLatest } from 'redux-saga/effects';
import {getAllRoomAsync, createRoomAsync, joinRoomAsync } from './actions'
import { createUserAsync } from 'containers/App/redux/actions'
import {openNotificationWithIcon} from 'utils/notification'

import request from 'utils/request';
import API_ENDPOINTS from 'utils/apiEndpoints';

export function* createUserSaga({ payload }) {
  const restApiHost = API_ENDPOINTS.CREATE_USER;
  try {
    const res = yield request(`${restApiHost}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
    });
    openNotificationWithIcon('success', 'Successfully')
    const user = res.data.user
    localStorage.setItem('user', JSON.stringify(user))
    yield put(createUserAsync.success(res.data));
  } catch (err) {
    const { status, error : { msg }} = err.resJson
    openNotificationWithIcon(status, 'Error', msg)
    yield put(createUserAsync.failure(err));
  }
}

export function* getAllRoomSaga() {
  const restApiHost = API_ENDPOINTS.GET_ALL_ROOM;
  try {
    const data = yield request(`${restApiHost}`);
    yield put(getAllRoomAsync.success(data));
  } catch (err) {
    const { status, error : { msg }} = err.resJson
    openNotificationWithIcon(status, 'Error', msg)
    yield put(getAllRoomAsync.failure(err));
  }
}

export function* createRoomSaga({ payload }) {
  const restApiHost = API_ENDPOINTS.CREATE_ROOM;
  try {
    const res = yield request(`${restApiHost}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
    });
    if (res?.status === 'success') {
      const data = yield request(`${API_ENDPOINTS.GET_ALL_ROOM}`);
      openNotificationWithIcon('success', 'Successfully')
      yield put(createRoomAsync.success(data));
    }
  } catch (err) {
    const { status, error : { msg }} = err.resJson
    openNotificationWithIcon(status, 'Error', msg)
    yield put(createRoomAsync.failure(err));
  }
}

export function* joinRoomSaga({ payload }) {

  const {roomId, data, cb} = payload;

  const restApiHost = API_ENDPOINTS.JOIN_ROOM(roomId);
  try {
    const res = yield request(`${restApiHost}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });
    if (res?.status === 'success') {
      cb(true)
    }
  } catch (err) {
    cb(false)
  }
}

export default function* mainSaga() {
  yield takeLatest(createUserAsync.request, createUserSaga);
  yield takeLatest(getAllRoomAsync.request, getAllRoomSaga);
  yield takeLatest(createRoomAsync.request, createRoomSaga);
  yield takeLatest(joinRoomAsync.request, joinRoomSaga);
}
