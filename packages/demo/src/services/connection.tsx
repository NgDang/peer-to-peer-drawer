/* tslint:disable */
import io from "socket.io-client";
import Peer from "peerjs";

const endpoint = "http://localhost:8000";
const websocketEndpoint = "http://localhost:8000"

let socketInstance:any = null;
let peers:any = {}

class SocketConnection {
  videoContainer: any = {};
  message: Array<object> = [];
  settings: any;
  streaming: Boolean = false;
  myPeer: Peer;
  socket: any;
  myID: string = "";
  constructor(settings: any) {
    this.settings = settings;
		this.myPeer = new Peer('', {
			host: 'localhost',
			port: 8001
		});
		this.socket = io.connect(websocketEndpoint, {
      secure: true,
      reconnection: true,
      rejectUnauthorized: false,
      reconnectionAttempts: 10,
    });
    this.initializeSocketEvents();
    this.initializePeersEvents();
  }

  initializeSocketEvents = () => {
    this.socket.on("connect", () => {
      console.log("socket connected");
    });
    this.socket.on("user-disconnected", (userID: string) => {
      console.log("user disconnected-- closing peers", userID);
      peers?.[userID] && peers[userID].close();
      this.removeVideo(userID);
    });
    this.socket.on("disconnect", () => {
      console.log("socket disconnected --");
    });
    this.socket.on("error", (err : Error) => {
      console.log("socket error --", err);
    });
		this.socket.on('new-broadcast-messsage', (data: any) => {
			this.message.push(data);
			this.settings.updateInstance('message', this.message);
		});
  };

  initializePeersEvents = () => {
    this.myPeer.on("open", (id) => {
      this.myID = id;
      const roomID = window.location.pathname.split("/")[2];
      const userData = {
        userID: id,
        roomID,
      };
      console.log("peers established and joined room", userData);
      this.socket.emit("join-room", userData);
      this.setNavigatorToStream();
    });
    this.myPeer.on("error", (err) => {
      console.log("peer connection error", err);
      this.myPeer.reconnect();
    });
  };
  setNavigatorToStream = () => {
    this.getVideoAudioStream().then((stream : MediaStream) => {
      if (stream) {
        this.streaming = true;
        this.createVideo({ id: this.myID, stream });
        this.setPeersListeners(stream);
        this.newUserConnection(stream);
      }
    });
  };
  getVideoAudioStream = (video = true, audio = true) => {
    let quality = this.settings.params?.quality;
    if (quality) quality = parseInt(quality);
		const mediaDevices = navigator.mediaDevices as any;
    const myNavigator =
      mediaDevices.getUserMedia ||
      mediaDevices.webkitGetUserMedia ||
      mediaDevices.mozGetUserMedia ||
      mediaDevices.msGetUserMedia;
    return myNavigator({
      video: video
        ? {
            frameRate: quality ? quality : 12,
            noiseSuppression: true,
					width: { min: 120, ideal: 1280, max: 120 },
					height: { min: 80, ideal: 720, max: 80 },
          }
        : false,
      audio: audio,
    });
  };
  createVideo = (createObj : any) => {
    if (!this.videoContainer[createObj.id]) {
      this.videoContainer[createObj.id] = {
        ...createObj,
      };
      const roomContainer = document.getElementById("room-container");
      const videoContainer = document.createElement("div");
      const video = document.createElement("video");
      video.srcObject = this.videoContainer[createObj.id].stream;
      video.id = createObj.id;
      video.autoplay = true;
      if (this.myID === createObj.id) video.muted = true;
      videoContainer.appendChild(video);
      roomContainer.append(videoContainer);
    }
  };

	broadcastMessage = (message: Object) => {
		this.message.push(message);
		this.settings.updateInstance('message', this.message);
		this.socket.emit('broadcast-message', message);
	}

	setPeersListeners = (stream: MediaStream) => {
    this.myPeer.on("call", (call) => {
      call.answer(stream);
      call.on("stream", (userVideoStream) => {
        console.log("user stream data", userVideoStream);
        this.createVideo({ id: call.metadata.id, stream: userVideoStream });
      });
      call.on("close", () => {
        console.log("closing peers listeners", call.metadata.id);
        this.removeVideo(call.metadata.id);
      });
      call.on("error", () => {
        console.log("peer error ------");
        this.removeVideo(call.metadata.id);
      });
      peers[call.metadata.id] = call;
    });
  };
	newUserConnection = (stream: MediaStream) => {
		this.socket.on("new-user-connect", (userData: any) => {
      console.log("New User Connected", userData);
      this.connectToNewUser(userData, stream);
    });
  };
	connectToNewUser(userData : any, stream: MediaStream) {
    const { userID } = userData;
    const call = this.myPeer.call(userID, stream, {
      metadata: { id: this.myID },
    });
    call.on("stream", (userVideoStream) => {
      this.createVideo({ id: userID, stream: userVideoStream, userData });
    });
    call.on("close", () => {
      console.log("closing new user", userID);
      this.removeVideo(userID);
    });
    call.on("error", () => {
      console.log("peer error ------");
      this.removeVideo(userID);
    });
    peers[userID] = call;
  }
  removeVideo = (id: string) => {
    delete this.videoContainer[id];
    const video = document.getElementById(id);
    if (video) video.remove();
  };
	destroyConnection = () => {
    const myMediaTracks = this.videoContainer[this.myID]?.stream.getTracks();
    myMediaTracks?.forEach((track: any) => {
      track.stop();
    });
    socketInstance?.socket.disconnect();
    this.myPeer.destroy();
  };
}

export function createSocketConnectionInstance(settings = {}) {
	return (socketInstance = new SocketConnection(settings));
}
