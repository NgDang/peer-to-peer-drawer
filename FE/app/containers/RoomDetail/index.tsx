import React, { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import MQTTService from 'services/MQTTService'
import { MQTT_TOPIC } from 'types/mqttService'

import { createStructuredSelector } from 'reselect';
import { useDispatch, useSelector } from 'react-redux';
import { makeSelectUserListRoom } from './redux/selectors';
import { makeSelectCurrentUser } from 'containers/App/redux/selectors'
import saga from './redux/saga';
import reducer from './redux/reducer';
import { getRoomAsync } from './redux/actions'
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { Container } from './styles'


const Video = (props) => {
  const ref = useRef(null);

  useEffect(() => {
    props.peer.on("stream", stream => {
      ref?.current?.srcObject = stream;
    })
  }, []);

  return (
    <video playsInline autoPlay ref={ref} />
  );
}

const stateSelector = createStructuredSelector({
  currentUser: makeSelectCurrentUser()
});

const RoomDetail = (props) => {

  useInjectReducer({ key: 'roomDetail', reducer: reducer });
  useInjectSaga({ key: 'roomDetail', saga: saga });
  const dispatch = useDispatch();
  const { currentUser } = useSelector(stateSelector);

  const [peers, setPeers] = useState([]);
  const userVideo = useRef();
  const peersRef = useRef([]);
  const roomId = props.match.params.id;
  const currentUserId = currentUser?.id;

  useEffect(() => {
    dispatch(getRoomAsync.request({ roomId }))
    navigator.mediaDevices.getUserMedia({
      video: {
        width: 120
      }, audio: true
    }).then(stream => {
      userVideo.current.srcObject = stream;
      Promise.all(MQTTService.sub(
        [
          MQTT_TOPIC.GET_USER_IN_ROOM,
          MQTT_TOPIC.USER_JOIN,
          MQTT_TOPIC.USER_RECEIVING_RETURNED_SIGNAL
        ])).then(() => {
          MQTTService.handleTopic(MQTT_TOPIC.GET_USER_IN_ROOM, ({ payload }) => {
            const { data } = payload
            console.log({ data })
            const peers = [];
            data.forEach(user => {
              const peer = createPeer(user.id, currentUserId, stream);
              peersRef.current.push({
                peerID: user.id,
                peer,
              })
              peers.push(peer);
            })
            setPeers(peers);
          });

          MQTTService.handleTopic(MQTT_TOPIC.USER_JOIN, ({ payload }) => {
            const { data } = payload;
            const peer = addPeer(data.payload.signal, stream);
            peersRef.current.push({
              peerID: currentUser?.id,
              peer,
            })
            const newPeers = peers;
            newPeers.push(peer);
            setPeers(newPeers);
          });

          MQTTService.handleTopic(MQTT_TOPIC.USER_RECEIVING_RETURNED_SIGNAL, ({ payload }) => {
            const { data } = payload
            const item = peersRef.current.find(p => p.peerID === currentUser?.id);
            // item.peer.signal(data.payload.signal);
          });

        })
    })
    return () => {
      MQTTService.unSub(MQTT_TOPIC.GET_USER_IN_ROOM);
    }
  }, []);


  function createPeer(userSignal, callerID, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });
    peer.on("signal", signal => {
      MQTTService.pub(MQTT_TOPIC.USER_SENDING_SIGNAL, {
        type: MQTT_TOPIC.USER_SENDING_SIGNAL,
        payload: {
          userSignal, callerID, signal
        }
      })
    })
    return peer;
  }

  function addPeer(incomingSignal, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    })

    peer.on("signal", signal => {
      MQTTService.pub(MQTT_TOPIC.USER_RETURNING_SIGNAL, {
        type: MQTT_TOPIC.USER_RETURNING_SIGNAL,
        payload: {
          signal
        }
      })
    })

    peer.signal(incomingSignal);

    return peer;
}


  return (
    <Container>
      <video muted ref={userVideo} autoPlay playsInline />
      {peers.map((peer, index) => {
        return (
          <Video key={index} peer={peer} />
        );
      })}
    </Container>
  );
};

export default RoomDetail;
