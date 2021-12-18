/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';
import history from 'utils/history';
import { PATH } from 'navigate'

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import reducer from './redux/reducer';
import saga from './redux/saga';

import { Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { CenteredSection, Flex, JoinButton } from './styles'

const key = 'home';


export default function HomePage() {
  useInjectReducer({ key: key, reducer: reducer });
  useInjectSaga({ key: key, saga: saga });

  const [userName, setUserName] = useState('');

  const handleChangeUser = (e) => {
    e.preventDefault();
    setUserName(e.target.value)
  }

  const handleJoinRoom = () => {
    console.log('join room')
    history.push(PATH.ROOM)
  }

  return (
    <article>
      <Helmet>
        <title>Home Page</title>
        <meta
          name="description"
          content="A React.js Boilerplate application homepage"
        />
      </Helmet>
      <CenteredSection>
        <Flex>
          <Input
            size="large"
            placeholder="Enter your username"
            prefix={<UserOutlined />}
            value={userName}
            onChange={handleChangeUser}
          />
          <JoinButton type="primary" disabled={!userName} onClick={handleJoinRoom}>
            Join
          </JoinButton>
        </Flex>
      </CenteredSection>
    </article>
  );
}
