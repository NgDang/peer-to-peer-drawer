/**
 * Gets the repositories of the user from Github
 */

import { put, takeLatest } from 'redux-saga/effects';
import { getRoomAsync, leaveRoomAsync, updateDrawingDataAsync } from './actions'
import {openNotificationWithIcon} from 'utils/notification'

import request from 'utils/request';
import API_ENDPOINTS from 'utils/apiEndpoints';


export function* getRoomSaga({ payload }) {
  const {roomId } = payload
  const restApiHost = API_ENDPOINTS.GET_ROOM(roomId);
  try {
    const res = yield request(`${restApiHost}`);
    yield put(getRoomAsync.success(res.data));
  } catch (err) {
    const { status = '', error : { msg }} = err.resJson
    openNotificationWithIcon(status, 'Error', msg)
    yield put(getRoomAsync.failure(err));
  }
}

export function* leaveRoomSaga({ payload }) {
  const { roomId, userId } = payload
  const restApiHost = API_ENDPOINTS.LEAVE_ROOM(roomId);
  try {
    const res = yield request(`${restApiHost}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({userId}),
    });
    yield put(leaveRoomAsync.success(res.data));
  } catch (err) {
    const { status, error : { msg }} = err.resJson
    openNotificationWithIcon(status, 'Error', msg)
    yield put(leaveRoomAsync.failure(err));
  }
}

export function* updateDrawingDataSaga({ payload }) {
  const { roomId, userId, data } = payload
  const drawingDataItem = {
    userId,
    ...data
  }
  const restApiHost = API_ENDPOINTS.UPDATE_DRAWING_DATA(roomId);
  try {
    const res = yield request(`${restApiHost}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({drawingDataItem}),
    });
    const drawingData = res?.data?.drawingData || []
    yield put(updateDrawingDataAsync.success(drawingData));
  } catch (err) {
    const { status, error : { msg }} = err.resJson
    openNotificationWithIcon(status, 'Error', msg)
    yield put(updateDrawingDataAsync.failure(err));
  }
}

export default function* mainSaga() {
  yield takeLatest(getRoomAsync.request, getRoomSaga);
  yield takeLatest(leaveRoomAsync.request, leaveRoomSaga);
  yield takeLatest(updateDrawingDataAsync.request, updateDrawingDataSaga);
}
