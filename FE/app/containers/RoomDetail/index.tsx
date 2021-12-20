/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { createSocketConnectionInstance } from 'services/Socket';

import { Section, } from './styles'


export default function RoomPage() {
  let socketInstance = useRef(null);
  useEffect(() => {
    startConnection();
  }, []);

  const startConnection = () => {
    socketInstance.current = createSocketConnectionInstance({
      params: { quality: 12 },
      userDetails
    });
  }

  return (
    <article>
      <Helmet>
        <title>Room Page</title>
        <meta
          name="description"
          content="A React.js Boilerplate application homepage"
        />
      </Helmet>
      <Section>
        <div id="room-container"></div>
      </Section>
    </article>
  );
}
