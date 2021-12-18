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
import { getAllRoomAsync, createRoomAsync } from './redux/actions'
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

import { Input, Row, Col } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { LeftSidebar, RightContent, Section, Flex, JoinButton, MetaCard } from './styles'

const key = 'home';

const stateSelector = createStructuredSelector({
  roomList: makeSelectRoomList(),
});


export default function HomePage() {
  useInjectReducer({ key: key, reducer: reducer });
  useInjectSaga({ key: key, saga: saga });

  const { roomList } = useSelector(stateSelector);

  const dispatch = useDispatch();
  const [roomName, setRoomName] = useState('');

  useEffect(() => {
    dispatch(getAllRoomAsync.request());
  }, [])

  const handleRoomName = (e) => {
    e.preventDefault();
    setRoomName(e.target.value)
  }

  const handleCreateRoom = () => {
    const payload = {
      userId: '1',
      name: roomName
    }
    dispatch(createRoomAsync.request(payload));
    setRoomName('')
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
              size="large"
              placeholder="Enter your room name"
              prefix={<UserOutlined />}
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
              <Col span={8}><MetaCard title={room.name} description={room.owner.name} /></Col>
            )}
          </Row>
        </RightContent>
      </Section>
    </>
  );
}
