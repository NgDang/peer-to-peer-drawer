import io from "socket.io-client";
import Peer from "peerjs";

const endPoint = "http://localhost:8000";

interface io {
  connect: any;
}

const initPeerConnection = () => {
  return new Peer("", {
    host: endPoint,
    secure: true,
  });
};
