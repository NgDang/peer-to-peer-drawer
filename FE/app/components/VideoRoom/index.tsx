import React, { useRef, useEffect } from 'react';
import PhoneCallIcon from 'images/phone-call.svg'
import styled from "styled-components";

const Wrapper = styled.div`
  position: relative;
  img {
    width: 28px;
    height: 28px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    cursor: pointer;
  }
  .username {
    position: absolute;
    right: 0;
  }
`

function VideoRoom(props: any) {
  const videoRef = useRef() as React.MutableRefObject<HTMLVideoElement>;

  const { ownerId, currentUserId, user, onCallGuest } = props;

  if (user?.peer) {
    user?.peer?.on('stream', stream => {
      if (videoRef && videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    });
  }

  const isActiveCaller = user?.id !== ownerId && currentUserId === ownerId && !user?.isActive

  return (
    <Wrapper>
      <span className="username">{user?.name}</span>
      <video playsInline autoPlay ref={videoRef} />
      {isActiveCaller && <img src={PhoneCallIcon} alt="" onClick={() => onCallGuest(user.id)} />}
    </Wrapper>
  );
}

export default VideoRoom;
