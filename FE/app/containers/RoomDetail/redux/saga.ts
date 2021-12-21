/**
 * Gets the repositories of the user from Github
 */

import { put, takeLatest } from 'redux-saga/effects';
import {getRoomAsync } from './actions'
import {openNotificationWithIcon} from 'utils/notification'

import request from 'utils/request';
import API_ENDPOINTS from 'utils/apiEndpoints';


export function* getRoomSaga({ payload }) {
  const {roomId } = payload
  const restApiHost = API_ENDPOINTS.GET_ROOM(roomId);
  try {
    const res = yield request(`${restApiHost}`);
    console.log({data : res.data})
    yield put(getRoomAsync.success(res.data));
  } catch (err) {
    const { status, error : { msg }} = err.resJson
    openNotificationWithIcon(status, 'Error', msg)
    yield put(getRoomAsync.failure(err));
  }
}

export default function* mainSaga() {
  yield takeLatest(getRoomAsync.request, getRoomSaga);
}
