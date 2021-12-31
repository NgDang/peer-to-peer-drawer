import React, { useState, useEffect, useRef, useCallback } from 'react'

import history from 'utils/history';
import { PATH } from 'navigate'
import { useDispatch, useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import saga from './redux/saga';
import reducer from './redux/reducer';
import { getRoomAsync, leaveRoomAsync } from './redux/actions'
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { makeSelectCurrentUser } from 'containers/App/redux/selectors'
import { makeSelectRoom } from './redux/selectors'

import MQTTService from 'services/MQTTService'
import { MQTT_TOPIC } from 'types/mqttService'
import Peer from "simple-peer";
import { dynamicTopic } from 'utils/common'

import VideoRoom from 'components/VideoRoom';
import BoardGame from 'components/BoardGame'
import { Container, BoardWrapper, RightWrapper } from './styles'
import { RefVideo } from './types'
import Paper from 'paper';

const CanvasId = 'canvas'
const key = 'roomDetail'

const stateSelector = createStructuredSelector({
  currentUser: makeSelectCurrentUser(),
  roomDetail: makeSelectRoom()
});

function RoomDetail(props) {
  useInjectReducer({ key: key, reducer: reducer });
  useInjectSaga({ key: key, saga: saga });
  const { currentUser, roomDetail } = useSelector(stateSelector);
  const dispatch = useDispatch();

  const roomId = props.match.params.id;

  const TOPICS = {
    GET_USER_IN_ROOM: dynamicTopic(MQTT_TOPIC.GET_USER_IN_ROOM, roomId),
    USER_JOIN: dynamicTopic(MQTT_TOPIC.USER_JOIN, roomId, currentUser?.id),
    USER_RECEIVING_RETURNED_SIGNAL: dynamicTopic(MQTT_TOPIC.USER_RECEIVING_RETURNED_SIGNAL, roomId),
    RECEIVE_DRAWING: dynamicTopic(MQTT_TOPIC.RECEIVE_DRAWING, roomId),
    SEND_DRAWING: dynamicTopic(MQTT_TOPIC.SEND_DRAWING, roomId),
    USER_SENDING_SIGNAL: dynamicTopic(MQTT_TOPIC.USER_SENDING_SIGNAL, roomId),
    USER_RETURNING_SIGNAL: dynamicTopic(MQTT_TOPIC.USER_RETURNING_SIGNAL, roomId)
  }

  const ownerVideoRef = useRef<RefVideo>();
  const peersRef = useRef([]);
	const [peers, setPeers] = useState([]);
  const [dataDrawing, setDataDrawing] = useState([]);


  useEffect(() => {
    getLocalStream();
    dispatch(getRoomAsync.request({ roomId }));
    clientDrawing();
    window.onhashchange = function () {
      handleLeaveRoom();
    }
  }, [])

  useEffect(() => {
    if (roomDetail && roomDetail?.id) {
      const data = roomDetail?.drawingData || []
      if (data?.length > 0) {
        setDataDrawing(data)
      }
      handleDrawing(data)
    }
  }, [roomDetail, roomDetail?.id])

  const getLocalStream = async () => {
    const stream: MediaStream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: 120
      }, audio: true
    })
    if (stream) {
      ownerVideoRef.current.srcObject = stream;

      const arrPromise = MQTTService.sub([
        TOPICS.GET_USER_IN_ROOM,
        TOPICS.USER_JOIN,
        TOPICS.USER_RECEIVING_RETURNED_SIGNAL
      ])
      const statusGetUserInRoom = await arrPromise[0];
      const statusGetUserJoin = await arrPromise[1];
      const statusGetUserReceiving = await arrPromise[2];
      const isSuccessSub = statusGetUserInRoom && statusGetUserJoin && statusGetUserReceiving
      if (isSuccessSub) {
        MQTTService.handleTopic([
          TOPICS.GET_USER_IN_ROOM,
          TOPICS.USER_JOIN,
          TOPICS.USER_RECEIVING_RETURNED_SIGNAL
        ], (res: any, topic: string) => {
          const { payload: { data, callerId } } = res
          console.log({ peersRef })
          switch (topic) {
            case TOPICS.GET_USER_IN_ROOM:
              if (currentUser?.id !== callerId) {
                const peersList = [];
                const usersInThisRoom = data.filter(user => user.id !== currentUser?.id);
                usersInThisRoom.forEach(user => {
                  const peer = createPeer(roomId, user.id, stream);
                  peersRef.current.push({
                    peerID: user.id,
                    peer,
                  });
                  peersList.push(peer);
                })
                peersList.length > 0 && setPeers(peersList);
              }
              break;
            case TOPICS.USER_JOIN:
              const peer = addPeer(roomId, data.signal, stream);
              peersRef.current.push({
                peerID: callerId,
                peer,
              })
              setPeers(users => [...users, peer]);
              break;
            case TOPICS.USER_RECEIVING_RETURNED_SIGNAL:
              if (currentUser?.id !== callerId) {
                const item = peersRef.current.find(p => p.peerID === callerId && !item?.active);
                if (item && !item?.active) {
                  item.active = true;
                  item?.peer.signal(data.signal);
                }
              }

              break;
          }
        });
      } else {
        console.log('Subscribe room has error')
      }
    }
  }

  const clientDrawing = async () => {
    const status = await MQTTService.sub([TOPICS.RECEIVE_DRAWING])
    if (status) {
      MQTTService.handleTopic(TOPICS.RECEIVE_DRAWING, (res) => {
				const data = res?.payload?.data || []
				const { id, drawingData } = data
				const lastUserId = drawingData?.[drawingData.length - 1]?.userId || ''
				if (lastUserId !== currentUser?.id && id === roomId) {
					setDataDrawing(drawingData)
					handleDrawing(drawingData)
        }
      });
    }
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
    MQTTService.pub(TOPICS.SEND_DRAWING, {
      type: TOPICS.SEND_DRAWING,
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

	function createPeer(roomId , userToSignal, stream) {
		const peer = new Peer({
			initiator: true,
			trickle: false,
			stream,
		});
		peer.on("signal", signal => {
      MQTTService.pub(TOPICS.USER_SENDING_SIGNAL, {
        type: TOPICS.USER_SENDING_SIGNAL,
				payload: {
					message: `USER_SENDING_SIGNAL.`,
					data: { userToSignal, signal, roomId }
				}
			});
		})
		return peer;
	}

  function addPeer(roomId, incomingSignal, stream) {
		const peer = new Peer({
			initiator: false,
			trickle: false,
			stream,
		})

		peer.on("signal", signal => {
      MQTTService.pub(TOPICS.USER_RETURNING_SIGNAL, {
        type: TOPICS.USER_RETURNING_SIGNAL,
				payload: {
					message: `USER_RETURNING_SIGNAL.`,
					data: { signal, roomId }
				}
			});
		})
		peer.signal(incomingSignal);
		return peer;
	}

  const handleLeaveRoom = () => {
    peersRef.current = new Array()
    MQTTService.unSub(TOPICS.USER_JOIN);
    MQTTService.unSub(TOPICS.USER_RECEIVING_RETURNED_SIGNAL);
    MQTTService.unSub(TOPICS.GET_USER_IN_ROOM);
    ownerVideoRef?.current?.srcObject?.getTracks().forEach(track => track.stop())
    ownerVideoRef?.current?.srcObject = null
    const payload = {
      roomId,
      userId: currentUser?.id
    }
    dispatch(leaveRoomAsync.request(payload))
    history.push({
      pathname: PATH.HOME
    })
  }

  return (
    <Container>
      <button onClick={handleLeaveRoom} className='leaveBtn'>Leave</button>
      <BoardWrapper>
        <BoardGame id={CanvasId} dataDrawing={dataDrawing} onUpdateDrawingData={handleUpdateDrawingData} />

      </BoardWrapper>
      <RightWrapper>
        <video ref={ownerVideoRef} muted playsInline autoPlay></video>
				{peers.map((peer, index) => (
					<VideoRoom key={index} peer={peer} />
				))}
      </RightWrapper>
    </Container>
  )
}

export default RoomDetail
