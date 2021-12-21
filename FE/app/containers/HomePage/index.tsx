/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import history from 'utils/history';
import { PATH } from 'navigate'
import saga from './redux/saga';
import reducer from './redux/reducer';
import { makeSelectRoomList } from './redux/selectors';
import { makeSelectCurrentUser } from 'containers/App/redux/selectors'
import { getAllRoomAsync, createRoomAsync, joinRoomAsync } from './redux/actions'
import { createUserAsync } from 'containers/App/redux/actions'
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import MQTTService from 'services/MQTTService'
import { MQTT_TOPIC } from 'types/mqttService'
import { Input, Row, Col } from 'antd';
import UserModal from 'components/UserModal'
import RoomCard from './components/RoomCard'
import { LeftSidebar, RightContent, Section, Flex, JoinButton, MetaCard } from './styles'

const key = 'home';

const stateSelector = createStructuredSelector({
  roomList: makeSelectRoomList(),
  currentUser: makeSelectCurrentUser(),
});


export default function HomePage() {
  useInjectReducer({ key: key, reducer: reducer });
  useInjectSaga({ key: key, saga: saga });

  const { roomList, currentUser } = useSelector(stateSelector);

  const dispatch = useDispatch();
  const [roomName, setRoomName] = useState('');

  useEffect(() => {
    dispatch(getAllRoomAsync.request());
    Promise.all(MQTTService.sub([MQTT_TOPIC.RELOAD_ROOM])).then(() => {
      MQTTService.handleTopic(MQTT_TOPIC.RELOAD_ROOM, () => {
        dispatch(getAllRoomAsync.request());
      });
    });
    return () => {
      MQTTService.unSub(MQTT_TOPIC.RELOAD_ROOM);
    }
  }, [])

  const handleRoomName = (e) => {
    e.preventDefault();
    setRoomName(e.target.value)
  }

  const handleCreateRoom = () => {
    const payload = {
      userId: currentUser?.id,
      name: roomName
    }
    dispatch(createRoomAsync.request(payload));
    setRoomName('')
  }


  const handleCreateUser = (username: string) => {
    const payload = {
      name: username
    }
    dispatch(createUserAsync.request(payload))
  }

  const handleJoinRoom = (id: string, code: string) => {
    const payload = {
      roomId: id,
      data: {
        code,
        userId: currentUser?.id
      },
      cb: (status) => {
        status && history.push(PATH.ROOM_DETAIL(id))
      }
    }
    dispatch(joinRoomAsync.request(payload));
  }

  return (
    <>
      <Helmet>
        <title>Home Page</title>
        <meta
          name="description"
          content="A React.js Boilerplate application homepage"
        />
      </Helmet>
      <Section>
        <LeftSidebar>
          <Flex>
            <Input
              placeholder="Enter your room name"
              value={roomName}
              onChange={handleRoomName}
            />
            <JoinButton type="primary" disabled={!roomName} onClick={handleCreateRoom}>
              Create
            </JoinButton>
          </Flex>
        </LeftSidebar>
        <RightContent>
          <Row gutter={[16, 16]}>
            {roomList.map((room, key) =>
              <Col key={key} span={8}><RoomCard room={room} onJoinRoom={handleJoinRoom} /></Col>
            )}
          </Row>
        </RightContent>
      </Section>
      <UserModal currentUser={currentUser} onCreate={handleCreateUser} />
    </>
  );
}
