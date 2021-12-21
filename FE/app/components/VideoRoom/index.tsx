import React, { useRef, useEffect, MutableRefObject } from 'react';
import styled from 'styled-components';

const Wrapper = styled.video`
  height: 40%;
  width: 50%;
`;

function VideoRoom(props: any) {
  const videoRef = useRef() as React.MutableRefObject<HTMLVideoElement>;

  useEffect(() => {
    props?.peer?.on("stream", stream => {
      if (videoRef && videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    })
  }, []);

  return <Wrapper playsInline autoPlay ref={videoRef}></Wrapper>;
}

export default VideoRoom;
