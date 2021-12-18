/**
 * Gets the repositories of the user from Github
 */

import { put, takeLatest } from 'redux-saga/effects';
import {getAllRoomAsync, createRoomAsync } from './actions'

import request from 'utils/request';
import API_ENDPOINTS from 'utils/apiEndpoints';

export function* getAllRoomSaga() {
  const restApiHost = API_ENDPOINTS.GET_ALL_ROOM;
  try {
    const data = yield request(`${restApiHost}`);
    yield put(getAllRoomAsync.success(data));
  } catch (err) {
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
      yield put(createRoomAsync.success(data));
    }
  } catch (err) {
    yield put(createRoomAsync.failure(err));
  }
}

export default function* mainSaga() {
  yield takeLatest(getAllRoomAsync.request, getAllRoomSaga);
  yield takeLatest(createRoomAsync.request, createRoomSaga);
}
