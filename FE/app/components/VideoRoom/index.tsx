import React, { useRef, useEffect } from 'react';

function VideoRoom(props: any) {
  const videoRef = useRef() as React.MutableRefObject<HTMLVideoElement>;

  useEffect(() => {
    props?.peer?.on('stream', stream => {
      if (videoRef && videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    });
  }, []);

  // eslint-disable-next-line jsx-a11y/media-has-caption
  return <video playsInline autoPlay ref={videoRef} />;
}

export default VideoRoom;
