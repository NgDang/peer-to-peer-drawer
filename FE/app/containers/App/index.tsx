/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styles/styled-components';
import { Switch, Route } from 'react-router-dom';
import { hot } from 'react-hot-loader/root';
import { PATH } from 'navigate'

import HomePage from 'containers/HomePage/Loadable';
import RoomDetailPage from 'containers/RoomDetail/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import Header from 'components/Header';
// import Footer from 'components/Footer';

import GlobalStyle from '../../global-styles';
import 'antd/dist/antd.css';

const AppWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  margin: 0 auto;
  padding: 0;
  display: flex;
  min-height: 100%;
  flex-direction: column;
`;

function App() {
  return (
    <AppWrapper>
      <Helmet
        titleTemplate="Drawing Demo"
        defaultTitle="Drawing Demo"
      >
        <meta name="description" content="Drawing WebRTC" />
      </Helmet>
      <Header />
      <Switch>
        <Route exact path={PATH.HOME} component={HomePage} />
        <Route path={PATH.ROOM_DETAIL} component={RoomDetailPage} />
        <Route component={NotFoundPage} />
      </Switch>
      {/* <Footer /> */}
      <GlobalStyle />
    </AppWrapper>
  );
}
export default hot(App);
