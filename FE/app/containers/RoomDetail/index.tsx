import React, { useState, useEffect, useRef, useCallback } from 'react'

import history from 'utils/history';
import { PATH } from 'navigate'
import { useDispatch, useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import saga from './redux/saga';
import reducer from './redux/reducer';
import { getRoomAsync, leaveRoomAsync, updateUserAcceptCalling } from './redux/actions'
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { makeSelectCurrentUser } from 'containers/App/redux/selectors'
import { makeSelectRoom } from './redux/selectors'

import useMQTTService from 'services/useMQTTService'
import { MQTT_TOPIC } from 'types/mqttService'
import Peer from "simple-peer";
import { dynamicTopic } from 'utils/common'

import VideoRoom from 'components/VideoRoom';
import BoardGame from 'components/BoardGame'
import { Container, BoardWrapper, RightWrapper } from './styles'
import { RefVideo } from './types'
import Paper from 'paper';
import { Modal } from 'antd';
import { Popover, Button } from 'antd';

const CanvasId = 'canvas'
const key = 'roomDetail'

const CALLING_STATE = {
  NONE: 'NONE',
  CALLING: 'CALLING',
  ACCEPT: 'ACCEPT',
  CALLING_SUCCESS: 'CALLING_SUCCESS'
}

const stateSelector = createStructuredSelector({
  currentUser: makeSelectCurrentUser(),
  roomDetail: makeSelectRoom(),
});

function RoomDetail(props) {
  useInjectReducer({ key: key, reducer: reducer });
  useInjectSaga({ key: key, saga: saga });
  const { currentUser, roomDetail } = useSelector(stateSelector);
  const { mqttService, mqttData } = useMQTTService()
  const dispatch = useDispatch();
  const roomId = props.match.params.id;

  const [topics, _] = useState({
    SEND_CALLING: dynamicTopic(MQTT_TOPIC.SEND_CALLING, roomId),
    RECEIVE_CALLING: dynamicTopic(MQTT_TOPIC.RECEIVE_CALLING, roomId, currentUser?.id),
    SEND_DRAWING: dynamicTopic(MQTT_TOPIC.SEND_DRAWING, roomId),
    RECEIVE_DRAWING: dynamicTopic(MQTT_TOPIC.RECEIVE_DRAWING, roomId),
    GET_USER_IN_ROOM: dynamicTopic(MQTT_TOPIC.GET_USER_IN_ROOM, roomId),
    USER_JOIN: dynamicTopic(MQTT_TOPIC.USER_JOIN, roomId),
    USER_SENDING_SIGNAL: dynamicTopic(MQTT_TOPIC.USER_SENDING_SIGNAL, roomId),
    USER_RETURNING_SIGNAL: dynamicTopic(MQTT_TOPIC.USER_RETURNING_SIGNAL, roomId),
    USER_RECEIVING_RETURNED_SIGNAL: dynamicTopic(MQTT_TOPIC.USER_RECEIVING_RETURNED_SIGNAL, roomId, currentUser?.id)
  });

  const localStreamRef = useRef<RefVideo>();
  const ownerVideoRef = useRef<RefVideo>();
  const peersRef = useRef([]);
  const [ownerId, setOwnerId] = useState(null);
  const [userList, setUserList] = useState([]);
  const [dataDrawing, setDataDrawing] = useState([]);
  const [isCalling, setIsCalling] = useState(CALLING_STATE.NONE);

  useEffect(() => {
    dispatch(getRoomAsync.request({ roomId }));
    mqttService.sub([
      topics.RECEIVE_CALLING,
      topics.RECEIVE_DRAWING,
      topics.GET_USER_IN_ROOM,
      topics.USER_JOIN,
      topics.USER_RECEIVING_RETURNED_SIGNAL
    ])
    navigator.mediaDevices.getUserMedia({
      video: {
        width: 120
      }, audio: true
    }).then((stream) => {
      if (stream) {
        localStreamRef.current = stream;
        ownerVideoRef.current.srcObject = stream;
      }
    })
    window.onhashchange = function () {
      handleLeaveRoom();
    }
    return () => {
      mqttService.unSub([
        topics.RECEIVE_CALLING,
        topics.RECEIVE_DRAWING,
        topics.GET_USER_IN_ROOM,
        topics.USER_JOIN,
        topics.USER_RECEIVING_RETURNED_SIGNAL
      ]);
    }
  }, [])

  useEffect(() => {
    if (roomDetail && roomDetail?.id) {
      const roomOwnerId = roomDetail?.owner?.id
      const data = roomDetail?.drawingData || []
      if (data?.length > 0) {
        setDataDrawing(data)
      }
      if (roomOwnerId && roomOwnerId === currentUser?.id) {
        const usersInThisRoom = roomDetail.userList.filter(item => item?.id !== currentUser.id)
        setUserList(usersInThisRoom)
      }
      setOwnerId(roomOwnerId)
      handleDrawing(data)
    }
  }, [roomDetail, roomDetail?.id])

  useEffect(() => {
    if (isCalling === CALLING_STATE.ACCEPT && userList.length > 0) {
      let newUserList = []
      userList.forEach(user => {
        if (user?.isCalled) {
          const peer = createPeer(roomId, currentUser?.id, localStreamRef.current);
          newUserList.push({
            ...user,
            isActive: false,
            peer,
          })
        }
      })
      newUserList.length > 0 && setUserList(newUserList)
      setIsCalling(CALLING_STATE.CALLING_SUCCESS);
    }
  }, [isCalling, userList])


  useEffect(() => {
    if (mqttData?.type) {
      const { type, payload } = mqttData
      handleTopic(type, payload);
    }
  }, [mqttData, mqttData?.type])

  const handleTopic = (topic, payload) => {
    const { data, roomOwnerId } = payload
    switch (topic) {
      case topics.RECEIVE_CALLING: {
        if (isCalling === CALLING_STATE.NONE) {
          Modal.confirm({
            title: 'You have an incoming call from the room owner?',
            onOk() {
              setIsCalling(CALLING_STATE.ACCEPT);
              const payload = {
                roomId,
                userId: currentUser?.id,
                isCalled: true
              }
              dispatch(updateUserAcceptCalling.request(payload))
            },
            onCancel() {
              setIsCalling(CALLING_STATE.NONE);
            },
          });
          setIsCalling(CALLING_STATE.CALLING);
        }
        break;
      }
      case topics.RECEIVE_DRAWING: {
        const { id, drawingData } = data
        const lastUserId = drawingData?.[drawingData.length - 1]?.userId || ''
        if (lastUserId !== currentUser?.id && id === roomId) {
          setDataDrawing(drawingData)
          handleDrawing(drawingData)
        }
        break;
      }
      case topics.GET_USER_IN_ROOM: {
        const usersInThisRoom = data.filter(user => user.id !== currentUser?.id);
        setUserList(usersInThisRoom);
        break;
      }
      case topics.USER_JOIN: {
        const userToSignal = userList.find(user => user.id === data.userToSignal);
        if (userToSignal && !userToSignal?.isActive) {
          const peer = addPeer(roomId, data.userToSignal, data.signal, localStreamRef.current);
          const newUserList = userList.map(user => {
            const result = {
              ...user,
              isActive: true
            }
            if (result.id === data.userToSignal) {
              result.peer = peer;
            }
            return result
          })
          console.log({ newUserList })
          newUserList.length > 0 && setUserList(newUserList)
        }
        break;
      }
      case topics.USER_RECEIVING_RETURNED_SIGNAL: {
        if (currentUser?.id !== roomOwnerId && userList.length > 0) {
          const newUserList = userList.map(user => {
            if (!user.isActive) {
              user.isActive = true
              user?.peer.signal(data.signal);
            }
            return user
          })
          setUserList(newUserList)
        }
        break;
      }
      default:
        break;
    }
  }


  const createPeer = (roomId, userToSignal, stream) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });
    peer.on("signal", signal => {
      mqttService.pub(topics.USER_SENDING_SIGNAL, {
        type: topics.USER_SENDING_SIGNAL,
        payload: {
          message: `USER_SENDING_SIGNAL.`,
          data: { userToSignal, signal, roomId }
        }
      });
    })
    return peer;
  }

  const addPeer = (roomId, userToSignal, incomingSignal, stream) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    })

    peer.on("signal", signal => {
      mqttService.pub(topics.USER_RETURNING_SIGNAL, {
        type: topics.USER_RETURNING_SIGNAL,
        payload: {
          message: `USER_RETURNING_SIGNAL.`,
          data: { userToSignal, signal, roomId }
        }
      });
    })
    peer.signal(incomingSignal);
    return peer;
  }

  const handleCallGuest = (guestId) => {
    mqttService.pub(topics.SEND_CALLING, {
      type: topics.SEND_CALLING,
      payload: {
        message: `The owner room is calling me.`,
        data: {
          guestId: guestId
        }
      }
    });
  }

  const handleUpdateDrawingData = (data: any) => {
    const newDataDrawing = dataDrawing;
    const payload = {
      userId: currentUser?.id,
      roomId,
      ...data
    }
    newDataDrawing.push(payload)
    setDataDrawing(newDataDrawing)
    handleDrawing(newDataDrawing)
    mqttService.pub(topics.SEND_DRAWING, {
      type: topics.SEND_DRAWING,
      payload: {
        message: `Someone drawn.`,
        data: payload
      }
    });

  }

	const handleDrawing = (data) => {
		if (data.length === 0) return
    const canvas: any = document.getElementById(CanvasId);
    const path: any = new Paper.Path();
    path.strokeColor = 'black';
    data.forEach((item) => {
      const { positionOne, positionTwo } = item
      const pointOne = new Paper.Point(positionOne?.x, positionOne?.y);
      path.add(pointOne);
      const pointTwo = new Paper.Point(positionTwo?.x, positionTwo?.y);
      path.add(pointTwo);
    })

    Paper.setup(canvas);
    (Paper as any).view.draw();
  }

  const handleLeaveRoom = () => {
    peersRef.current = new Array()
    ownerVideoRef?.current?.srcObject?.getTracks().forEach(track => track.stop())
    ownerVideoRef?.current?.srcObject = null
    const payload = {
      roomId,
      userId: currentUser?.id,
      cb: (status) => {
        status && history.push({
          pathname: PATH.HOME
        })
      }
    }
    dispatch(leaveRoomAsync.request(payload))
  }

  const HowToPlayContent = (
    <div>
      <p>Please type the keyboard letter <b>w, a, d, s</b> to play game together.</p>
    </div>
  );

  return (
    <Container>
      <button onClick={handleLeaveRoom} className='leaveBtn'>Leave</button>
      <BoardWrapper>
        <BoardGame id={CanvasId} dataDrawing={dataDrawing} onUpdateDrawingData={handleUpdateDrawingData} />
      </BoardWrapper>
      <RightWrapper>
        <Popover className="btn-note" placement="topRight" title="How to play?" content={HowToPlayContent} trigger="hover">
          <Button>How to play?</Button>
        </Popover>
        <video className='owner' ref={ownerVideoRef} muted playsInline autoPlay></video>
        {userList.map((user, index) => (
          <VideoRoom
            key={index}
            user={user}
            ownerId={ownerId}
            currentUserId={currentUser?.id}
            onCallGuest={handleCallGuest}
          />
				))}
      </RightWrapper>
    </Container>
  )
}

export default RoomDetail
