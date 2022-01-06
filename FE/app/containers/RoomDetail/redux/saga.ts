/**
 * Gets the repositories of the user from Github
 */

import { put, takeLatest } from 'redux-saga/effects';
import { getRoomAsync, leaveRoomAsync, updateDrawingDataAsync, updateUserAcceptCalling } from './actions'
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
  const { roomId, userId, cb } = payload
  const restApiHost = API_ENDPOINTS.LEAVE_ROOM(roomId);
  try {
    const res = yield request(`${restApiHost}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({userId}),
    });
    cb && cb(true)
    yield put(leaveRoomAsync.success(res.data));
  } catch (err) {
    const { status, error : { msg }} = err.resJson
    openNotificationWithIcon(status, 'Error', msg)
    cb && cb(false)
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

export function* updateUserAcceptCallingSaga({ payload }) {
  const { roomId, userId, isCalled } = payload
  const dataUpdate = {
    userId,
    isCalled
  }
  const restApiHost = API_ENDPOINTS.UPDATE_USER_LIST(roomId);
  try {
    const res = yield request(`${restApiHost}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({...dataUpdate}),
    });
    const userList = res?.data?.userList || []
    yield put(updateUserAcceptCalling.success(userList));
  } catch (err) {
    const { status, error : { msg }} = err.resJson
    openNotificationWithIcon(status, 'Error', msg)
    yield put(updateUserAcceptCalling.failure(err));
  }
}

export default function* mainSaga() {
  yield takeLatest(getRoomAsync.request, getRoomSaga);
  yield takeLatest(leaveRoomAsync.request, leaveRoomSaga);
  yield takeLatest(updateDrawingDataAsync.request, updateDrawingDataSaga);
  yield takeLatest(updateUserAcceptCalling.request, updateUserAcceptCallingSaga);
}
